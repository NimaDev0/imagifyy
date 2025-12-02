import React from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";
const Description = () => {
  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center my-24 p-6 md:px-28">
      <h1 className="text-3xl sm:text-4xl font-semibold mb-2">
        تولید تصویر با هوش مصنوعی
      </h1>
      <p className="text-gray-500 mb-8">تخیل خود را به تصویر تبدیل کنید</p>
      <div className="flex flex-col gap-5 md:gap-14 md:flex-row  items-center">
        <img
          src={assets.sample_img_1}
          alt="smaple"
          className="w-80 xl:w-96 rounded-lg"
        />
        <div>
          <h2 className="text-3xl font-medium max-w-lg mb-4">
            معرفی مولد متن به تصویر مبتنی بر هوش مصنوعی
          </h2>
          <p className="text-gray-600 mb-4">
            چه به تصاویر خیره‌کننده نیاز داشته باشید و چه به تصاویر منحصر به
            فرد، به راحتی با استفاده از مولد تصویر هوش مصنوعی رایگان ما،
            ایده‌های خود را به واقعیت تبدیل کنید. ابزار ما متن شما را تنها با
            چند کلیک به تصاویر چشم‌نواز تبدیل می‌کند. آن را تصور کنید، توصیف
            کنید و فوراً شاهد زنده شدن آن باشید.
          </p>
          <p className="text-gray-600">
            به سادگی یک متن تایپ کنید، و یا هوش مصنوعی پیشرفته تصاویر با کیفیت
            بالا را در عرض چند ثانیه تولید می‌کند. از تصاویر محصول گرفته تا
            طراحی شخصیت‌ها و تجسم آسان. با پشتیبانی از فناوری پیشرفته هوش
            مصنوعی، امکانات خلاقانه بی‌حد و حصر هستند!
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Description;
