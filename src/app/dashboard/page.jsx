'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, RefreshCw, LayoutDashboard, Search, Loader2, Plus, X, Edit, Trash2, Box } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'products'

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [search, setSearch] = useState('');

  // Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', subtitle: '', price: '', image: '', stock: 0
  });

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await axios.get('https://sukoon-api-w5fb.onrender.com/api/orders');
      setOrders(res.data.data || []);
    } catch (err) {
      toast.error('حصل مشكلة في تحميل الطلبات.');
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await axios.get('https://sukoon-api-w5fb.onrender.com/api/product');
      setProducts(res.data.data || []);
    } catch (err) {
      toast.error('حصل مشكلة في تحميل المنتجات.');
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleCancelOrder = async (id) => {
    if (!confirm('هل أنت متأكد من إلغاء وحذف هذا الطلب؟')) return;
    try {
      await axios.delete(`https://sukoon-api-w5fb.onrender.com/api/orders/${id}`);
      toast.success('تم إلغاء الطلب بنجاح');
      fetchOrders();
    } catch (err) {
      toast.error('حدث خطأ أثناء إلغاء الطلب');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setAddingProduct(true);
    try {
      if (editingProductId) {
        await axios.put(`https://sukoon-api-w5fb.onrender.com/api/product/${editingProductId}`, productForm);
        toast.success('تم تحديث المنتج بنجاح!');
      } else {
        await axios.post('https://sukoon-api-w5fb.onrender.com/api/product', productForm);
        toast.success('تم إضافة المنتج بنجاح!');
      }
      setShowProductModal(false);
      setEditingProductId(null);
      setProductForm({ name: '', subtitle: '', price: '', image: '', stock: 0 });
      fetchProducts();
    } catch (err) {
      toast.error('حصل مشكلة أثناء حفظ المنتج.');
      console.error(err);
    } finally {
      setAddingProduct(false);
    }
  };

  const handleEditProduct = (product) => {
    setProductForm({
      name: product.name || '',
      subtitle: product.subtitle || '',
      price: product.price || '',
      image: product.image || '',
      stock: product.stock || 0
    });
    setEditingProductId(product._id);
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      await axios.delete(`https://sukoon-api-w5fb.onrender.com/api/product/${id}`);
      toast.success('تم حذف المنتج بنجاح');
      fetchProducts();
    } catch (err) {
      toast.error('حدث خطأ أثناء الحذف');
      console.error(err);
    }
  };

  const openAddModal = () => {
    setEditingProductId(null);
    setProductForm({ name: '', subtitle: '', price: '', image: '', stock: 0 });
    setShowProductModal(true);
  };

  const filteredOrders = orders.filter(o =>
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    o.phoneNumber.includes(search)
  );

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
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

      <div className="py-10 px-6 md:px-[5%] max-w-[1200px] mx-auto relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-playfair text-[28px] text-deep mb-1">لوحة التحكم</h1>
            <p className="text-[13px] text-muted">إدارة الطلبات والمنتجات</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input
                type="text"
                placeholder={activeTab === 'orders' ? "ابحث في الطلبات..." : "ابحث في المنتجات..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-sand rounded-lg pr-10 pl-4 py-2 text-[13px] outline-none focus:border-terra transition-colors"
              />
            </div>

            {activeTab === 'products' && (
              <button
                onClick={openAddModal}
                className="bg-terra text-white rounded-lg px-4 py-2 text-[13px] font-semibold hover:bg-opacity-90 transition-opacity flex items-center gap-2"
              >
                <Plus size={16} />
                إضافة منتج
              </button>
            )}

            <button
              onClick={() => {
                if (activeTab === 'orders') fetchOrders();
                else fetchProducts();
              }}
              className="bg-white border border-sand rounded-lg p-2 text-deep hover:bg-sand transition-colors"
              title="تحديث البيانات"
            >
              <RefreshCw size={20} className={(loadingOrders || loadingProducts) ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-3 text-[14px] font-semibold rounded-lg transition-colors border ${activeTab === 'orders' ? 'bg-deep text-cream border-deep shadow-md' : 'bg-white text-muted border-sand hover:bg-sand/30'}`}
          >
            <Package size={18} />
            الطلبات
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-6 py-3 text-[14px] font-semibold rounded-lg transition-colors border ${activeTab === 'products' ? 'bg-deep text-cream border-deep shadow-md' : 'bg-white text-muted border-sand hover:bg-sand/30'}`}
          >
            <Box size={18} />
            المنتجات
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-sand p-6 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-deep/10 rounded-full flex items-center justify-center">
              {activeTab === 'orders' ? <Package className="text-deep" /> : <Box className="text-deep" />}
            </div>
            <div>
              <div className="text-[12px] text-muted font-semibold">إجمالي {activeTab === 'orders' ? 'الطلبات' : 'المنتجات'}</div>
              <div className="text-[24px] font-bold text-deep">{activeTab === 'orders' ? orders.length : products.length}</div>
            </div>
          </div>
        </div>

        {/* DATA TABLE */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-sand shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            {activeTab === 'orders' ? (
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
                    <th className="p-4 text-[13px] font-semibold text-deep text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingOrders ? (
                    <tr>
                      <td colSpan="8" className="p-8 text-center text-muted">
                        <Loader2 className="animate-spin mx-auto mb-2" />
                        جاري التحميل...
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="p-8 text-center text-muted">لا توجد طلبات.</td>
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
                          <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                            {order.status || 'قيد الانتظار'}
                          </span>
                        </td>
                        <td className="p-4 text-[12px] text-muted">
                          {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="p-4 flex justify-center items-center h-full pt-6">
                          <button onClick={() => handleCancelOrder(order._id)} className="text-red-600 hover:text-red-800 transition-colors bg-red-50 p-2 rounded" title="إلغاء الطلب">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-sand/30 border-b border-sand">
                    <th className="p-4 text-[13px] font-semibold text-deep">صورة</th>
                    <th className="p-4 text-[13px] font-semibold text-deep">الاسم</th>
                    <th className="p-4 text-[13px] font-semibold text-deep">السعر</th>
                    <th className="p-4 text-[13px] font-semibold text-deep">المخزون</th>
                    <th className="p-4 text-[13px] font-semibold text-deep">الحالة</th>
                    <th className="p-4 text-[13px] font-semibold text-deep text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingProducts ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-muted">
                        <Loader2 className="animate-spin mx-auto mb-2" />
                        جاري التحميل...
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-muted">لا توجد منتجات.</td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product._id} className="border-b border-sand/50 hover:bg-sand/10 transition-colors">
                        <td className="p-4">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover border border-sand" />
                          ) : (
                            <div className="w-12 h-12 bg-sand rounded flex items-center justify-center text-[10px] text-muted border border-sand-dark">بدون صورة</div>
                          )}
                        </td>
                        <td className="p-4 text-[14px] font-semibold">
                          {product.name}
                          {product.subtitle && <div className="text-[11px] text-muted font-normal mt-1">{product.subtitle}</div>}
                        </td>
                        <td className="p-4 text-[14px] font-bold text-terra">{product.price} ج</td>
                        <td className="p-4 text-[14px]">{product.stock || 0}</td>
                        <td className="p-4">
                          <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {product.isActive ? 'نشط' : 'غير نشط'}
                          </span>
                        </td>
                        <td className="p-4 flex gap-2 justify-center items-center h-full pt-6">
                          <button onClick={() => handleEditProduct(product)} className="text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 p-2 rounded">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDeleteProduct(product._id)} className="text-red-600 hover:text-red-800 transition-colors bg-red-50 p-2 rounded">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* ADD / EDIT PRODUCT MODAL */}
        <AnimatePresence>
          {showProductModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
                onClick={() => setShowProductModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl border border-sand w-full max-w-md relative z-10 overflow-hidden shadow-2xl"
              >
                <div className="bg-deep px-6 py-4 flex justify-between items-center text-cream">
                  <h2 className="font-playfair text-[20px]">{editingProductId ? 'تعديل منتج' : 'إضافة منتج جديد'}</h2>
                  <button onClick={() => setShowProductModal(false)} className="hover:text-terra transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleProductSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-[13px] text-muted mb-1 font-semibold">اسم المنتج *</label>
                    <input
                      type="text" required name="name"
                      value={productForm.name} onChange={handleProductChange}
                      className="w-full bg-[#F7F1E4]/30 border border-sand rounded-lg px-3 py-2 text-[14px] outline-none focus:border-terra transition-colors"
                      placeholder="مثال: Sukoon Cushion"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] text-muted mb-1 font-semibold">وصف فرعي (Subtitle)</label>
                    <input
                      type="text" name="subtitle"
                      value={productForm.subtitle} onChange={handleProductChange}
                      className="w-full bg-[#F7F1E4]/30 border border-sand rounded-lg px-3 py-2 text-[14px] outline-none focus:border-terra transition-colors"
                      placeholder="مثال: كوشن طبي محمول"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] text-muted mb-1 font-semibold">السعر *</label>
                      <input
                        type="number" required name="price" min="0"
                        value={productForm.price} onChange={handleProductChange}
                        className="w-full bg-[#F7F1E4]/30 border border-sand rounded-lg px-3 py-2 text-[14px] outline-none focus:border-terra transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] text-muted mb-1 font-semibold">المخزون (Stock)</label>
                      <input
                        type="number" name="stock" min="0"
                        value={productForm.stock} onChange={handleProductChange}
                        className="w-full bg-[#F7F1E4]/30 border border-sand rounded-lg px-3 py-2 text-[14px] outline-none focus:border-terra transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] text-muted mb-1 font-semibold">رابط الصورة (Cloudinary URL)</label>
                    <input
                      type="url" name="image"
                      value={productForm.image} onChange={handleProductChange}
                      className="w-full bg-[#F7F1E4]/30 border border-sand rounded-lg px-3 py-2 text-[14px] outline-none focus:border-terra transition-colors"
                      placeholder="https://res.cloudinary.com/..."
                      dir="ltr"
                    />
                  </div>

                  <button
                    type="submit" disabled={addingProduct}
                    className="w-full bg-terra text-white rounded-lg py-3 mt-4 font-semibold text-[15px] hover:bg-opacity-90 transition-opacity flex justify-center items-center gap-2 disabled:opacity-70"
                  >
                    {addingProduct ? <Loader2 className="animate-spin" size={18} /> : (editingProductId ? 'حفظ التعديلات' : 'حفظ المنتج')}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}