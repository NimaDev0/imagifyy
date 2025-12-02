import logo from "./logo.svg";
import logo_icon from "./logo_icon.svg";
import facebook_icon from "./facebook_icon.svg";
import instagram_icon from "./instagram_icon.svg";
import twitter_icon from "./twitter_icon.svg";
import star_icon from "./star_icon.svg";
import rating_star from "./rating_star.svg";
import sample_img_1 from "./sample_img_1.png";
import sample_img_2 from "./sample_img_2.png";
import profile_img_1 from "./profile_img_1.png";
import profile_img_2 from "./profile_img_2.png";
import step_icon_1 from "./step_icon_1.svg";
import step_icon_2 from "./step_icon_2.svg";
import step_icon_3 from "./step_icon_3.svg";
import email_icon from "./email_icon.svg";
import lock_icon from "./lock_icon.svg";
import cross_icon from "./cross_icon.svg";
import star_group from "./star_group.png";
import credit_star from "./credit_star.svg";
import profile_icon from "./profile_icon.png";

export const assets = {
  logo,
  logo_icon,
  facebook_icon,
  instagram_icon,
  twitter_icon,
  star_icon,
  rating_star,
  sample_img_1,
  sample_img_2,
  email_icon,
  lock_icon,
  cross_icon,
  star_group,
  credit_star,
  profile_icon,
};

export const stepsData = [
  {
    title: "چشم‌انداز خود را توصیف کنید",
    description:
      "یک عبارت، جمله یا پاراگراف تایپ کنید که تصویری را که می‌خواهید ایجاد کنید، توصیف کند.",
    icon: step_icon_1,
  },
  {
    title: "جادو را تماشا کنید",
    description:
      "موتور هوش مصنوعی ما متن شما را در عرض چند ثانیه به یک تصویر منحصر به فرد و با کیفیت بالا تبدیل می‌کند.",
    icon: step_icon_2,
  },
  {
    title: "دانلود و اشتراک‌گذاری",
    description:
      "فوراً اثر خود را دانلود کنید یا آن را مستقیماً از پلتفرم ما با جهان به اشتراک بگذارید.",
    icon: step_icon_3,
  },
];

export const testimonialsData = [
  {
    image: profile_img_1,
    name: "علی کرمی",
    role: "طراح گرافیک",
    stars: 5,
    text: `من تقریباً دو سال است که از bg.removal استفاده می‌کنم، عمدتاً برای اینستاگرام، و فوق‌العاده کاربرپسند بوده و کار من را بسیار آسان‌تر کرده است.`,
  },
  {
    image: profile_img_2,
    name: "حسین ناییجی",
    role: "تولیدکننده محتوا",
    stars: 5,
    text: `من تقریباً دو سال است که از bg.removal استفاده می‌کنم، عمدتاً برای اینستاگرام، و فوق‌العاده کاربرپسند بوده و کار من را بسیار آسان‌تر کرده است.`,
  },
  {
    image: profile_img_1,
    name: "یاسین ایزدی مند",
    role: " طراح وب",
    stars: 5,
    text: `من تقریباً دو سال است که از bg.removal استفاده می‌کنم، عمدتاً برای اینستاگرام، و فوق‌العاده کاربرپسند بوده و کار من را بسیار آسان‌تر کرده است.`,
  },
];

export const plans = [
  {
    id: "پایه",
    price: 10,
    credits: 100,
    desc: "برای استفاده شخصی بهترینه.",
  },
  {
    id: "پیشرفته",
    price: 50,
    credits: 500,
    desc: "بهترین برای استفاده تجاری.",
  },
  {
    id: "کسب و کار",
    price: 250,
    credits: 5000,
    desc: "بهترین برای استفاده سازمانی.",
  },
];
