'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, ThumbsUp, Medal, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch('https://sukoon-api-w5fb.onrender.com/api/product');
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setProductData(data.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };
    fetchProduct();
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="overflow-x-hidden">
      {/* NAV */}
      <nav className="bg-deep px-6 md:px-[5%] flex justify-between items-center h-16 sticky top-0 z-50 shadow-md">
        <Link href="/" className="font-playfair text-[22px] tracking-[5px] text-cream">
          Sukoon
        </Link>
        <span className="text-[12px] text-light tracking-[1px] hidden md:inline">
          راحة لتركيز يدوم
        </span>
        <Link
          href="/order"
          className="bg-terra text-white rounded-md px-4 py-2 font-cairo text-[13px] font-semibold transition-opacity hover:opacity-90"
        >
          اطلب دلوقتي
        </Link>
      </nav>

      {/* HERO */}
      <section className="bg-cream">
        <div className="py-10 md:py-16 px-6 md:px-[5%] grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-[1100px] mx-auto text-center md:text-right">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="text-[11px] tracking-[3px] uppercase text-terra font-bold mb-3">
              كوشن طبي محمول
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-playfair text-[32px] md:text-[42px] text-deep leading-[1.2] mb-4">
              اقعد <span className="text-terra">براحة</span>،<br />وذاكر بثقة
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[16px] md:text-[17px] text-muted mb-6 leading-[1.7]">
              مصنوع خصيصاً لطلاب الثانوية العامة —<br />
              لاتكس طبيعي + كتان فاخر + سهل الحمل
            </motion.p>
            <motion.div variants={fadeUp} className="flex justify-center md:justify-start items-baseline gap-3 mb-8">
              <span className="text-[18px] text-[#bbb] line-through">350 ج</span>
              <span className="text-[32px] md:text-[36px] font-semibold text-deep">279 ج</span>
              <span className="bg-terra-light text-terra text-[12px] font-semibold px-3 py-1 rounded-full">وفر 71 ج</span>
            </motion.div>
            <motion.div variants={fadeUp} className="flex justify-center md:justify-start gap-3 flex-wrap">
              <Link href="/order" className="bg-deep text-cream rounded-lg px-8 py-3 font-semibold transition-transform hover:-translate-y-1 shadow-sm">
                اطلب دلوقتي
              </Link>
              <a href="#features" className="bg-transparent text-deep border-[1.5px] border-deep rounded-lg px-6 py-3 font-medium transition-colors hover:bg-deep hover:text-cream">
                اعرف أكتر
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex justify-center items-center relative mt-10 md:mt-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-[260px] h-[260px] md:w-[320px] md:h-[320px] bg-sand rounded-full flex items-center justify-center">
              <div className="relative flex flex-col items-center">
                {productData?.image ? (
                  <img
                    src={productData.image}
                    alt={productData.name}
                    className="w-[200px] h-[120px] md:w-[240px] md:h-[150px] object-cover rounded-[30px] md:rounded-[40px] shadow-lg relative z-10"
                  />
                ) : (
                  <div className="w-[200px] h-[120px] md:w-[240px] md:h-[150px] bg-sand rounded-[30px] md:rounded-[40px] border-2 border-sand-dark flex items-center justify-center overflow-hidden relative z-10">
                    <div className="absolute w-full h-[1px] bg-sand-dark opacity-40 top-1/2"></div>
                    <div className="absolute h-full w-[1px] bg-sand-dark opacity-40 left-1/2"></div>
                    <div className="w-[150px] h-[80px] md:w-[180px] md:h-[100px] bg-[#D4C09A] rounded-[24px] md:rounded-[28px] border-[1.5px] border-[#B89B6E]"></div>
                  </div>
                )}
                {/* Shadow */}
                <div className="w-[36px] md:w-[44px] h-[12px] md:h-[14px] bg-mid rounded-full absolute -bottom-5 left-1/2 -translate-x-1/2"></div>
              </div>

              {productData?.name && (
                <motion.div
                  className="absolute top-8 md:top-10 left-2 md:left-5 bg-deep text-cream text-[10px] md:text-[11px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap shadow-md z-20"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                >
                  {productData.name}
                </motion.div>
              )}

              {productData?.subtitle && (
                <motion.div
                  className="absolute bottom-8 md:bottom-10 right-2 md:right-5 bg-deep text-cream text-[10px] md:text-[11px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap shadow-md z-20"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                >
                  {productData.subtitle}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <div className="bg-deep py-4 px-4 md:px-[5%] flex justify-center gap-4 md:gap-10 flex-wrap">
        {[
          { text: 'شحن لكل المحافظات', icon: Truck },
          { text: 'الدفع عند الاستلام', icon: ShieldCheck },
          { text: 'لاتكس طبيعي 100%', icon: CheckCircle2 },
          { text: 'ضمان رضا تام', icon: ThumbsUp },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-light text-[12px] md:text-[13px]">
            <div className="w-5 h-5 rounded-full bg-mid flex items-center justify-center shrink-0">
              <item.icon size={12} color="var(--color-cream)" />
            </div>
            {item.text}
          </div>
        ))}
      </div>

      {/* PROBLEM SECTION */}
      <div className="py-16 px-6 md:px-[5%] max-w-[1100px] mx-auto text-center">
        <div className="text-[11px] tracking-[3px] uppercase text-terra font-bold mb-3">المشكلة</div>
        <div className="font-playfair text-[28px] md:text-[30px] text-deep mb-10 leading-[1.3]">
          4 – 8 ساعات يومياً على مقاعد مش مريحة
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {[
            { icon: ShieldCheck, title: "تعب في الظهر", desc: "الجلوس الطويل من غير دعم بيسبب ألم مزمن يأثر على تركيزك" },
            { icon: Medal, title: "قلة التركيز", desc: "لما جسمك مش مرتاح، دماغك بتفضل تفكر في الألم مش في المذاكرة" },
            { icon: Truck, title: "السنتر والبيت", desc: "بتنتقل بين أماكن كتير وكل مكان فيه مقعد مختلف ومش مريح" }
          ].map((prob, i) => (
            <motion.div key={i} variants={fadeUp} className="bg-white rounded-2xl p-6 border border-sand hover:-translate-y-1 transition-transform hover:shadow-lg duration-300">
              <div className="w-12 h-12 bg-terra-light rounded-full mx-auto mb-4 flex items-center justify-center">
                <prob.icon color="var(--color-terra)" />
              </div>
              <h3 className="text-[15px] text-dark font-semibold mb-2">{prob.title}</h3>
              <p className="text-[13px] text-muted leading-[1.6]">{prob.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* FEATURES */}
      <div id="features" className="pb-16 px-6 md:px-[5%] max-w-[1100px] mx-auto">
        <div className="text-[11px] tracking-[3px] uppercase text-terra font-bold mb-3 text-center md:text-right">الحل</div>
        <div className="font-playfair text-[28px] md:text-[30px] text-deep mb-10 leading-[1.3] text-center md:text-right">
          Sukoon — صُمِّم عشانك إنت
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {[
            { title: "لاتكس طبيعي 100%", desc: "الحشوة من لاتكس طبيعي بتوزع ضغط جسمك بالتساوي وبتحافظ على شكلها لفترة طويلة" },
            { title: "غطاء من الكتان الفاخر", desc: "مضاد للتعرق، ناعم جداً ومناسب للجلوس لساعات طويلة، وتقدر تفكه وتغسله بسهولة" },
            { title: "محمول وسهل الاستخدام", desc: "بفضل اليد المدمجة، تقدر تاخده معاك السنتر أو تستخدمه في البيت على مكتبك" },
            { title: "قاعدة غير قابلة للانزلاق", desc: "ثبات تام على أي نوع من الكراسي، سواء خشب أو بلاستيك، مش هيتحرك من مكانه" }
          ].map((feat, i) => (
            <motion.div key={i} variants={fadeUp} className="bg-white rounded-2xl p-6 border border-sand flex gap-4 items-start hover:-translate-y-1 transition-transform hover:shadow-md duration-300">
              <div className="w-11 h-11 bg-[#F0F6F3] rounded-xl flex items-center justify-center shrink-0 border border-[#C8DDD6]">
                <CheckCircle2 color="var(--color-deep)" size={20} />
              </div>
              <div>
                <h3 className="text-[14px] text-deep font-semibold mb-1">{feat.title}</h3>
                <p className="text-[12px] text-muted leading-[1.6]">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* SPECS */}
        <motion.div
          className="bg-white rounded-2xl border border-sand p-8 mt-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x-reverse md:divide-x divide-sand text-center">
            <div className="py-4 md:py-0 md:px-5">
              <div className="text-[22px] font-semibold text-deep mb-1">32x22 cm</div>
              <div className="text-[12px] text-muted">المقاس المثالي</div>
            </div>
            <div className="py-4 md:py-0 md:px-5">
              <div className="text-[22px] font-semibold text-deep mb-1">290 g</div>
              <div className="text-[12px] text-muted">خفيف جداً</div>
            </div>
            <div className="py-4 md:py-0 md:px-5">
              <div className="text-[22px] font-semibold text-deep mb-1">Latex</div>
              <div className="text-[12px] text-muted">المادة الداخلية</div>
            </div>
          </div>
        </motion.div>
      </div>

      <footer className="bg-dark py-8 px-6 text-center">
        <div className="font-playfair text-[20px] tracking-[4px] text-cream mb-2">Sukoon</div>
        <div className="text-[12px] text-muted mb-4">راحة لتركيز يدوم</div>
        <div className="text-[11px] text-[#3D5A4A]">© 2026 Sukoon. All rights reserved.</div>
      </footer>
    </div>
  );
}
