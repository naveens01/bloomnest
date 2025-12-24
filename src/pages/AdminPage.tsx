import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, brandApi, categoryApi, productApi, promotionApi, transformBackendCategory, transformBackendBrand, transformBackendProduct } from '../services/api';
import { BackendCategory, BackendBrand, BackendProduct, BackendPromotion } from '../services/api';
import { Plus, Edit, Trash2, X, Save, Upload, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle, LogIn, Megaphone, BarChart3, Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

type TabType = 'dashboard' | 'categories' | 'brands' | 'products' | 'promotions';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Categories state
  const [categories, setCategories] = useState<BackendCategory[]>([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BackendCategory | null>(null);

  // Brands state
  const [brands, setBrands] = useState<BackendBrand[]>([]);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BackendBrand | null>(null);

  // Products state
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<BackendProduct | null>(null);

  // Promotions state
  const [promotions, setPromotions] = useState<BackendPromotion[]>([]);
  const [showPromotionForm, setShowPromotionForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<BackendPromotion | null>(null);

  // Load data
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'dashboard') {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/admin/dashboard?period=30`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to load dashboard data');
        const data = await response.json();
        setDashboardData(data.data);
      } else if (activeTab === 'categories') {
        const response = await adminApi.categories.getAll();
        setCategories(response.data.categories);
      } else if (activeTab === 'brands') {
        const response = await adminApi.brands.getAll();
        setBrands(response.data.brands);
      } else if (activeTab === 'products') {
        const response = await adminApi.products.getAll({ limit: 50 });
        setProducts(response.data.products);
      } else if (activeTab === 'promotions') {
        const response = await adminApi.promotions.getAll();
        setPromotions(response.data.promotions);
      }
    } catch (err: any) {
      console.error('Load data error:', err);
      let errorMessage = err.message || 'Failed to load data';
      
      // Check if it's an authentication error
      if (err.status === 401 || errorMessage.includes('token') || errorMessage.includes('Access denied')) {
        errorMessage = 'Authentication required. Please sign in as an admin user.';
      } else if (err.status === 403) {
        errorMessage = 'Access denied. Admin privileges required.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (message: string, isSuccess = true) => {
    if (isSuccess) {
      setSuccess(message);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-nature-50 to-ocean-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient-eco mb-2">
            Admin Dashboard
          </h1>
          <p className="text-eco-700">Manage your store, view analytics, and track performance</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center space-x-3 mb-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 flex-1">{error}</p>
              <button onClick={() => setError(null)} className="ml-auto">
                <X className="h-5 w-5 text-red-600" />
              </button>
            </div>
            {(error.includes('Authentication required') || error.includes('Access denied')) && (
              <div className="mt-3 pt-3 border-t border-red-200">
                <Link
                  to="/signin"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-eco-500 text-white rounded-lg hover:bg-eco-600 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
                <p className="text-sm text-red-600 mt-2">
                  Note: You need to sign in as an admin user to access this page. If you don't have an admin account, please contact the system administrator.
                </p>
              </div>
            )}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            <p className="text-green-700">{success}</p>
            <button onClick={() => setSuccess(null)} className="ml-auto">
              <X className="h-5 w-5 text-green-600" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-eco-200">
          {(['dashboard', 'categories', 'brands', 'products', 'promotions'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 sm:px-6 sm:py-3 font-semibold rounded-t-xl transition-all duration-300 flex items-center space-x-2 ${
                activeTab === tab
                  ? 'bg-eco-500 text-white shadow-lg'
                  : 'bg-white text-eco-700 hover:bg-eco-50'
              }`}
            >
              {tab === 'dashboard' && <BarChart3 className="h-4 w-4" />}
              {tab === 'promotions' && <Megaphone className="h-4 w-4" />}
              <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 text-eco-600 animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardTab dashboardData={dashboardData} />
            )}
            {activeTab === 'categories' && (
              <CategoriesTab
                categories={categories}
                onRefresh={loadData}
                onMessage={showMessage}
                showForm={showCategoryForm}
                setShowForm={setShowCategoryForm}
                editingCategory={editingCategory}
                setEditingCategory={setEditingCategory}
              />
            )}
            {activeTab === 'brands' && (
              <BrandsTab
                brands={brands}
                onRefresh={loadData}
                onMessage={showMessage}
                showForm={showBrandForm}
                setShowForm={setShowBrandForm}
                editingBrand={editingBrand}
                setEditingBrand={setEditingBrand}
              />
            )}
            {activeTab === 'products' && (
              <ProductsTab
                products={products}
                onRefresh={loadData}
                onMessage={showMessage}
                showForm={showProductForm}
                setShowForm={setShowProductForm}
                editingProduct={editingProduct}
                setEditingProduct={setEditingProduct}
              />
            )}
            {activeTab === 'promotions' && (
              <PromotionsTab
                promotions={promotions}
                onRefresh={loadData}
                onMessage={showMessage}
                showForm={showPromotionForm}
                setShowForm={setShowPromotionForm}
                editingPromotion={editingPromotion}
                setEditingPromotion={setEditingPromotion}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Dashboard Tab Component
interface DashboardTabProps {
  dashboardData: any;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ dashboardData }) => {
  if (!dashboardData) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  const { stats, charts, recentOrders, topProducts, lowStockProducts } = dashboardData;

  // Calculate max values for charts
  const maxRevenue = Math.max(...(charts.revenueByPeriod.map((d: any) => d.revenue) || [0]), 1);
  const maxOrders = Math.max(...(charts.ordersByPeriod.map((d: any) => d.count) || [0]), 1);
  const maxUsers = Math.max(...(charts.usersByPeriod.map((d: any) => d.count) || [0]), 1);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-xs text-green-600 mt-1">+{stats.newUsers} new (30 days)</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              <p className="text-xs text-gray-500 mt-1">Avg: ${stats.averageOrderValue.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <ShoppingCart className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
              <p className="text-xs text-green-600 mt-1">Completed orders</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Users with Orders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.usersWithOrders}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.usersWithoutOrders} without orders</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue (Last 30 Days)</h3>
          <div className="h-64 flex items-end justify-between space-x-1">
            {charts.revenueByPeriod && charts.revenueByPeriod.length > 0 ? (
              charts.revenueByPeriod.map((item: any, index: number) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t transition-all hover:opacity-80 cursor-pointer"
                    style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                    title={`${item.date}: $${item.revenue.toFixed(2)}`}
                  />
                  <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left whitespace-nowrap">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))
            ) : (
              <div className="w-full text-center text-gray-400 py-12">No revenue data</div>
            )}
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders (Last 30 Days)</h3>
          <div className="h-64 flex items-end justify-between space-x-1">
            {charts.ordersByPeriod && charts.ordersByPeriod.length > 0 ? (
              charts.ordersByPeriod.map((item: any, index: number) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all hover:opacity-80 cursor-pointer"
                    style={{ height: `${(item.count / maxOrders) * 100}%` }}
                    title={`${item.date}: ${item.count} orders`}
                  />
                  <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left whitespace-nowrap">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))
            ) : (
              <div className="w-full text-center text-gray-400 py-12">No orders data</div>
            )}
          </div>
        </div>

        {/* User Registrations Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">New Users (Last 30 Days)</h3>
          <div className="h-64 flex items-end justify-between space-x-1">
            {charts.usersByPeriod && charts.usersByPeriod.length > 0 ? (
              charts.usersByPeriod.map((item: any, index: number) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t transition-all hover:opacity-80 cursor-pointer"
                    style={{ height: `${(item.count / maxUsers) * 100}%` }}
                    title={`${item.date}: ${item.count} users`}
                  />
                  <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left whitespace-nowrap">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))
            ) : (
              <div className="w-full text-center text-gray-400 py-12">No user data</div>
            )}
          </div>
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders by Status</h3>
          <div className="space-y-3">
            {charts.ordersByStatus && charts.ordersByStatus.length > 0 ? (
              charts.ordersByStatus.map((item: any) => {
                const total = charts.ordersByStatus.reduce((sum: number, i: any) => sum + i.count, 0);
                const percentage = total > 0 ? (item.count / total) * 100 : 0;
                return (
                  <div key={item.status} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700 capitalize">{item.status}</span>
                      <span className="text-gray-600">{item.count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          item.status === 'delivered' ? 'bg-green-500' :
                          item.status === 'shipped' ? 'bg-blue-500' :
                          item.status === 'processing' ? 'bg-yellow-500' :
                          item.status === 'pending' ? 'bg-gray-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-400 py-12">No order status data</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {recentOrders && recentOrders.length > 0 ? (
              recentOrders.map((order: any) => (
                <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">
                      {order.user?.firstName} {order.user?.lastName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">No recent orders</div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Rated Products</h3>
          <div className="space-y-3">
            {topProducts && topProducts.length > 0 ? (
              topProducts.slice(0, 5).map((product: any) => (
                <div key={product._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {product.images && product.images[0] && (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                      loading="lazy"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-yellow-600">★ {product.ratings?.average?.toFixed(1) || 0}</span>
                      <span className="text-xs text-gray-500">({product.ratings?.count || 0} reviews)</span>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">${product.price?.current || 0}</p>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">No products</div>
            )}
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts && lowStockProducts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>Low Stock Products</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockProducts.map((product: any) => (
              <div key={product._id} className="bg-white p-3 rounded-lg border border-yellow-200">
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-red-600">Stock: {product.inventory?.stock || 0}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Categories Tab Component
interface CategoriesTabProps {
  categories: BackendCategory[];
  onRefresh: () => void;
  onMessage: (message: string, isSuccess?: boolean) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  editingCategory: BackendCategory | null;
  setEditingCategory: (category: BackendCategory | null) => void;
}

const CategoriesTab: React.FC<CategoriesTabProps> = ({
  categories,
  onRefresh,
  onMessage,
  showForm,
  setShowForm,
  editingCategory,
  setEditingCategory,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    isFeatured: false,
    isActive: true,
    sortOrder: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name || '',
        description: editingCategory.description || '',
        shortDescription: editingCategory.shortDescription || '',
        isFeatured: editingCategory.isFeatured || false,
        isActive: true,
        sortOrder: 0,
      });
      setImagePreview(editingCategory.image?.url || null);
    } else {
      resetForm();
    }
  }, [editingCategory]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      shortDescription: '',
      isFeatured: false,
      isActive: true,
      sortOrder: 0,
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('shortDescription', formData.shortDescription);
      formDataToSend.append('isFeatured', formData.isFeatured.toString());
      formDataToSend.append('isActive', formData.isActive.toString());
      formDataToSend.append('sortOrder', formData.sortOrder.toString());
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (editingCategory) {
        await adminApi.categories.update(editingCategory._id, formDataToSend);
        onMessage('Category updated successfully!');
      } else {
        await adminApi.categories.create(formDataToSend);
        onMessage('Category created successfully!');
      }

      resetForm();
      setShowForm(false);
      setEditingCategory(null);
      // Refresh data immediately
      await onRefresh();
    } catch (err: any) {
      onMessage(err.message || 'Failed to save category', false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await adminApi.categories.delete(id);
      onMessage('Category deleted successfully!');
      onRefresh();
    } catch (err: any) {
      onMessage(err.message || 'Failed to delete category', false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-eco-800">Categories</h2>
        <button
          onClick={() => {
            setEditingCategory(null);
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center space-x-2 bg-eco-500 text-white px-4 py-2 rounded-xl hover:bg-eco-600 transition-colors shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">Add Category</span>
        </button>
      </div>

      {showForm && (
        <CategoryForm
          formData={formData}
          setFormData={setFormData}
          imagePreview={imagePreview}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingCategory(null);
            resetForm();
          }}
          onImageChange={handleImageChange}
          submitting={submitting}
          isEditing={!!editingCategory}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
        {categories.map((category) => (
          <CategoryCard
            key={category._id}
            category={category}
            onEdit={() => {
              setEditingCategory(category);
              setShowForm(true);
            }}
            onDelete={() => handleDelete(category._id)}
          />
        ))}
      </div>
    </div>
  );
};

const CategoryCard: React.FC<{
  category: BackendCategory;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ category, onEdit, onDelete }) => {
  const getImageUrl = (url: string | undefined) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
    return `http://localhost:5000/uploads/categories/${url}`;
  };
  const imageUrl = getImageUrl(category.image?.url);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow">
      <div className="relative h-40 mb-4 rounded-lg overflow-hidden bg-eco-100">
        {imageUrl ? (
          <img src={imageUrl} alt={category.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-eco-400" />
          </div>
        )}
      </div>
      <h3 className="font-bold text-lg text-eco-800 mb-2">{category.name}</h3>
      <p className="text-sm text-eco-600 mb-4 line-clamp-2">{category.description}</p>
      <div className="flex items-center justify-between">
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          category.isFeatured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {category.isFeatured ? 'Featured' : 'Regular'}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-eco-600 hover:bg-eco-50 rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const CategoryForm: React.FC<{
  formData: any;
  setFormData: (data: any) => void;
  imagePreview: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  submitting: boolean;
  isEditing: boolean;
}> = ({ formData, setFormData, imagePreview, onSubmit, onCancel, onImageChange, submitting, isEditing }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-eco-800 mb-4">
        {isEditing ? 'Edit Category' : 'Add New Category'}
      </h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-eco-700 mb-2">Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-eco-200 rounded-lg focus:ring-2 focus:ring-eco-400 focus:border-eco-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-eco-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-eco-200 rounded-lg focus:ring-2 focus:ring-eco-400 focus:border-eco-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-eco-700 mb-2">Image</label>
          <div className="flex items-center space-x-4">
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
            )}
            <label className="flex items-center space-x-2 px-4 py-2 bg-eco-100 text-eco-700 rounded-lg cursor-pointer hover:bg-eco-200 transition-colors">
              <Upload className="h-5 w-5" />
              <span>Upload Image</span>
              <input type="file" accept="image/*" onChange={onImageChange} className="hidden" />
            </label>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="rounded border-eco-300 text-eco-600 focus:ring-eco-400"
            />
            <span className="text-sm text-eco-700">Featured</span>
          </label>
        </div>
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-eco-500 text-white px-4 py-2 rounded-lg hover:bg-eco-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-eco-200 text-eco-700 rounded-lg hover:bg-eco-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Brands Tab Component (similar structure)
interface BrandsTabProps {
  brands: BackendBrand[];
  onRefresh: () => void;
  onMessage: (message: string, isSuccess?: boolean) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  editingBrand: BackendBrand | null;
  setEditingBrand: (brand: BackendBrand | null) => void;
}

const BrandsTab: React.FC<BrandsTabProps> = ({
  brands,
  onRefresh,
  onMessage,
  showForm,
  setShowForm,
  editingBrand,
  setEditingBrand,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    industry: '',
    isFeatured: false,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingBrand) {
      setFormData({
        name: editingBrand.name || '',
        description: editingBrand.description || '',
        website: editingBrand.website || '',
        industry: editingBrand.industry || '',
        isFeatured: editingBrand.isFeatured || false,
      });
      setLogoPreview(editingBrand.logo?.url || null);
    } else {
      resetForm();
    }
  }, [editingBrand]);

  const resetForm = () => {
    setFormData({ name: '', description: '', website: '', industry: '', isFeatured: false });
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('website', formData.website);
      formDataToSend.append('industry', formData.industry);
      formDataToSend.append('isFeatured', formData.isFeatured.toString());
      if (logoFile) {
        formDataToSend.append('logo', logoFile);
      }

      if (editingBrand) {
        await adminApi.brands.update(editingBrand._id, formDataToSend);
        onMessage('Brand updated successfully!');
      } else {
        await adminApi.brands.create(formDataToSend);
        onMessage('Brand created successfully!');
      }

      resetForm();
      setShowForm(false);
      setEditingBrand(null);
      // Refresh data immediately
      await onRefresh();
    } catch (err: any) {
      console.error('Save brand error:', err);
      let errorMessage = err.message || 'Failed to save brand';
      
      // Check if it's an authentication error
      if (err.status === 401 || errorMessage.includes('token') || errorMessage.includes('Access denied')) {
        errorMessage = 'Authentication required. Please sign in as an admin user.';
      } else if (err.status === 403) {
        errorMessage = 'Access denied. Admin privileges required.';
      }
      
      onMessage(errorMessage, false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;
    try {
      await adminApi.brands.delete(id);
      onMessage('Brand deleted successfully!');
      onRefresh();
    } catch (err: any) {
      onMessage(err.message || 'Failed to delete brand', false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-eco-800">Brands</h2>
        <button
          onClick={() => {
            setEditingBrand(null);
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center space-x-2 bg-eco-500 text-white px-4 py-2 rounded-xl hover:bg-eco-600 transition-colors shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">Add Brand</span>
        </button>
      </div>

      {showForm && (
        <BrandForm
          formData={formData}
          setFormData={setFormData}
          logoPreview={logoPreview}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingBrand(null);
            resetForm();
          }}
          onLogoChange={handleLogoChange}
          submitting={submitting}
          isEditing={!!editingBrand}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
        {brands.map((brand) => (
          <BrandCard
            key={brand._id}
            brand={brand}
            onEdit={() => {
              setEditingBrand(brand);
              setShowForm(true);
            }}
            onDelete={() => handleDelete(brand._id)}
          />
        ))}
      </div>
    </div>
  );
};

const BrandCard: React.FC<{
  brand: BackendBrand;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ brand, onEdit, onDelete }) => {
  const getImageUrl = (url: string | undefined) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
    return `http://localhost:5000/uploads/brands/${url}`;
  };
  const logoUrl = getImageUrl(brand.logo?.url);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-eco-100 flex items-center justify-center flex-shrink-0">
          {logoUrl ? (
            <img src={logoUrl} alt={brand.name} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="h-8 w-8 text-eco-400" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-eco-800">{brand.name}</h3>
          {brand.industry && (
            <p className="text-sm text-eco-600">{brand.industry}</p>
          )}
        </div>
      </div>
      {brand.description && (
        <p className="text-sm text-eco-600 mb-4 line-clamp-2">{brand.description}</p>
      )}
      <div className="flex items-center justify-between">
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          brand.isFeatured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {brand.isFeatured ? 'Featured' : 'Regular'}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-eco-600 hover:bg-eco-50 rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const BrandForm: React.FC<{
  formData: any;
  setFormData: (data: any) => void;
  logoPreview: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  submitting: boolean;
  isEditing: boolean;
}> = ({ formData, setFormData, logoPreview, onSubmit, onCancel, onLogoChange, submitting, isEditing }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-eco-800 mb-4">
        {isEditing ? 'Edit Brand' : 'Add New Brand'}
      </h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-eco-700 mb-2">Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-eco-200 rounded-lg focus:ring-2 focus:ring-eco-400 focus:border-eco-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-eco-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-eco-200 rounded-lg focus:ring-2 focus:ring-eco-400 focus:border-eco-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-eco-700 mb-2">Website</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full px-4 py-2 border border-eco-200 rounded-lg focus:ring-2 focus:ring-eco-400 focus:border-eco-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-eco-700 mb-2">Industry</label>
          <input
            type="text"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            className="w-full px-4 py-2 border border-eco-200 rounded-lg focus:ring-2 focus:ring-eco-400 focus:border-eco-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-eco-700 mb-2">Logo</label>
          <div className="flex items-center space-x-4">
            {logoPreview && (
              <img src={logoPreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
            )}
            <label className="flex items-center space-x-2 px-4 py-2 bg-eco-100 text-eco-700 rounded-lg cursor-pointer hover:bg-eco-200 transition-colors">
              <Upload className="h-5 w-5" />
              <span>Upload Logo</span>
              <input type="file" accept="image/*" onChange={onLogoChange} className="hidden" />
            </label>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="rounded border-eco-300 text-eco-600 focus:ring-eco-400"
            />
            <span className="text-sm text-eco-700">Featured</span>
          </label>
        </div>
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-eco-500 text-white px-4 py-2 rounded-lg hover:bg-eco-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-eco-200 text-eco-700 rounded-lg hover:bg-eco-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Products Tab Component
interface ProductsTabProps {
  products: BackendProduct[];
  onRefresh: () => void;
  onMessage: (message: string, isSuccess?: boolean) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  editingProduct: BackendProduct | null;
  setEditingProduct: (product: BackendProduct | null) => void;
}

const ProductsTab: React.FC<ProductsTabProps> = ({
  products,
  onRefresh,
  onMessage,
  showForm,
  setShowForm,
  editingProduct,
  setEditingProduct,
}) => {
  const [brands, setBrands] = useState<BackendBrand[]>([]);
  const [categories, setCategories] = useState<BackendCategory[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingBrandsCategories, setLoadingBrandsCategories] = useState(false);

  // Load brands and categories when form is shown or when component mounts
  useEffect(() => {
    if (showForm) {
      loadBrandsAndCategories();
    }
  }, [showForm]);

  const loadBrandsAndCategories = async () => {
    setLoadingBrandsCategories(true);
    try {
      const [brandsRes, categoriesRes] = await Promise.all([
        brandApi.getAll(),
        categoryApi.getAll(),
      ]);
      setBrands(brandsRes.data.brands || []);
      setCategories(categoriesRes.data.categories || []);
    } catch (err) {
      console.error('Failed to load brands/categories:', err);
      onMessage('Failed to load brands or categories. Please refresh the page.', false);
    } finally {
      setLoadingBrandsCategories(false);
    }
  };

  const handleSetFeatured = async (id: string, isFeatured: boolean) => {
    try {
      await adminApi.products.setFeatured(id, isFeatured);
      onMessage(`Product ${isFeatured ? 'marked as featured' : 'unmarked as featured'}!`);
      onRefresh();
    } catch (err: any) {
      onMessage(err.message || 'Failed to update product', false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminApi.products.delete(id);
      onMessage('Product deleted successfully!');
      onRefresh();
    } catch (err: any) {
      onMessage(err.message || 'Failed to delete product', false);
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    originalPrice: '',
    stock: '',
    brand: '',
    category: '',
    status: 'published',
    isFeatured: false,
    features: '',
    tags: '',
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        shortDescription: editingProduct.shortDescription || '',
        price: editingProduct.price?.current?.toString() || '',
        originalPrice: editingProduct.price?.original?.toString() || '',
        stock: editingProduct.inventory?.stock?.toString() || '',
        brand: typeof editingProduct.brand === 'object' ? editingProduct.brand._id : editingProduct.brand || '',
        category: typeof editingProduct.category === 'object' ? editingProduct.category._id : editingProduct.category || '',
        status: editingProduct.status || 'published',
        isFeatured: editingProduct.isFeatured || false,
        features: editingProduct.features?.join(', ') || '',
        tags: editingProduct.tags?.join(', ') || '',
      });
      setImagePreviews(editingProduct.images?.map(img => img.url) || []);
    } else {
      resetForm();
    }
  }, [editingProduct]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      shortDescription: '',
      price: '',
      originalPrice: '',
      stock: '',
      brand: '',
      category: '',
      status: 'published',
      isFeatured: false,
      features: '',
      tags: '',
    });
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      if (formData.shortDescription) {
        formDataToSend.append('shortDescription', formData.shortDescription);
      }
      
      // Price object - send as JSON string or individual fields
      formDataToSend.append('price.current', formData.price);
      if (formData.originalPrice) {
        formDataToSend.append('price.original', formData.originalPrice);
      }
      
      // Inventory object
      formDataToSend.append('inventory.stock', formData.stock);
      
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('isFeatured', formData.isFeatured.toString());
      
      if (formData.features) {
        formData.features.split(',').forEach(feature => {
          const trimmed = feature.trim();
          if (trimmed) {
            formDataToSend.append('features', trimmed);
          }
        });
      }
      if (formData.tags) {
        formData.tags.split(',').forEach(tag => {
          const trimmed = tag.trim();
          if (trimmed) {
            formDataToSend.append('tags', trimmed);
          }
        });
      }
      
      // Add images
      imageFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      if (editingProduct) {
        await adminApi.products.update(editingProduct._id, formDataToSend);
        onMessage('Product updated successfully!');
      } else {
        await adminApi.products.create(formDataToSend);
        onMessage('Product created successfully!');
      }

      resetForm();
      setShowForm(false);
      setEditingProduct(null);
      onRefresh();
    } catch (err: any) {
      console.error('Save product error:', err);
      let errorMessage = err.message || 'Failed to save product';
      if (err.status === 401 || errorMessage.includes('token') || errorMessage.includes('Access denied')) {
        errorMessage = 'Authentication required. Please sign in as an admin user.';
      } else if (err.status === 403) {
        errorMessage = 'Access denied. Admin privileges required.';
      }
      onMessage(errorMessage, false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-eco-800">Products</h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center space-x-2 bg-eco-500 text-white px-4 py-2 rounded-xl hover:bg-eco-600 transition-colors shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">Add Product</span>
        </button>
      </div>

      {showForm && (
        <ProductForm
          formData={formData}
          setFormData={setFormData}
          brands={brands}
          categories={categories}
          imagePreviews={imagePreviews}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
            resetForm();
          }}
          onImageChange={handleImageChange}
          submitting={submitting}
          isEditing={!!editingProduct}
          loadingBrandsCategories={loadingBrandsCategories}
          onRefreshBrandsCategories={loadBrandsAndCategories}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onEdit={() => {
              setEditingProduct(product);
              setShowForm(true);
            }}
            onSetFeatured={(isFeatured) => handleSetFeatured(product._id, isFeatured)}
            onDelete={() => handleDelete(product._id)}
          />
        ))}
      </div>
    </div>
  );
};

const ProductForm: React.FC<{
  formData: any;
  setFormData: (data: any) => void;
  brands: BackendBrand[];
  categories: BackendCategory[];
  imagePreviews: string[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  submitting: boolean;
  isEditing: boolean;
  loadingBrandsCategories: boolean;
  onRefreshBrandsCategories: () => void;
}> = ({ formData, setFormData, brands, categories, imagePreviews, onSubmit, onCancel, onImageChange, submitting, isEditing, loadingBrandsCategories, onRefreshBrandsCategories }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-eco-800 mb-4">
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-eco-700 mb-2">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-eco-200 rounded-lg focus:ring-2 focus:ring-eco-400 focus:border-eco-400"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-eco-700">Brand *</label>
              <button
                type="button"
                onClick={onRefreshBrandsCategories}
                className="text-xs text-eco-600 hover:text-eco-700 underline"
                disabled={loadingBrandsCategories}
              >
                {loadingBrandsCategories ? 'Refreshing...' : 'Refresh Brands'}
              </button>
            </div>
            <select
              required
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              disabled={loadingBrandsCategories}
              className="w-full px-4 py-2 border border-eco-200 rounded-lg focus:ring-2 focus:ring-eco-400 focus:border-eco-400 disabled:opacity-50"
            >
              <option value="">{loadingBrandsCategories ? 'Loading brands...' : 'Select a brand'}</option>
              {brands.length === 0 && !loadingBrandsCategories && (
                <option value="" disabled>No brands available. Add brands first.</option>
              )}
              {brands.map(brand => (
                <option key={brand._id} value={brand._id}>{brand.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-eco-700">Category *</label>
              <button
                type="button"
                onClick={onRefreshBrandsCategories}
                className="text-xs text-eco-600 hover:text-eco-700 underline"
                disabled={loadingBrandsCategories}
              >
                {loadingBrandsCategories ? 'Refreshing...' : 'Refresh Categories'}
              </button>
            </div>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              disabled={loadingBrandsCategories}
              className="w-full px-4 py-2 border border-eco-200 rounded-lg focus:ring-2 focus:ring-eco-400 focus:border-eco-400 disabled:opacity-50"
            >
              <option value="">{loadingBrandsCategories ? 'Loading categories...' : 'Select a category'}</option>
              {categories.length === 0 && !loadingBrandsCategories && (
                <option value="" disabled>No categories available. Add categories first.</option>
              )}
              {categories.map(category => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-eco-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-eco-200 rounded-lg focus:ring-2 focus:ring-eco-400 focus:border-eco-400"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-eco-700 mb-2">Description *</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-eco-200 rounded-lg focus:ring-2 focus:ring-eco-400 focus:border-eco-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-eco-700 mb-2">Short Description</label>
          <textarea
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 border border-eco-200 rounded-lg focus:ring-2 focus:ring-eco-400 focus:border-eco-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-eco-700 mb-2">Price *</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 border border-eco-200 rounded-lg focus:ring-2 focus:ring-eco-400 focus:border-eco-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-eco-700 mb-2">Original Price</label>
            <input
              type="number"
              step="0.01"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
              className="w-full px-4 py-2 border border-eco-200 rounded-lg focus:ring-2 focus:ring-eco-400 focus:border-eco-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-eco-700 mb-2">Stock *</label>
            <input
              type="number"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full px-4 py-2 border border-eco-200 rounded-lg focus:ring-2 focus:ring-eco-400 focus:border-eco-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-eco-700 mb-2">Features (comma-separated)</label>
            <input
              type="text"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="Feature 1, Feature 2, Feature 3"
              className="w-full px-4 py-2 border border-eco-200 rounded-lg focus:ring-2 focus:ring-eco-400 focus:border-eco-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-eco-700 mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="tag1, tag2, tag3"
              className="w-full px-4 py-2 border border-eco-200 rounded-lg focus:ring-2 focus:ring-eco-400 focus:border-eco-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-eco-700 mb-2">Product Images</label>
          <div className="flex flex-wrap gap-4 mb-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img src={preview} alt={`Preview ${index + 1}`} className="w-20 h-20 object-cover rounded-lg" />
              </div>
            ))}
          </div>
          <label className="flex items-center space-x-2 px-4 py-2 bg-eco-100 text-eco-700 rounded-lg cursor-pointer hover:bg-eco-200 transition-colors">
            <Upload className="h-5 w-5" />
            <span>Upload Images</span>
            <input type="file" accept="image/*" multiple onChange={onImageChange} className="hidden" />
          </label>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="rounded border-eco-300 text-eco-600 focus:ring-eco-400"
            />
            <span className="text-sm text-eco-700">Featured</span>
          </label>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-eco-500 text-white px-4 py-2 rounded-lg hover:bg-eco-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-eco-200 text-eco-700 rounded-lg hover:bg-eco-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const ProductCard: React.FC<{
  product: BackendProduct;
  onEdit: () => void;
  onSetFeatured: (isFeatured: boolean) => void;
  onDelete: () => void;
}> = ({ product, onEdit, onSetFeatured, onDelete }) => {
  const getImageUrl = (url: string | undefined) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
    return `http://localhost:5000/uploads/products/${url}`;
  };
  const imageUrl = getImageUrl(product.images?.[0]?.url);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow">
      <div className="relative h-40 mb-4 rounded-lg overflow-hidden bg-eco-100">
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-eco-400" />
          </div>
        )}
        {product.isFeatured && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Featured
          </div>
        )}
      </div>
      <h3 className="font-bold text-lg text-eco-800 mb-2 line-clamp-1">{product.name}</h3>
      <p className="text-eco-600 text-sm mb-2">{product.brand?.name || 'Unknown Brand'}</p>
      <p className="text-eco-800 font-bold text-lg mb-4">${product.price.current}</p>
      <div className="flex items-center justify-between">
        <button
          onClick={() => onSetFeatured(!product.isFeatured)}
          className={`px-3 py-1 rounded text-xs font-semibold ${
            product.isFeatured
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {product.isFeatured ? 'Featured' : 'Set Featured'}
        </button>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-eco-600 hover:bg-eco-50 rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Promotions Tab Component
interface PromotionsTabProps {
  promotions: BackendPromotion[];
  onRefresh: () => void;
  onMessage: (message: string, isSuccess?: boolean) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  editingPromotion: BackendPromotion | null;
  setEditingPromotion: (promotion: BackendPromotion | null) => void;
}

const PromotionsTab: React.FC<PromotionsTabProps> = ({
  promotions,
  onRefresh,
  onMessage,
  showForm,
  setShowForm,
  editingPromotion,
  setEditingPromotion,
}) => {
  const [formData, setFormData] = useState<Partial<BackendPromotion>>({
    title: '',
    subtitle: '',
    description: '',
    type: 'card',
    badge: '',
    bgColor: 'bg-eco-gradient',
    textColor: 'text-eco-900',
    icon: 'Gift',
    ecoIcon: 'Leaf',
    cta: { text: 'Shop Now', link: '' },
    isActive: true,
    isFeatured: false,
    displayOrder: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingPromotion) {
      setFormData({
        title: editingPromotion.title || '',
        subtitle: editingPromotion.subtitle || '',
        description: editingPromotion.description || '',
        type: editingPromotion.type || 'card',
        badge: editingPromotion.badge || '',
        bgColor: editingPromotion.bgColor || 'bg-eco-gradient',
        textColor: editingPromotion.textColor || 'text-eco-900',
        icon: editingPromotion.icon || 'Gift',
        ecoIcon: editingPromotion.ecoIcon || 'Leaf',
        cta: editingPromotion.cta || { text: 'Shop Now', link: '' },
        image: editingPromotion.image || { url: '', alt: '' },
        isActive: editingPromotion.isActive ?? true,
        isFeatured: editingPromotion.isFeatured ?? false,
        displayOrder: editingPromotion.displayOrder || 0,
        startDate: editingPromotion.startDate,
        endDate: editingPromotion.endDate,
      });
    } else {
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        type: 'card',
        badge: '',
        bgColor: 'bg-eco-gradient',
        textColor: 'text-eco-900',
        icon: 'Gift',
        ecoIcon: 'Leaf',
        cta: { text: 'Shop Now', link: '' },
        isActive: true,
        isFeatured: false,
        displayOrder: 0,
      });
    }
  }, [editingPromotion, showForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingPromotion) {
        await adminApi.promotions.update(editingPromotion._id, formData);
        onMessage('Promotion updated successfully!');
      } else {
        await adminApi.promotions.create(formData);
        onMessage('Promotion created successfully!');
      }
      setShowForm(false);
      setEditingPromotion(null);
      onRefresh();
    } catch (err: any) {
      onMessage(err.message || 'Failed to save promotion', false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return;
    try {
      await adminApi.promotions.delete(id);
      onMessage('Promotion deleted successfully!');
      onRefresh();
    } catch (err: any) {
      onMessage(err.message || 'Failed to delete promotion', false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-eco-800">Promotions</h2>
        <button
          onClick={() => {
            setEditingPromotion(null);
            setShowForm(true);
          }}
          className="bg-eco-500 text-white px-4 py-2 rounded-lg hover:bg-eco-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Promotion</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-400"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'banner' | 'card' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-400"
                required
              >
                <option value="banner">Banner</option>
                <option value="card">Card</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-400"
                placeholder="e.g., LIMITED TIME"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
              <input
                type="text"
                value={formData.bgColor}
                onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-400"
                placeholder="bg-eco-gradient"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
              <input
                type="text"
                value={formData.textColor}
                onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-400"
                placeholder="text-eco-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                value={formData.image?.url || ''}
                onChange={(e) => setFormData({ ...formData, image: { ...formData.image, url: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-400"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
              <input
                type="text"
                value={formData.cta?.text || ''}
                onChange={(e) => setFormData({ ...formData, cta: { ...formData.cta, text: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-400"
                placeholder="Shop Now"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
              <input
                type="url"
                value={formData.cta?.link || ''}
                onChange={(e) => setFormData({ ...formData, cta: { ...formData.cta, link: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-400"
                placeholder="/products"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-400"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Featured</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingPromotion(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-eco-500 text-white rounded-lg hover:bg-eco-600 disabled:opacity-50 flex items-center space-x-2"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{editingPromotion ? 'Update' : 'Create'}</span>
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
        {promotions.map((promotion) => (
          <div key={promotion._id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{promotion.title}</h3>
                {promotion.subtitle && (
                  <p className="text-sm text-gray-600">{promotion.subtitle}</p>
                )}
              </div>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                promotion.type === 'banner' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              }`}>
                {promotion.type}
              </span>
            </div>
            {promotion.description && (
              <p className="text-sm text-gray-700 mb-4 line-clamp-2">{promotion.description}</p>
            )}
            <div className="flex items-center space-x-2 mb-4">
              {promotion.isActive && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">Active</span>
              )}
              {promotion.isFeatured && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">Featured</span>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setEditingPromotion(promotion);
                  setShowForm(true);
                }}
                className="flex-1 px-3 py-2 bg-eco-500 text-white rounded-lg hover:bg-eco-600 transition-colors flex items-center justify-center space-x-1"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(promotion._id)}
                className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {promotions.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Megaphone className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No promotions yet. Create your first promotion!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;

