export const formatPrice = (price: number | string): string => {
  // If it's a number, format it
  if (typeof price === 'number') {
    return price.toLocaleString('fr-FR');
  }
  
  // If it's a string, return it as-is (user can include "DA" manually if needed)
  // This preserves strings like "1 milliards DA", "600 million", "Sur demande", etc.
  return price.trim();
};
