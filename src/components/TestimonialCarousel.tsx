import React, { useState, useEffect } from 'react';
import { Star, Leaf } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  rating: number;
  review: string;
  product: string;
  productDetails: string;
  timeAgo: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Lakshmi Priya",
    role: "Eco Lifestyle Blogger",
    image: "https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=400&h=300&fit=crop&crop=face",
    rating: 5,
    review: "I've been using these eco-friendly products for months now, and I'm absolutely amazed by the quality! The bamboo toothbrush feels premium, and knowing I'm reducing plastic waste makes me feel good about my choices.",
    product: "Bamboo Toothbrush Set",
    productDetails: "4-pack, Natural Bristles",
    timeAgo: "3 months ago"
  },
  {
    id: 2,
    name: "Karthik Ramesh",
    role: "Sustainability Consultant",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=300&fit=crop&crop=face",
    rating: 5,
    review: "As someone who advises companies on sustainability, I'm impressed by the attention to detail. The packaging is completely plastic-free, and the products perform better than conventional alternatives.",
    product: "Organic Cotton Towels",
    productDetails: "Set of 4, GOTS Certified",
    timeAgo: "1 month ago"
  },
  {
    id: 3,
    name: "Divya Krishnan",
    role: "Yoga Instructor",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&crop=face",
    rating: 5,
    review: "I love how these products align with my yoga practice and mindful living. The natural ingredients feel gentle on my skin, and the sustainable packaging makes me feel connected to nature.",
    product: "Natural Body Wash",
    productDetails: "Lavender & Aloe, 16oz",
    timeAgo: "2 weeks ago"
  },
  {
    id: 4,
    name: "Arun Kumar",
    role: "Environmental Engineer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face",
    rating: 5,
    review: "Finally found products that match my environmental values! The quality is outstanding, and I appreciate the transparency about sourcing and manufacturing processes.",
    product: "Reusable Food Wraps",
    productDetails: "Beeswax, Set of 5",
    timeAgo: "1 week ago"
  },
  {
    id: 5,
    name: "Priya Selvam",
    role: "Nutritionist",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=300&fit=crop&crop=face",
    rating: 5,
    review: "These eco-friendly kitchen products have transformed my cooking routine. Everything is non-toxic, sustainable, and beautifully designed. My clients love them too!",
    product: "Bamboo Utensil Set",
    productDetails: "7-piece, Handcrafted",
    timeAgo: "5 days ago"
  },
  {
    id: 6,
    name: "Rajesh Murugan",
    role: "Outdoor Enthusiast",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop&crop=face",
    rating: 5,
    review: "As someone who spends a lot of time in nature, I'm committed to protecting it. These products help me reduce my environmental footprint without compromising on quality or performance.",
    product: "Stainless Steel Water Bottle",
    productDetails: "32oz, Insulated",
    timeAgo: "4 days ago"
  }
];

const TestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    if (isPaused) {
      console.log('Carousel paused');
      return;
    }

    console.log('Starting carousel auto-rotation');
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = (prevIndex + 3) % testimonials.length;
        console.log(`Rotating from index ${prevIndex} to ${newIndex}`);
        return newIndex;
      });
    }, 5000);

    return () => {
      console.log('Clearing carousel interval');
      clearInterval(interval);
    };
  }, [isPaused]);

  // Get 3 testimonials to display
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {visibleTestimonials.map((testimonial, index) => (
          <div
            key={`${testimonial.id}-${currentIndex}`}
            className="card-eco rounded-2xl sm:rounded-3xl shadow-eco hover:shadow-eco-glow transition-all duration-500 cursor-pointer group overflow-hidden hover:-translate-y-2 sm:hover:-translate-y-3 animate-fade-in-up border border-eco-200"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Customer Image Section */}
            <div className="relative h-32 sm:h-40 lg:h-48 overflow-hidden">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-eco-800/80 via-eco-700/40 to-transparent group-hover:from-eco-700/90 transition-all duration-500" />
              
              {/* Customer info overlay */}
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-white">
                <h3 className="text-lg sm:text-xl font-bold mb-1 group-hover:scale-105 transition-transform duration-300">
                  {testimonial.name}
                </h3>
                <p className="text-eco-100 text-xs sm:text-sm mb-1 sm:mb-2">{testimonial.role}</p>
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-eco-400 text-eco-400" />
                  ))}
                </div>
              </div>
              
              {/* Eco badge */}
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-glass-eco p-1 sm:p-2 rounded-xl border border-eco-200 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Leaf className="h-3 w-3 sm:h-4 sm:w-4 text-eco-600" />
              </div>
            </div>
            
            {/* Review Content */}
            <div className="p-3 sm:p-4 lg:p-6">
              <div className="mb-3 sm:mb-4">
                <p className="text-eco-700 leading-relaxed text-xs sm:text-sm mb-2 sm:mb-3">
                  "{testimonial.review}"
                </p>
                <div className="flex items-center space-x-2">
                  <div className="bg-eco-100 px-2 sm:px-3 py-1 rounded-full">
                    <span className="text-xs font-medium text-eco-700">Verified Purchase</span>
                  </div>
                  <div className="bg-eco-100 px-2 sm:px-3 py-1 rounded-full">
                    <span className="text-xs font-medium text-eco-700">{testimonial.timeAgo}</span>
                  </div>
                </div>
              </div>

              {/* Product Mentioned */}
              <div className="bg-gradient-to-r from-eco-50 to-eco-100 p-2 sm:p-3 rounded-xl border border-eco-200">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-eco-200 rounded-lg flex items-center justify-center">
                    <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-eco-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-eco-800">{testimonial.product}</p>
                    <p className="text-xs text-eco-600">{testimonial.productDetails}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rotation indicator */}
      <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
        {[0, 3].map((startIndex) => (
          <button
            key={startIndex}
            onClick={() => setCurrentIndex(startIndex)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === startIndex
                ? 'w-8 bg-eco-600'
                : 'w-2 bg-eco-300 hover:bg-eco-400'
            }`}
            aria-label={`Go to testimonial set ${startIndex / 3 + 1}`}
          />
        ))}
      </div>

      {/* Pause indicator */}
      {isPaused && (
        <div className="absolute top-4 right-4 bg-eco-600 text-white px-3 py-1 rounded-full text-xs font-semibold animate-fade-in">
          Paused
        </div>
      )}
    </div>
  );
};

export default TestimonialCarousel;

// Made with Bob
