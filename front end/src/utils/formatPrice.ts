export const formatPrice = (price: number | string): string => {
  // If it's a number, format it
  if (typeof price === 'number') {
    return `${price.toLocaleString('fr-FR')} DA`;
  }
  
  // If it's a string, check if it's a pure number (can be parsed)
  const numericPrice = parseFloat(price.replace(/[,\s]/g, ''));
  if (!isNaN(numericPrice) && isFinite(numericPrice)) {
    // It's a valid number, format it
    return `${numericPrice.toLocaleString('fr-FR')} DA`;
  }
  
  // It's text (like "1 milliards" or "Sur demande"), return as-is with DA
  return `${price} DA`;
};
