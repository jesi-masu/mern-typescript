/**
 * Format price in Philippine Peso (PHP)
 */
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Convert USD to PHP (using a fixed exchange rate for simplicity)
 * In production, you would typically use an API to get current exchange rates
 */
export const usdToPhp = (usdPrice: number) => {
  // Using a fixed exchange rate of 56 PHP to 1 USD (for illustration purposes)
  const exchangeRate = 56;
  return Math.round(usdPrice * exchangeRate);
};

/**
 * Format price with USD to PHP conversion
 */
export const formatPriceFromUSD = (usdPrice: number) => {
  const phpPrice = usdToPhp(usdPrice);
  return formatPrice(phpPrice);
};
