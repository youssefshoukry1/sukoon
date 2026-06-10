'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, RefreshCw, LayoutDashboard, Search } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:4000/api/orders');
      setOrders(res.data);
    } catch (err) {
      toast.error('حصل مشكلة في تحميل الطلبات.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(o => 
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    o.phoneNumber.includes(search)
  );

  return (
    <div className="min-h-screen bg-cream font-cairo text-dark">
      {/* HEADER */}
      <nav className="bg-deep px-6 md:px-[5%] flex items-center h-16 sticky top-0 z-50 shadow-md">
        <div className="font-playfair text-[20px] tracking-[4px] text-cream flex items-center gap-2">
          <LayoutDashboard size={20} />
          Sukoon Admin
        </div>
        <div className="mr-auto">
          <Link href="/" className="text-[13px] text-light hover:text-white transition-colors">
            الرجوع للموقع
          </Link>
        </div>
      </nav>

      <div className="py-10 px-6 md:px-[5%] max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-playfair text-[28px] text-deep mb-1">لوحة التحكم</h1>
            <p className="text-[13px] text-muted">إدارة الطلبات والعملاء</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input 
                type="text" 
                placeholder="ابحث بالاسم أو الرقم..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-sand rounded-lg pr-10 pl-4 py-2 text-[13px] outline-none focus:border-terra transition-colors"
              />
            </div>
            <button 
              onClick={fetchOrders}
              className="bg-white border border-sand rounded-lg p-2 text-deep hover:bg-sand transition-colors"
              title="تحديث البيانات"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-sand p-6 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-deep/10 rounded-full flex items-center justify-center">
              <Package className="text-deep" />
            </div>
            <div>
              <div className="text-[12px] text-muted font-semibold">إجمالي الطلبات</div>
              <div className="text-[24px] font-bold text-deep">{orders.length}</div>
            </div>
          </div>
          {/* Add more stats as needed */}
        </div>

        {/* ORDERS TABLE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-sand shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-sand/30 border-b border-sand">
                  <th className="p-4 text-[13px] font-semibold text-deep">العميل</th>
                  <th className="p-4 text-[13px] font-semibold text-deep">رقم الموبايل</th>
                  <th className="p-4 text-[13px] font-semibold text-deep">المكان</th>
                  <th className="p-4 text-[13px] font-semibold text-deep">الكمية</th>
                  <th className="p-4 text-[13px] font-semibold text-deep">الإجمالي</th>
                  <th className="p-4 text-[13px] font-semibold text-deep">الحالة</th>
                  <th className="p-4 text-[13px] font-semibold text-deep">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-muted">
                      <Loader2 className="animate-spin mx-auto mb-2" />
                      جاري التحميل...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-muted">لا توجد طلبات.</td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="border-b border-sand/50 hover:bg-sand/10 transition-colors">
                      <td className="p-4 text-[14px] font-semibold">{order.customerName}</td>
                      <td className="p-4 text-[13px]" dir="ltr">{order.phoneNumber}</td>
                      <td className="p-4 text-[13px] text-muted max-w-[200px] truncate" title={order.location}>{order.location}</td>
                      <td className="p-4 text-[14px] font-semibold">{order.quantity}</td>
                      <td className="p-4 text-[14px] font-bold text-terra">{order.totalPrice} ج</td>
                      <td className="p-4">
                        <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status || 'قيد الانتظار'}
                        </span>
                      </td>
                      <td className="p-4 text-[12px] text-muted">
                        {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}