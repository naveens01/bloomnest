import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Lock, Eye, EyeOff, Shield, CheckCircle, XCircle, Leaf, Sparkles, Zap, Globe, Recycle, Heart, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const [authMethod, setAuthMethod] = useState<'mobile' | 'email'>('email');
  const [step, setStep] = useState<'input' | 'otp' | 'success'>('input');
  const [formData, setFormData] = useState({ mobile: '', email: '', password: '', confirmPassword: '', otp: '', firstName: '', lastName: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (authMethod === 'mobile') {
      if (formData.mobile.length < 10) {
        setError('Please enter a valid mobile number');
        setIsLoading(false);
        return;
      }
      setStep('otp');
      setIsLoading(false);
      return;
    }

    // Email registration
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.firstName || !formData.lastName) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (data.data && data.data.token && data.data.user) {
        login(data.data.token, data.data.user);
        showSuccess('Account created successfully!');
        setStep('success');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      showError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (formData.otp === '1234') {
      setStep('success');
    } else {
      setError('Invalid OTP. Please try again.');
    }
    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    // Simulate resending OTP
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleGmailSignIn = async () => {
    setIsLoading(true);
    // Simulate Gmail sign-in
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStep('success');
    setIsLoading(false);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-eco-50 via-white to-nature-50 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-48 sm:w-72 h-48 sm:h-72 bg-eco-200/40 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-20 right-20 w-48 sm:w-72 h-48 sm:h-72 bg-nature-200/40 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-ocean-200/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-eco-glow-lg border border-eco-200/50 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-eco-400 to-nature-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-eco-glow animate-bounce-in">
              <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gradient-eco mb-4 animate-fade-in-up">Welcome to BloomNest!</h1>
            <p className="text-eco-700 mb-8 text-base sm:text-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Your account has been created successfully. Start exploring our eco-friendly products!
            </p>
            <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <button
                onClick={() => {
                  navigate('/');
                  setStep('input');
                }}
                className="w-full flex items-center justify-center space-x-2 bg-eco-gradient text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:shadow-eco-glow-lg transition-all duration-300 transform hover:scale-105"
              >
                <span>Start Shopping</span>
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-white to-nature-50 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-eco-200 to-nature-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-nature-200 to-ocean-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-ocean-200 to-eco-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>
        
        {/* Floating Decorative Elements */}
        <div className="absolute top-10 right-10 animate-nature-float">
          <div className="w-12 h-12 bg-gradient-to-br from-eco-300 to-nature-300 rounded-full flex items-center justify-center opacity-80 shadow-lg animate-pulse">
            <Leaf className="h-6 w-6 text-eco-600" />
          </div>
        </div>
        <div className="absolute bottom-10 left-10 animate-nature-float animation-delay-2000">
          <div className="w-10 h-10 bg-gradient-to-br from-nature-300 to-ocean-300 rounded-full flex items-center justify-center opacity-80 shadow-lg animate-ping">
            <Globe className="h-5 w-5 text-nature-600" />
          </div>
        </div>
        <div className="absolute top-1/3 left-1/4 animate-nature-float animation-delay-1000">
          <div className="w-8 h-8 bg-gradient-to-br from-ocean-300 to-eco-300 rounded-full flex items-center justify-center opacity-80 shadow-lg animate-pulse">
            <Sparkles className="h-4 w-4 text-ocean-600" />
          </div>
        </div>
        <div className="absolute top-2/3 right-1/3 animate-nature-float animation-delay-3000">
          <div className="w-6 h-6 bg-gradient-to-br from-eco-300 to-nature-300 rounded-full flex items-center justify-center opacity-80 shadow-lg animate-ping">
            <Star className="h-3 w-3 text-eco-600" />
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 pt-20 sm:pt-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="inline-flex items-center space-x-2 text-eco-700 hover:text-eco-900 font-semibold text-sm sm:text-base">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-eco-gradient rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-eco-glow">
              <Leaf className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient-eco mb-2 sm:mb-4">Join BloomNest</h1>
            <p className="text-eco-600 text-sm sm:text-base">Create your account and start your sustainable journey</p>
          </div>

          {/* Auth Method Toggle */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-eco-glow border border-eco-200/50 mb-6 sm:mb-8">
            <div className="flex space-x-1 bg-eco-100 p-1 rounded-xl">
              <button
                onClick={() => setAuthMethod('mobile')}
                className={`flex-1 py-2 sm:py-3 px-4 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ${
                  authMethod === 'mobile'
                    ? 'bg-white text-eco-700 shadow-eco-glow'
                    : 'text-eco-600 hover:text-eco-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Mobile</span>
                </div>
              </button>
              <button
                onClick={() => setAuthMethod('email')}
                className={`flex-1 py-2 sm:py-3 px-4 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ${
                  authMethod === 'email'
                    ? 'bg-white text-eco-700 shadow-eco-glow'
                    : 'text-eco-600 hover:text-eco-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Email</span>
                </div>
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-eco-glow-lg border border-eco-200/50">
            {step === 'input' ? (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {authMethod === 'mobile' ? (
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-eco-700 mb-2">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-eco-400" />
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        placeholder="Enter your mobile number"
                        className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all duration-300 bg-white/90 backdrop-blur-sm text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm sm:text-base font-medium text-eco-700 mb-2">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="First name"
                          className="w-full px-4 py-3 sm:py-4 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all duration-300 bg-white/90 backdrop-blur-sm text-sm sm:text-base"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm sm:text-base font-medium text-eco-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Last name"
                          className="w-full px-4 py-3 sm:py-4 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all duration-300 bg-white/90 backdrop-blur-sm text-sm sm:text-base"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm sm:text-base font-medium text-eco-700 mb-2">Phone (Optional)</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-eco-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all duration-300 bg-white/90 backdrop-blur-sm text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm sm:text-base font-medium text-eco-700 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-eco-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all duration-300 bg-white/90 backdrop-blur-sm text-sm sm:text-base"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm sm:text-base font-medium text-eco-700 mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-eco-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Create a password"
                          className="w-full pl-10 sm:pl-12 pr-12 py-3 sm:py-4 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all duration-300 bg-white/90 backdrop-blur-sm text-sm sm:text-base"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-eco-400 hover:text-eco-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm sm:text-base font-medium text-eco-700 mb-2">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-eco-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm your password"
                          className="w-full pl-10 sm:pl-12 pr-12 py-3 sm:py-4 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all duration-300 bg-white/90 backdrop-blur-sm text-sm sm:text-base"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-eco-400 hover:text-eco-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {error && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm sm:text-base">
                    <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-eco-gradient text-white py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-semibold text-sm sm:text-base hover:shadow-eco-glow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <span>{authMethod === 'mobile' ? 'Send OTP' : 'Create Account'}</span>
                  )}
                </button>

                {authMethod === 'email' && (
                  <button
                    type="button"
                    onClick={handleGmailSignIn}
                    disabled={isLoading}
                    className="w-full bg-white border-2 border-eco-200 text-eco-700 py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-semibold text-sm sm:text-base hover:bg-eco-50 hover:border-eco-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Sign in with Gmail</span>
                    </div>
                  </button>
                )}
              </form>
            ) : (
              <form onSubmit={handleOTPSubmit} className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-eco-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Phone className="h-8 w-8 sm:h-10 sm:w-10 text-eco-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-eco-800 mb-2">Verify Your Mobile</h3>
                  <p className="text-eco-600 text-sm sm:text-base">
                    We've sent a verification code to {formData.mobile}
                  </p>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium text-eco-700 mb-2">Enter OTP</label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    placeholder="Enter 4-digit OTP"
                    maxLength={4}
                    className="w-full px-4 py-3 sm:py-4 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all duration-300 bg-white/90 backdrop-blur-sm text-center text-lg sm:text-xl font-mono"
                    required
                  />
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm sm:text-base">
                    <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-3 sm:space-y-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-eco-gradient text-white py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-semibold text-sm sm:text-base hover:shadow-eco-glow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      <span>Verify OTP</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="w-full bg-white border-2 border-eco-200 text-eco-700 py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-semibold text-sm sm:text-base hover:bg-eco-50 hover:border-eco-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Features */}
          <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-eco-200/50">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-eco-600 mx-auto mb-2" />
              <h4 className="text-xs sm:text-sm font-semibold text-eco-700">Secure</h4>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-eco-200/50">
              <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-eco-600 mx-auto mb-2" />
              <h4 className="text-xs sm:text-sm font-semibold text-eco-700">Eco-Friendly</h4>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-eco-200/50">
              <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-eco-600 mx-auto mb-2" />
              <h4 className="text-xs sm:text-sm font-semibold text-eco-700">Fast</h4>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;


