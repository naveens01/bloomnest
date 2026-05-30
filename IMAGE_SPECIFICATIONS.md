# BloomNest Image Specifications Guide
**Version:** 1.0  
**Last Updated:** 2026-05-30

This guide provides detailed specifications for all images used in the BloomNest e-commerce platform to ensure optimal display quality and performance across all devices.

---

## 📋 Table of Contents
1. [Product Images](#product-images)
2. [Category Images](#category-images)
3. [Brand Logos](#brand-logos)
4. [Hero/Banner Images](#herobanner-images)
5. [Promotion Card Images](#promotion-card-images)
6. [General Guidelines](#general-guidelines)

---

## 🛍️ Product Images

### Primary Product Image
**Used in:** Product cards, product detail page main image, cart items

| Specification | Value |
|--------------|-------|
| **Aspect Ratio** | 1:1 (Square) |
| **Recommended Size** | 800x800 pixels |
| **Minimum Size** | 400x400 pixels |
| **Maximum Size** | 2000x2000 pixels |
| **Format** | JPG, PNG, WebP |
| **File Size** | < 200 KB (optimized) |
| **Background** | White or transparent |

**Display Locations:**
- Home page product cards: 280x280px
- Products page grid: 320x320px
- Product detail page: 600x600px (desktop), 400x400px (mobile)
- Cart thumbnails: 80x80px

### Additional Product Images (Gallery)
**Used in:** Product detail page image gallery

| Specification | Value |
|--------------|-------|
| **Aspect Ratio** | 1:1 (Square) or 4:3 |
| **Recommended Size** | 800x800 pixels |
| **Quantity** | 2-5 images per product |
| **Format** | JPG, PNG, WebP |
| **File Size** | < 200 KB each |

**Best Practices:**
- Show product from different angles
- Include lifestyle/context shots
- Show product details/texture
- Maintain consistent lighting
- Use clean, uncluttered backgrounds

---

## 📂 Category Images

### Category Card Images
**Used in:** Home page category grid, categories page, category headers

| Specification | Value |
|--------------|-------|
| **Aspect Ratio** | 16:9 (Landscape) |
| **Recommended Size** | 1200x675 pixels |
| **Minimum Size** | 800x450 pixels |
| **Maximum Size** | 1920x1080 pixels |
| **Format** | JPG, WebP |
| **File Size** | < 300 KB |

**Display Locations:**
- Home page category cards: 400x225px (desktop), 320x180px (mobile)
- Categories page grid: 480x270px (desktop), 360x203px (mobile)
- Category page header: 1200x400px (desktop), 800x267px (mobile)

**Content Guidelines:**
- Show representative products from the category
- Use lifestyle/contextual imagery
- Ensure good contrast for text overlay
- Avoid busy/cluttered compositions
- Use natural, eco-friendly aesthetics

### Category Icon (Optional)
**Used in:** Category badges, navigation menus

| Specification | Value |
|--------------|-------|
| **Aspect Ratio** | 1:1 (Square) |
| **Recommended Size** | 128x128 pixels |
| **Format** | PNG (transparent), SVG |
| **File Size** | < 20 KB |

---

## 🏷️ Brand Logos

### Brand Logo Images
**Used in:** Brand cards, brand page headers, product cards

| Specification | Value |
|--------------|-------|
| **Aspect Ratio** | 1:1 (Square) or 16:9 (Landscape) |
| **Recommended Size** | 400x400 pixels (square) or 800x450 pixels (landscape) |
| **Minimum Size** | 200x200 pixels |
| **Format** | PNG (transparent preferred), SVG, JPG |
| **File Size** | < 100 KB |
| **Background** | Transparent or white |

**Display Locations:**
- Brand cards: 200x200px (desktop), 160x160px (mobile)
- Brand page header: 120x120px
- Product cards (brand badge): 40x40px

**Best Practices:**
- Use high-resolution vector logos when possible
- Ensure logo is clearly visible at small sizes
- Maintain brand color consistency
- Use transparent backgrounds for flexibility
- Include padding/whitespace around logo

### Brand Header/Cover Image
**Used in:** Brand page hero section

| Specification | Value |
|--------------|-------|
| **Aspect Ratio** | 21:9 (Ultra-wide) or 16:9 |
| **Recommended Size** | 1920x823 pixels (21:9) or 1920x1080 pixels (16:9) |
| **Format** | JPG, WebP |
| **File Size** | < 400 KB |

---

## 🎨 Hero/Banner Images

### Homepage Hero Slider
**Used in:** Main homepage banner carousel

| Specification | Value |
|--------------|-------|
| **Aspect Ratio** | 21:9 (Ultra-wide) |
| **Recommended Size** | 1920x823 pixels |
| **Minimum Size** | 1600x686 pixels |
| **Format** | JPG, WebP |
| **File Size** | < 500 KB |

**Display Sizes:**
- Desktop (XL): 1920x823px
- Desktop (L): 1600x686px
- Tablet: 1024x439px
- Mobile: 768x329px

**Content Guidelines:**
- Leave space for text overlay (left or right third)
- Use high-quality, professional photography
- Ensure good contrast for readability
- Avoid text in the image itself
- Use eco-friendly, natural aesthetics

### Promotion Banner Slides
**Used in:** PromotionBanner component carousel

| Specification | Value |
|--------------|-------|
| **Aspect Ratio** | 16:9 or 4:3 |
| **Recommended Size** | 1200x675 pixels (16:9) or 1200x900 pixels (4:3) |
| **Format** | JPG, WebP |
| **File Size** | < 300 KB |

---

## 🎁 Promotion Card Images

### Offer/Deal Card Images
**Used in:** PromotionCards component, special offers section

| Specification | Value |
|--------------|-------|
| **Aspect Ratio** | 4:3 or 1:1 |
| **Recommended Size** | 800x600 pixels (4:3) or 800x800 pixels (1:1) |
| **Format** | JPG, PNG, WebP |
| **File Size** | < 200 KB |

**Display Locations:**
- Promotion cards: 400x300px (desktop), 320x240px (mobile)

---

## 📐 General Guidelines

### Image Optimization

**Compression:**
- Use tools like TinyPNG, ImageOptim, or Squoosh
- Target 70-85% quality for JPG
- Use WebP format when possible (better compression)
- Enable progressive loading for large images

**Responsive Images:**
- Provide multiple sizes for different screen resolutions
- Use srcset and sizes attributes
- Consider using Cloudinary or similar CDN for automatic optimization

### File Naming Convention

```
Format: [type]-[name]-[size].[extension]

Examples:
- product-bamboo-toothbrush-800x800.jpg
- category-home-living-1200x675.jpg
- brand-ecolife-logo-400x400.png
- hero-summer-sale-1920x823.jpg
```

### Color Profile
- **Color Space:** sRGB
- **Color Depth:** 24-bit (8 bits per channel)
- **Profile:** sRGB IEC61966-2.1

### Accessibility
- Provide meaningful alt text for all images
- Ensure sufficient contrast for text overlays
- Avoid text in images when possible
- Use descriptive file names

---

## 🎯 Quick Reference Table

| Image Type | Aspect Ratio | Recommended Size | Max File Size | Format |
|-----------|--------------|------------------|---------------|---------|
| **Product Primary** | 1:1 | 800x800px | 200 KB | JPG, PNG, WebP |
| **Product Gallery** | 1:1 or 4:3 | 800x800px | 200 KB | JPG, PNG, WebP |
| **Category Card** | 16:9 | 1200x675px | 300 KB | JPG, WebP |
| **Category Icon** | 1:1 | 128x128px | 20 KB | PNG, SVG |
| **Brand Logo** | 1:1 or 16:9 | 400x400px | 100 KB | PNG, SVG |
| **Brand Cover** | 21:9 or 16:9 | 1920x823px | 400 KB | JPG, WebP |
| **Hero Banner** | 21:9 | 1920x823px | 500 KB | JPG, WebP |
| **Promotion Slide** | 16:9 or 4:3 | 1200x675px | 300 KB | JPG, WebP |
| **Promotion Card** | 4:3 or 1:1 | 800x600px | 200 KB | JPG, PNG, WebP |

---

## 🛠️ Recommended Tools

### Image Editing
- **Adobe Photoshop** - Professional editing
- **GIMP** - Free alternative
- **Canva** - Quick designs and templates
- **Figma** - Design and prototyping

### Image Optimization
- **TinyPNG** - PNG/JPG compression
- **Squoosh** - Google's image optimizer
- **ImageOptim** - Mac batch optimization
- **Sharp** - Node.js image processing

### Image Generation (AI)
- **Midjourney** - AI image generation
- **DALL-E** - OpenAI image generator
- **Stable Diffusion** - Open-source AI
- **Adobe Firefly** - Adobe's AI generator

### Stock Photos (Eco-Friendly)
- **Unsplash** - Free high-quality photos
- **Pexels** - Free stock photos
- **Pixabay** - Free images and videos
- **Eco-Stock** - Eco-focused stock photos

---

## 📝 Image Upload Checklist

Before uploading images to BloomNest:

- [ ] Image meets aspect ratio requirements
- [ ] Image is properly sized (not too large or small)
- [ ] Image is optimized (compressed)
- [ ] File size is within limits
- [ ] Image format is appropriate
- [ ] Image has descriptive filename
- [ ] Alt text is prepared
- [ ] Image quality is high (no pixelation)
- [ ] Background is appropriate (white/transparent for products)
- [ ] Image aligns with brand aesthetics (eco-friendly, natural)

---

## 🎨 Brand Aesthetic Guidelines

### Color Palette
- **Primary:** Earth tones, greens, natural colors
- **Accent:** Soft blues, warm browns
- **Avoid:** Harsh neons, artificial colors

### Photography Style
- **Lighting:** Natural, soft lighting
- **Composition:** Clean, minimalist
- **Context:** Lifestyle shots showing products in use
- **Mood:** Calm, sustainable, authentic

### Do's and Don'ts

**✅ DO:**
- Use natural lighting
- Show products in real-life contexts
- Include plants/natural elements
- Use neutral, eco-friendly backgrounds
- Show product details clearly

**❌ DON'T:**
- Use harsh artificial lighting
- Over-edit or use heavy filters
- Include distracting backgrounds
- Use stock photos that look generic
- Compromise on image quality

---

## 📞 Support

For questions about image specifications or assistance with image preparation:
- **Email:** support@bloomnest.com
- **Documentation:** See `docs/cloudinary_setup.md` for upload instructions
- **Admin Panel:** Use the image upload feature with automatic optimization

---

**Last Updated:** 2026-05-30  
**Version:** 1.0  
**Maintained by:** BloomNest Development Team