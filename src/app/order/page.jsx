'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Truck, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function OrderPage() {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const SHIPPING_COST = 50;

  // Fetch the active product from the API
  useEffect(() => {
    axios.get('https://sukoon-api-w5fb.onrender.com/api/product')
      .then(res => {
        const products = res.data.data || [];
        if (products.length > 0) setProduct(products[0]);
      })
      .catch(err => console.error('Failed to fetch product:', err));
  }, []);

  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    location: '',
    quantity: 1,
    paymentMethod: 'Cash on Delivery'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value
    }));
  };
  const Main_Image_Link = "https://res.cloudinary.com/dgksfb9g4/image/upload/f_auto,q_auto/v1782316928/Artboard_6_htbvtx.png"

  const pricePerUnit = product ? product.price : 0;
  const totalPrice = (formData.quantity * pricePerUnit) + SHIPPING_COST;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Connect to the backend
      await axios.post('https://sukoon-api-w5fb.onrender.com/api/orders', {
        ...formData,
        totalPrice
      });

      // Send Email Notification via EmailJS
      try {
        await axios.post('https://api.emailjs.com/api/v1.0/email/send', {
          service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          template_id: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
          user_id: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
          template_params: {
            customerName: formData.customerName,
            phoneNumber: formData.phoneNumber,
            location: formData.location,
            quantity: formData.quantity,
            totalPrice: totalPrice,
          }
        });
      } catch (emailErr) {
        console.error("Failed to send EmailJS notification:", emailErr);
      }

      toast.success('تم تسجيل طلبك بنجاح! هنتواصل معاك قريب.');
      setFormData({
        customerName: '',
        phoneNumber: '',
        location: '',
        quantity: 1,
        paymentMethod: 'Cash on Delivery'
      });
    } catch (err) {
      toast.error('حصل مشكلة في تسجيل الطلب، يرجى المحاولة مرة تانية.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream font-cairo text-dark pb-20">
      {/* HEADER */}
      <nav className="bg-deep px-6 md:px-[5%] flex items-center h-16 sticky top-0 z-50 shadow-md">
        <Link href="/" className="flex items-center gap-2 text-cream hover:text-light transition-colors">
          <ChevronRight size={20} />
          <span className="text-[14px] font-semibold">رجوع للرئيسية</span>
        </Link>
        <div className="mx-auto font-playfair text-[20px] tracking-[4px] text-cream pr-8">
          Sukoon
        </div>
      </nav>

      <div className="pt-10 px-6 md:px-[5%] max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-start">
        
        {/* FORM SECTION */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-sand p-6 md:p-8 shadow-sm order-2 lg:order-1"
        >
          <h1 className="font-playfair text-[28px] text-deep mb-2">إتمام الطلب</h1>
          <p className="text-[13px] text-muted mb-8">أدخل بياناتك وسيتم التواصل معك لتأكيد الشحن</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] text-muted mb-2 font-semibold">الاسم بالكامل</label>
              <input 
                type="text" 
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                className="w-full bg-[#F7F1E4]/50 border border-sand rounded-lg px-4 py-3 text-[14px] text-dark outline-none focus:border-terra transition-colors"
                placeholder="مثال: أحمد محمد"
              />
            </div>

            <div>
              <label className="block text-[13px] text-muted mb-2 font-semibold">رقم الموبايل</label>
              <input 
                type="tel" 
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full bg-[#F7F1E4]/50 border border-sand rounded-lg px-4 py-3 text-[14px] text-dark outline-none focus:border-terra transition-colors text-left"
                placeholder="01xxxxxxxxx"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-[13px] text-muted mb-2 font-semibold">العنوان بالتفصيل (المحافظة، المنطقة، الشارع)</label>
              <textarea 
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                rows={3}
                className="w-full bg-[#F7F1E4]/50 border border-sand rounded-lg px-4 py-3 text-[14px] text-dark outline-none focus:border-terra transition-colors resize-none"
                placeholder="مثال: القاهرة، مدينة نصر، شارع عباس العقاد..."
              ></textarea>
            </div>

            <div>
              <label className="block text-[13px] text-muted mb-2 font-semibold">طريقة الدفع</label>
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="paymentMethod" value="Cash on Delivery" checked={formData.paymentMethod === 'Cash on Delivery'} onChange={handleChange} className="peer sr-only" />
                  <div className="border-2 border-sand rounded-xl p-4 text-center peer-checked:border-terra peer-checked:bg-terra-light/20 transition-all">
                    <Truck className="mx-auto mb-2 text-terra" size={24} />
                    <div className="text-[13px] font-semibold text-deep">الدفع عند الاستلام</div>
                  </div>
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-terra text-white rounded-xl py-4 font-semibold text-[16px] hover:bg-opacity-90 transition-opacity flex items-center justify-center gap-2 mt-8 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'تأكيد الطلب'}
            </button>
            <div className="text-center text-[11px] text-muted mt-4">
              بياناتك محمية ولن يتم مشاركتها مع أي طرف ثالث
            </div>
          </form>
        </motion.div>

        {/* ORDER SUMMARY */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-deep rounded-2xl p-5 md:p-8 text-cream  top-24 order-1 lg:order-2 shadow-lg"
        >
          <h2 className="text-[16px] md:text-[18px] font-semibold mb-4 md:mb-6 flex items-center gap-2 border-b border-mid pb-3 md:pb-4">
            <CheckCircle2 size={18} className="text-terra" />
            ملخص الطلب
          </h2>

          <div className="flex justify-between items-center mb-5 md:mb-6">
            <div className="flex items-center gap-3">
              {/* Real product image from API */}
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 border-mid flex-shrink-0 bg-dark/30">
               
                  <img src={Main_Image_Link} alt={product.name} className="w-full h-full object-cover" />
                
              </div>
              <div>
                <div className="text-[14px] font-semibold">{ 'كوشن Sukoon'}</div>
                <div className="text-[11px] text-light">{'لون اسود (Black)'}</div>
                {/* Real price from API */}

              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-dark/40 rounded-lg p-1">
              <button 
                type="button"
                onClick={() => setFormData(p => ({...p, quantity: Math.max(1, p.quantity - 1)}))}
                className="w-7 h-7 rounded flex items-center justify-center bg-transparent hover:bg-mid transition-colors text-cream"
              >-</button>
              <span className="text-[13px] w-4 text-center">{formData.quantity}</span>
              <button 
                type="button"
                onClick={() => setFormData(p => ({...p, quantity: p.quantity + 1}))}
                className="w-7 h-7 rounded flex items-center justify-center bg-transparent hover:bg-mid transition-colors text-cream"
              >+</button>
            </div>
          </div>

          <div className="space-y-2 md:space-y-3 text-[12px] md:text-[13px] mb-4 md:mb-6 border-b border-mid pb-4 md:pb-6">
            <div className="flex justify-between">
              <span className="text-light">السعر</span>
              <span>{pricePerUnit * formData.quantity} ج</span>
            </div>
            <div className="flex justify-between">
              <span className="text-light">مصاريف الشحن</span>
              <span>{SHIPPING_COST} ج</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-2 md:mt-0">
            <span className="text-[14px] md:text-[15px] font-semibold text-light">الإجمالي</span>
            <span className="text-[20px] md:text-[24px] font-bold text-white">{totalPrice} ج</span>
          </div>

        </motion.div>
      </div>
    </div>
  );
}