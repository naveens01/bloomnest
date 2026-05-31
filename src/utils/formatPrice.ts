/**
 * Format price with Indian number system (comma separators)
 * Examples:
 * 999 -> 999
 * 1679 -> 1,679
 * 12345 -> 12,345
 * 123456 -> 1,23,456
 */
export const formatPrice = (price: number): string => {
  return price.toLocaleString('en-IN');
};

/**
 * Format price with decimals
 * Examples:
 * 1679.50 -> 1,679.50
 * 999.00 -> 999.00
 */
export const formatPriceWithDecimals = (price: number, decimals: number = 2): string => {
  return price.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

// Made with Bob
