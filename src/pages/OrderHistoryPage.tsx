import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Package, Calendar, Truck, CheckCircle, XCircle, Loader2, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { PageSkeleton } from '../components/LoadingSkeleton';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    images: Array<{ url: string }>;
    price: { current: number };
  };
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: { amount: number; rate: number };
  shipping: {
    method: string;
    cost: number;
    address: any;
    trackingNumber?: string;
  };
  total: number;
  status: string;
  createdAt: string;
  payment: {
    method: string;
    status: string;
  };
}

const OrderHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { error: showError } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      showError('Please sign in to view your orders');
      navigate('/signin');
      return;
    }

    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated, authLoading, page]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/users/orders?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please sign in to view your orders');
        } else if (response.status === 404) {
          throw new Error('No orders found');
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to load orders. Please try again later.');
        }
      }

      const data = await response.json();
      setOrders(data.data.orders);
      setTotalPages(data.data.pagination.totalPages);
    } catch (err: any) {
      showError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return CheckCircle;
      case 'shipped':
        return Truck;
      case 'cancelled':
        return XCircle;
      default:
        return Package;
    }
  };

  if (authLoading || loading) {
    return <PageSkeleton />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-eco-50 via-nature-50 to-ocean-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-eco-700 hover:text-eco-900 font-semibold mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient-eco mb-2">Order History</h1>
          <p className="text-eco-700">View all your past and current orders</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-lg">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-eco-500 text-white px-6 py-3 rounded-lg hover:bg-eco-600 transition-colors"
            >
              <span>Start Shopping</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <div
                  key={order._id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-4 border-b">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.orderNumber}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <StatusIcon className="h-4 w-4" />
                            <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 text-right">
                        <div className="text-2xl font-bold text-eco-600">${order.total.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">Payment: {order.payment.status}</div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3 mb-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg">
                          <img
                            src={item.product.images?.[0]?.url || '/placeholder.jpg'}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                            loading="lazy"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{item.product.name}</h4>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">${item.total.toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t text-sm">
                      <div>
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="ml-2 font-medium">${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Tax:</span>
                        <span className="ml-2 font-medium">${order.tax.amount.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Shipping:</span>
                        <span className="ml-2 font-medium">
                          {order.shipping.cost === 0 ? 'Free' : `$${order.shipping.cost.toFixed(2)}`}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total:</span>
                        <span className="ml-2 font-bold text-lg">${order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Tracking Info */}
                    {order.shipping.trackingNumber && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center space-x-2 text-sm">
                          <Truck className="h-4 w-4 text-eco-600" />
                          <span className="text-gray-700">Tracking: </span>
                          <span className="font-mono font-semibold">{order.shipping.trackingNumber}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center space-x-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default OrderHistoryPage;

