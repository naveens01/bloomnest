import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  Leaf,
  Sparkles,
  Globe,
  Star,
  Heart,
  Zap,
  Award
} from 'lucide-react';

const SigninPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success: showSuccess, error: showError } = useToast();

  // Check server status on mount
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/health', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          setServerStatus('online');
        } else {
          setServerStatus('offline');
        }
      } catch (err) {
        setServerStatus('offline');
      }
    };
    checkServer();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      // Check if response is ok before trying to parse JSON
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        // If response is not JSON, it might be a network error or server error
        if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || `Sign in failed: ${response.status} ${response.statusText}`);
      }

      // Store token and user via auth context
      if (data.data && data.data.token && data.data.user) {
        login(data.data.token, data.data.user);
        showSuccess('Signed in successfully!');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      console.error('Sign in error:', err);
      let errorMessage = 'Sign in failed. Please try again.';
      
      // Handle different types of errors
      if (err.message) {
        errorMessage = err.message;
      } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage = 'Cannot connect to server. Please make sure the backend server is running on port 5000.';
      } else if (err.name === 'NetworkError' || err.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your connection and ensure the backend server is running.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-eco-50 via-nature-50 to-ocean-50 flex items-center justify-center p-4">
        <div className="text-center animate-fade-in-up">
          <div className="w-24 h-24 bg-gradient-to-r from-eco-500 to-nature-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-eco-800 mb-4">Welcome Back!</h2>
          <p className="text-nature-600 mb-6">You've successfully signed in to BloomNest</p>
          <div className="flex items-center justify-center space-x-2 text-eco-600">
            <span>Redirecting to home...</span>
            <div className="w-2 h-2 bg-eco-500 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-nature-50 to-ocean-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-eco-200/30 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-nature-200/30 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-ocean-200/30 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-32 left-1/4 animate-float">
          <Leaf className="h-8 w-8 text-eco-400 animate-pulse" />
        </div>
        <div className="absolute top-48 right-1/3 animate-float animation-delay-1000">
          <Globe className="h-6 w-6 text-nature-400 animate-pulse" />
        </div>
        <div className="absolute bottom-32 left-1/3 animate-float animation-delay-2000">
          <Sparkles className="h-7 w-7 text-ocean-400 animate-ping" />
        </div>
        <div className="absolute top-1/2 right-20 animate-float animation-delay-3000">
          <Star className="h-5 w-5 text-eco-500 animate-pulse" />
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-24 sm:pt-28 lg:pt-32">
        <div className="w-full max-w-md">
          {/* Enhanced Header with better spacing */}
          <div className="text-center mb-10 animate-fade-in-up">
            <Link to="/" className="inline-block mb-8 group">
              <div className="flex items-center justify-center space-x-4 group-hover:scale-105 transition-transform duration-300">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-eco-500 to-nature-500 rounded-3xl flex items-center justify-center shadow-eco-glow group-hover:shadow-eco-glow-xl transition-all duration-300 animate-pulse-slow">
                    <Leaf className="h-10 w-10 sm:h-12 sm:w-12 text-white animate-spin-slow" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-nature-400 rounded-full animate-ping"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-eco-400 rounded-full animate-ping animation-delay-1000"></div>
                </div>
                <span className="text-4xl sm:text-5xl font-bold text-gradient-eco group-hover:scale-105 transition-transform duration-300">
                  BloomNest
                </span>
              </div>
            </Link>
            
            <h1 className="text-5xl sm:text-6xl font-bold text-eco-800 mb-4 animate-fade-in-up animation-delay-200">
              Welcome Back
            </h1>
            <p className="text-nature-600 text-xl animate-fade-in-up animation-delay-300">
              Sign in to your eco-friendly shopping account
            </p>
            
            {/* Enhanced decorative elements */}
            <div className="flex items-center justify-center space-x-4 mt-6 animate-fade-in-up animation-delay-400">
              <div className="w-2 h-2 bg-gradient-to-r from-eco-500 to-nature-500 rounded-full animate-pulse"></div>
              <span className="text-eco-600 font-medium">Secure • Fast • Eco-Friendly</span>
              <div className="w-2 h-2 bg-gradient-to-r from-nature-500 to-ocean-500 rounded-full animate-pulse animation-delay-1000"></div>
            </div>
          </div>

          {/* Enhanced Sign In Form with modern glassmorphism */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-eco-glow-xl border border-white/30 p-8 sm:p-10 animate-fade-in-up animation-delay-500 relative overflow-hidden">
            {/* Enhanced background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-eco-50/50 via-transparent to-nature-50/50 opacity-60"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-eco-400 via-nature-400 to-ocean-400"></div>
            
            <div className="relative z-10">
              <form onSubmit={handleSubmit} className="space-y-7">
                {/* Enhanced Email Field */}
                <div className="space-y-3">
                  <label htmlFor="email" className="block text-sm font-semibold text-eco-700 flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-eco-500" />
                    <span>Email Address</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-14 pr-4 py-4 border-2 border-eco-200/50 rounded-2xl focus:ring-4 focus:ring-eco-400/20 focus:border-eco-400 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white hover:border-eco-300 text-eco-800 placeholder-eco-400 font-medium"
                      placeholder="Enter your email address"
                      required
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-eco-400 group-hover:text-eco-600 transition-colors duration-300" />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-eco-400/10 to-nature-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-lg"></div>
                  </div>
                </div>

                {/* Enhanced Password Field */}
                <div className="space-y-3">
                  <label htmlFor="password" className="block text-sm font-semibold text-eco-700 flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-eco-500" />
                    <span>Password</span>
                  </label>
                  <div className="relative group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-14 pr-14 py-4 border-2 border-eco-200/50 rounded-2xl focus:ring-4 focus:ring-eco-400/20 focus:border-eco-400 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white hover:border-eco-300 text-eco-800 placeholder-eco-400 font-medium"
                      placeholder="Enter your password"
                      required
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-eco-400 group-hover:text-eco-600 transition-colors duration-300" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-eco-400 hover:text-eco-600 transition-colors duration-300 p-1 rounded-lg hover:bg-eco-100"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-eco-400/10 to-nature-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-lg"></div>
                  </div>
                </div>

                {/* Enhanced Forgot Password & Remember Me */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" className="w-5 h-5 text-eco-500 border-eco-300 rounded-lg focus:ring-eco-400 focus:ring-2 transition-all duration-300" />
                      <div className="absolute inset-0 w-5 h-5 bg-gradient-to-r from-eco-400 to-nature-400 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </div>
                    <span className="text-sm text-eco-700 group-hover:text-eco-600 transition-colors duration-300 font-medium">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-eco-600 hover:text-eco-500 font-medium transition-colors duration-300 hover:underline group">
                    <span className="group-hover:scale-105 transition-transform duration-300">Forgot password?</span>
                  </button>
                </div>

                {/* Server Status */}
                {serverStatus === 'offline' && (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-4 animate-fade-in-up mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-pulse"></div>
                        <span className="text-yellow-700 text-sm font-medium">
                          Backend server appears to be offline. Please ensure the server is running on port 5000. If port 5000 is in use by macOS AirPlay, disable it in System Settings → General → AirDrop &amp; Handoff.
                        </span>
                    </div>
                  </div>
                )}

                {/* Enhanced Error Message */}
                {error && (
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-4 animate-fade-in-up">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></div>
                      <span className="text-red-700 text-sm font-medium">{error}</span>
                    </div>
                  </div>
                )}

                {/* Enhanced Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-eco-500 to-nature-500 text-white py-5 px-6 rounded-2xl font-semibold text-lg hover:from-eco-600 hover:to-nature-600 transition-all duration-300 transform hover:scale-105 hover:shadow-eco-glow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group relative overflow-hidden"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-lg">Signing In...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <span className="text-lg">Sign In</span>
                      <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-eco-400/20 to-nature-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                </button>
              </form>

              {/* Enhanced Divider */}
              <div className="my-8 flex items-center">
                <div className="flex-1 border-t border-eco-200/50"></div>
                <span className="px-6 text-sm text-eco-500 font-semibold bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-eco-200/30">or continue with</span>
                <div className="flex-1 border-t border-eco-200/50"></div>
              </div>

              {/* Enhanced Social Sign In */}
              <div className="space-y-4">
                <button className="w-full bg-white/90 backdrop-blur-sm border-2 border-eco-200/50 text-eco-700 py-4 px-6 rounded-2xl font-semibold hover:border-eco-300 hover:bg-eco-50 transition-all duration-300 transform hover:scale-105 hover:shadow-eco-glow group">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-sm font-bold">G</span>
                    </div>
                    <span className="text-base">Continue with Google</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Sign Up Link */}
          <div className="text-center mt-8 animate-fade-in-up animation-delay-600">
            <p className="text-nature-600 text-lg">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-eco-600 hover:text-eco-500 font-bold hover:underline transition-colors duration-300 group"
              >
                <span className="group-hover:scale-105 transition-transform duration-300">Sign up here</span>
                <ArrowRight className="inline-block h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </p>
          </div>

          {/* Enhanced Features Section */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in-up animation-delay-700">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-eco-100 to-nature-100 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-eco-glow group-hover:shadow-eco-glow-lg">
                <Shield className="h-8 w-8 text-eco-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-base font-bold text-eco-700 mb-2 group-hover:text-eco-600 transition-colors duration-300">Bank-Level Security</h3>
              <p className="text-sm text-nature-600">256-bit encryption</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-nature-100 to-ocean-100 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-eco-glow group-hover:shadow-eco-glow-lg">
                <Leaf className="h-8 w-8 text-nature-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-base font-bold text-nature-700 mb-2 group-hover:text-nature-600 transition-colors duration-300">100% Eco-Friendly</h3>
              <p className="text-sm text-ocean-600">Sustainable platform</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-ocean-100 to-eco-100 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-eco-glow group-hover:shadow-eco-glow-lg">
                <Zap className="h-8 w-8 text-ocean-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-base font-bold text-ocean-700 mb-2 group-hover:text-ocean-600 transition-colors duration-300">Lightning Fast</h3>
              <p className="text-sm text-eco-600">Instant access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
