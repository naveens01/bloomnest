import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  productData?: {
    name: string;
    price: number;
    currency?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
    brand?: string;
    category?: string;
    rating?: number;
    reviewCount?: number;
  };
}

const SEO: React.FC<SEOProps> = ({
  title = 'BloomNest - Eco-Friendly Products for a Sustainable Future',
  description = 'Discover sustainable products from trusted brands that care about our planet. Shop eco-friendly home goods, personal care, fashion, and more at BloomNest.',
  keywords = 'eco-friendly, sustainable, green products, organic, natural, environmentally friendly, zero waste, ethical shopping',
  image = '/og-image.jpg',
  url = window.location.href,
  type = 'website',
  productData,
}) => {
  const siteName = 'BloomNest';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  // Generate structured data for products
  const generateProductSchema = () => {
    if (!productData) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: productData.name,
      description: description,
      image: image,
      brand: {
        '@type': 'Brand',
        name: productData.brand || siteName,
      },
      offers: {
        '@type': 'Offer',
        price: productData.price,
        priceCurrency: productData.currency || 'INR',
        availability: `https://schema.org/${productData.availability || 'InStock'}`,
        url: url,
      },
      ...(productData.rating && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: productData.rating,
          reviewCount: productData.reviewCount || 0,
        },
      }),
      ...(productData.category && {
        category: productData.category,
      }),
    };
  };

  // Generate organization schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: window.location.origin,
    logo: `${window.location.origin}/logo.png`,
    description: 'Your trusted source for eco-friendly and sustainable products',
    sameAs: [
      // Add social media links here
    ],
  };

  // Generate breadcrumb schema
  const generateBreadcrumbSchema = () => {
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    if (pathSegments.length === 0) return null;

    const itemListElement = pathSegments.map((segment, index) => ({
      '@type': 'ListItem',
      position: index + 2, // Start from 2 (1 is home)
      name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      item: `${window.location.origin}/${pathSegments.slice(0, index + 1).join('/')}`,
    }));

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: window.location.origin,
        },
        ...itemListElement,
      ],
    };
  };

  const productSchema = generateProductSchema();
  const breadcrumbSchema = generateBreadcrumbSchema();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content={siteName} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}
      
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

// Made with Bob