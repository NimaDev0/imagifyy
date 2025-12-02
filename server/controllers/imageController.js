// imageController.js
import userModel from "../models/userModel.js";
import axios from "axios";

const DEFAULT_MODEL = process.env.MODELSLAB_MODEL || "realistic-vision-v51";
const API_KEY = (process.env.MODELSLAB_API || "").trim();
const TIMEOUT_MS = parseInt(process.env.MODELSLAB_TIMEOUT_MS || "20000", 10);
const BASE64_FETCH_RETRIES = 3;
const BASE64_FETCH_RETRY_DELAY_MS = 700; // backoff base

async function fetchBase64WithRetry(url) {
  let lastErr;
  for (let attempt = 1; attempt <= BASE64_FETCH_RETRIES; attempt++) {
    try {
      const resp = await axios.get(url, { responseType: "text", timeout: TIMEOUT_MS, validateStatus: () => true });
      const status = resp.status;
      const ct = (resp.headers["content-type"] || "").toLowerCase();
      if (status === 200 && resp.data) {
        // resp.data should be base64 text
        return resp.data.toString().trim();
      } else {
        lastErr = new Error(`Bad status ${status} fetching base64, content-type=${ct}`);
      }
    } catch (err) {
      lastErr = err;
    }
    // small backoff
    await new Promise(r => setTimeout(r, BASE64_FETCH_RETRY_DELAY_MS * attempt));
  }
  throw lastErr;
}

export const generateImage = async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ success: false, message: "Server misconfiguration: MODELSLAB_API missing" });
  }

  try {
    const prompt = (req.body.prompt || "").toString();
    const modelId = process.env.MODELSLAB_MODEL || DEFAULT_MODEL;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ success: false, message: "کاربر وارد نشده" });
    if (!prompt || prompt.trim().length === 0) return res.status(400).json({ success: false, message: "جزئیات ناقص است" });
    if (prompt.length > 2000) return res.status(400).json({ success: false, message: "prompt خیلی طولانی است" });

    // 1) رزرو اعتبار اتمیک
    const reserved = await userModel.findOneAndUpdate(
      { _id: userId, creditBalance: { $gt: 0 } },
      { $inc: { creditBalance: -1 } },
      { new: true }
    );

    if (!reserved) {
      return res.status(400).json({ success: false, message: "اعتبار شما کافی نیست" });
    }

    // 2) ارسال درخواست به Modelslab
    const body = {
      key: API_KEY,
      model_id: modelId,
      prompt,
      negative_prompt: "",
      width: 512,
      height: 512,
      samples: 1,
      num_inference_steps: 31,
      safety_checker: false,
      guidance_scale: 7.5,
      base64: true
    };

    const mlResp = await axios.post(
      "https://modelslab.com/api/v6/images/text2img",
      body,
      { headers: { "Content-Type": "application/json" }, timeout: TIMEOUT_MS, validateStatus: () => true }
    );

    // لاگ مختصر (برای دیباگ)
    console.log("Modelslab status:", mlResp.status, "body:", mlResp.data?.messege || mlResp.data);

    const data = mlResp.data;
    if (!data || data.status !== "success" || !Array.isArray(data.output) || data.output.length === 0) {
      // خطا → refund اعتبار
      await userModel.findByIdAndUpdate(userId, { $inc: { creditBalance: 1 } });
      const apiMsg = data?.messege || data?.message || JSON.stringify(data);
      return res.status(400).json({ success: false, message: "خطای مدل: " + apiMsg, details: data });
    }

    // اگر متا nsfw را تشخیص داد، refund و abort
    if (data.nsfw_content_detected === true || data.meta?.nsfw_content_detected === true) {
      await userModel.findByIdAndUpdate(userId, { $inc: { creditBalance: 1 } });
      return res.status(403).json({ success: false, message: "محتوای نامناسب تشخیص داده شد" });
    }

    // 3) فچ base64 از URL اول (یا proxy_links fallback)
    const base64Url = data.output[0];
    let base64Text;
    try {
      base64Text = await fetchBase64WithRetry(base64Url);
    } catch (err) {
      // اگر URL اول fail کرد، تلاش کن از proxy_links استفاده کنی
      if (Array.isArray(data.proxy_links) && data.proxy_links.length > 0) {
        try {
          base64Text = await fetchBase64WithRetry(data.proxy_links[0]);
        } catch (err2) {
          // refund و ارور ده
          await userModel.findByIdAndUpdate(userId, { $inc: { creditBalance: 1 } });
          console.error("Failed to fetch base64 from both primary and proxy:", err, err2);
          return res.status(502).json({ success: false, message: "خطا در دانلود تصویر از CDN", details: String(err2) });
        }
      } else {
        await userModel.findByIdAndUpdate(userId, { $inc: { creditBalance: 1 } });
        console.error("Failed to fetch base64:", err);
        return res.status(502).json({ success: false, message: "خطا در دانلود تصویر از CDN", details: String(err) });
      }
    }

    // 4) validate base64 (ساده)
    const b64 = base64Text.replace(/\s+/g, "");
    // حداقل طول منطقی برای یک تصویر کوچک را چک کن (مثال: > 200)
    if (!b64 || b64.length < 200) {
      // refund
      await userModel.findByIdAndUpdate(userId, { $inc: { creditBalance: 1 } });
      return res.status(500).json({ success: false, message: "محتوای دریافت‌شده نامعتبر است" });
    }

    const resultImage = b64.startsWith("data:") ? b64 : `data:image/png;base64,${b64}`;

    // 5) گزینه: کش کن یا ذخیره کن (پیشنهاد) — این قسمت اختیاری است
    // مثال: uploadToR2(resultImage) یا save to disk
    // const storedUrl = await uploadToStorage(resultImage);

    // 6) برگرداندن موفقیت‌آمیز
    const updatedUser = await userModel.findById(userId); // موجودی فعلی را نمایش بده
    return res.json({
      success: true,
      message: "تصویر تولید شد",
      creditBalance: updatedUser.creditBalance,
      resultImage
    });

  } catch (err) {
    console.error("generateImage unexpected error:", err);
    // اگر رزرو انجام شده ولی خطای غیرمنتظره بود، اطمینان از refund
    // (می‌توان با منطق پیچیده‌تر بررسی کرد که رزرو انجام شده یا نه؛ برای سادگی اینجا تلاش می‌کنیم refund بزنیم)
    try {
      if (req.user?.id) {
        await userModel.findByIdAndUpdate(req.user.id, { $inc: { creditBalance: 1 } });
      }
    } catch (e) {
      console.error("failed to refund after unexpected error:", e);
    }
    return res.status(500).json({ success: false, message: err?.message || String(err) });
  }
};
