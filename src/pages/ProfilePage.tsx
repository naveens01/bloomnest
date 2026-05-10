import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package, MapPin, Settings, LogOut, Edit, Trash2, Plus, ChevronRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';

interface Order {
  orderNumber: string;
  items: any[];
  total: number;
  status: string;
  createdAt: string;
  shippingAddress: any;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'settings'>('overview');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/signin');
      return;
    }
    
    const parsedUser = JSON.parse(user);
    setCurrentUser(parsedUser);
    setProfileData({
      firstName: parsedUser.firstName || '',
      lastName: parsedUser.lastName || '',
      email: parsedUser.email || '',
      phone: parsedUser.phone || ''
    });

    // Load orders from localStorage
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = { ...currentUser, ...profileData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    setEditingProfile(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'delivered':
        return <Package className="h-5 w-5 text-eco-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-eco-100 text-eco-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (!currentUser) {
    return null;
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'orders', name: 'Orders', icon: Package },
    { id: 'addresses', name: 'Addresses', icon: MapPin },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  return (
    <main className="min-h-screen bg-eco-pattern pt-20 sm:pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient-eco mb-2">My Account</h1>
          <p className="text-eco-600">Manage your profile and orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-eco-glow p-6 border border-eco-200 sticky top-24">
              {/* User Info */}
              <div className="text-center mb-6 pb-6 border-b border-eco-200">
                <div className="w-20 h-20 bg-gradient-to-r from-eco-500 to-nature-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-white">
                    {currentUser.firstName?.charAt(0)}{currentUser.lastName?.charAt(0)}
                  </span>
                </div>
                <h3 className="font-bold text-eco-900">{currentUser.firstName} {currentUser.lastName}</h3>
                <p className="text-sm text-eco-600">{currentUser.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-eco-500 to-nature-500 text-white shadow-eco-glow'
                        : 'text-eco-700 hover:bg-eco-50'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl shadow-eco p-6 border border-eco-200">
                    <div className="flex items-center justify-between mb-2">
                      <Package className="h-8 w-8 text-eco-600" />
                      <span className="text-3xl font-bold text-eco-900">{orders.length}</span>
                    </div>
                    <p className="text-eco-600 font-medium">Total Orders</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-eco p-6 border border-eco-200">
                    <div className="flex items-center justify-between mb-2">
                      <Truck className="h-8 w-8 text-blue-600" />
                      <span className="text-3xl font-bold text-eco-900">
                        {orders.filter(o => o.status === 'shipped').length}
                      </span>
                    </div>
                    <p className="text-eco-600 font-medium">In Transit</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-eco p-6 border border-eco-200">
                    <div className="flex items-center justify-between mb-2">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <span className="text-3xl font-bold text-eco-900">
                        {orders.filter(o => o.status === 'delivered').length}
                      </span>
                    </div>
                    <p className="text-eco-600 font-medium">Delivered</p>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="bg-white rounded-3xl shadow-eco-glow p-6 border border-eco-200">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-eco-900">Profile Information</h2>
                    <button
                      onClick={() => setEditingProfile(!editingProfile)}
                      className="flex items-center space-x-2 text-eco-600 hover:text-eco-800 transition-colors"
                    >
                      <Edit className="h-5 w-5" />
                      <span>{editingProfile ? 'Cancel' : 'Edit'}</span>
                    </button>
                  </div>

                  {editingProfile ? (
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-eco-700 mb-2">First Name</label>
                          <input
                            type="text"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-eco-700 mb-2">Last Name</label>
                          <input
                            type="text"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-eco-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-eco-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-eco-500 to-nature-500 text-white py-3 rounded-2xl font-semibold hover:shadow-eco-glow-lg transition-all duration-300"
                      >
                        Save Changes
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-eco-600 mb-1">First Name</p>
                          <p className="font-semibold text-eco-900">{currentUser.firstName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-eco-600 mb-1">Last Name</p>
                          <p className="font-semibold text-eco-900">{currentUser.lastName}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-eco-600 mb-1">Email</p>
                        <p className="font-semibold text-eco-900">{currentUser.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-eco-600 mb-1">Phone</p>
                        <p className="font-semibold text-eco-900">{currentUser.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-3xl shadow-eco-glow p-6 border border-eco-200">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-eco-900">Recent Orders</h2>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-eco-600 hover:text-eco-800 font-medium flex items-center space-x-1"
                    >
                      <span>View All</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 text-eco-300 mx-auto mb-4" />
                      <p className="text-eco-600 mb-4">No orders yet</p>
                      <Link to="/" className="btn-eco inline-block">
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.orderNumber} className="border border-eco-200 rounded-2xl p-4 hover:shadow-eco transition-all duration-300">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-semibold text-eco-900">Order #{order.orderNumber}</p>
                              <p className="text-sm text-eco-600">
                                {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(order.status)}
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-eco-600">{order.items.length} item(s)</p>
                            <p className="font-bold text-eco-700">₹{order.total.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl shadow-eco-glow p-6 border border-eco-200">
                <h2 className="text-2xl font-bold text-eco-900 mb-6">Order History</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-eco-300 mx-auto mb-4" />
                    <p className="text-eco-600 mb-4">No orders yet</p>
                    <Link to="/" className="btn-eco inline-block">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.orderNumber} className="border border-eco-200 rounded-2xl p-6 hover:shadow-eco transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-bold text-lg text-eco-900">Order #{order.orderNumber}</p>
                            <p className="text-sm text-eco-600">
                              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(order.status)}
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          {order.items.map((item: any, index: number) => (
                            <div key={index} className="flex items-center space-x-4">
                              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                              <div className="flex-1">
                                <p className="font-medium text-eco-900">{item.name}</p>
                                <p className="text-sm text-eco-600">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-semibold text-eco-700">₹{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-eco-200">
                          <p className="text-eco-700">Total</p>
                          <p className="text-xl font-bold text-eco-900">₹{order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-3xl shadow-eco-glow p-6 border border-eco-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-eco-900">Saved Addresses</h2>
                  <button className="flex items-center space-x-2 bg-gradient-to-r from-eco-500 to-nature-500 text-white px-4 py-2 rounded-xl hover:shadow-eco-glow transition-all">
                    <Plus className="h-5 w-5" />
                    <span>Add Address</span>
                  </button>
                </div>
                <div className="text-center py-12">
                  <MapPin className="h-16 w-16 text-eco-300 mx-auto mb-4" />
                  <p className="text-eco-600">No saved addresses yet</p>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl shadow-eco-glow p-6 border border-eco-200">
                  <h2 className="text-2xl font-bold text-eco-900 mb-6">Account Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-eco-200 rounded-xl">
                      <div>
                        <p className="font-semibold text-eco-900">Email Notifications</p>
                        <p className="text-sm text-eco-600">Receive order updates via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-eco-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-eco-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-eco-200 rounded-xl">
                      <div>
                        <p className="font-semibold text-eco-900">Newsletter</p>
                        <p className="text-sm text-eco-600">Get eco-tips and special offers</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-eco-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-eco-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-eco-glow p-6 border border-eco-200">
                  <h2 className="text-2xl font-bold text-eco-900 mb-6">Security</h2>
                  <button className="w-full bg-eco-100 text-eco-700 py-3 rounded-xl font-semibold hover:bg-eco-200 transition-colors">
                    Change Password
                  </button>
                </div>

                <div className="bg-white rounded-3xl shadow-eco-glow p-6 border border-red-200">
                  <h2 className="text-2xl font-bold text-red-900 mb-4">Danger Zone</h2>
                  <p className="text-red-600 mb-4">Once you delete your account, there is no going back.</p>
                  <button className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;

// Made with Bob
