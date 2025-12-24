import React, { useState, useEffect } from 'react';
import { ArrowRight, Gift, Truck, Leaf, Percent, Sparkles, Star, Loader2 } from 'lucide-react';
import { promotionApi, BackendPromotion } from '../services/api';

// Icon mapping
const iconMap: { [key: string]: React.ComponentType<any> } = {
  Gift,
  Truck,
  Percent,
  Star,
  Sparkles,
};

const PromotionCards: React.FC = () => {
  const [promotions, setPromotions] = useState<BackendPromotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        const response = await promotionApi.getAll({ type: 'card' });
        if (response.data?.promotions && response.data.promotions.length > 0) {
          setPromotions(response.data.promotions);
        } else {
          // Fallback to default promotions
          setPromotions([
            {
              _id: '1',
              title: 'Free Shipping',
              description: 'Get free shipping on all orders above $50. No minimum quantity required!',
              type: 'card',
              bgColor: 'bg-eco-gradient',
              textColor: 'text-eco-900',
              icon: 'Truck',
              ecoIcon: 'Leaf',
              badge: 'Eco-Friendly',
              cta: { text: 'Shop Now' },
              isActive: true,
              isFeatured: false,
            },
            {
              _id: '2',
              title: 'Up to 40% OFF',
              description: 'Save big on selected eco-friendly products. Limited time offer, don\'t miss out!',
              type: 'card',
              bgColor: 'bg-nature-gradient',
              textColor: 'text-nature-900',
              icon: 'Percent',
              ecoIcon: 'Sparkles',
              badge: 'Special Deal',
              cta: { text: 'View Deals' },
              isActive: true,
              isFeatured: false,
            },
            {
              _id: '3',
              title: 'Buy 2 Get 1 FREE',
              description: 'Mix and match personal care products. Perfect for gifting or personal use!',
              type: 'card',
              bgColor: 'bg-eco-gradient',
              textColor: 'text-eco-900',
              icon: 'Gift',
              ecoIcon: 'Leaf',
              badge: 'Bundle Deal',
              cta: { text: 'Shop Bundles' },
              isActive: true,
              isFeatured: false,
            },
          ] as any);
        }
      } catch (error) {
        console.error('Failed to load promotions:', error);
        // Keep empty array, component will show nothing
      } finally {
        setLoading(false);
      }
    };

    loadPromotions();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-nature-pattern">
        <div className="max-w-7xl mx-auto flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 text-eco-600 animate-spin" />
        </div>
      </section>
    );
  }

  if (promotions.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-nature-pattern">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-glass-nature px-6 py-3 rounded-full border border-nature-200 mb-6">
            <Star className="h-5 w-5 text-nature-600" />
            <span className="text-sm font-semibold text-nature-700">Limited Time Offers</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gradient-nature mb-6">
            Special Offers
          </h2>
          <p className="text-xl text-nature-600 max-w-3xl mx-auto leading-relaxed">
            Don't miss out on these amazing deals for eco-friendly products. 
            Sustainable shopping has never been more rewarding!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promo: any) => {
            const IconComponent = typeof promo.icon === 'string' ? (iconMap[promo.icon] || Gift) : (promo.icon || Gift);
            const isEco = promo.bgColor?.includes('eco') || !promo.bgColor;
            const cardClass = isEco ? 'card-eco' : 'card-nature';
            const bgGradient = isEco ? 'bg-eco-gradient' : 'bg-nature-gradient';
            const btnClass = isEco ? 'btn-eco' : 'btn-nature';
            const shadowClass = isEco ? 'hover:shadow-eco-glow-lg' : 'hover:shadow-nature-glow-lg';
            const textColor = promo.textColor || (isEco ? 'text-eco-900' : 'text-nature-900');
            const textColorLight = isEco ? 'text-eco-700' : 'text-nature-700';
            const badgeBg = isEco ? 'bg-eco-50' : 'bg-nature-50';
            const badgeText = isEco ? 'text-eco-700' : 'text-nature-700';
            const borderColor = isEco ? 'border-eco-200' : 'border-nature-200';
            const blobBg = isEco ? 'bg-eco-200' : 'bg-nature-200';
            const blobBgLight = isEco ? 'bg-eco-100' : 'bg-nature-100';

            return (
              <div key={promo._id} className={`${cardClass} rounded-3xl p-8 ${textColor} overflow-hidden group ${shadowClass} transition-all duration-500 border ${borderColor} relative`}>
                <div className={`absolute top-0 right-0 w-40 h-40 ${blobBg} rounded-full -translate-y-20 translate-x-20 opacity-20 animate-blob`}></div>
                <div className={`absolute bottom-0 left-0 w-32 h-32 ${blobBgLight} rounded-full translate-y-16 -translate-x-16 opacity-20 animate-blob animation-delay-2000`}></div>
                
                <div className="relative z-10">
                  <div className={`${bgGradient} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-eco-glow group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-10 w-10 text-white" />
                  </div>
                  
                  {promo.badge && (
                    <div className="flex items-center space-x-2 mb-4">
                      <Leaf className={`h-4 w-4 ${textColorLight}`} />
                      <span className={`text-sm font-semibold ${badgeText} ${badgeBg} px-3 py-1 rounded-full`}>
                        {promo.badge}
                      </span>
                    </div>
                  )}
                  
                  <h3 className={`text-2xl font-bold mb-3 ${textColor}`}>{promo.title}</h3>
                  {promo.subtitle && (
                    <h4 className={`text-xl font-semibold mb-2 ${textColor}`}>{promo.subtitle}</h4>
                  )}
                  {promo.description && (
                    <p className={`${textColorLight} mb-6 leading-relaxed`}>
                      {promo.description}
                    </p>
                  )}
                  
                  <button className={`${btnClass} px-6 py-3 text-base font-semibold flex items-center space-x-2 group-hover:scale-105 ${shadowClass}`}>
                    <span>{promo.cta?.text || 'Shop Now'}</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PromotionCards;