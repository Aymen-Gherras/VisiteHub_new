/**
 * Utility functions for handling nearby place icons
 * Supports both emoji icons and SVG filenames
 * 
 * All available SVG icons in /public/icons/nearby-places/:
 * - 008-bus-2.svg
 * - 013-fuel pump.svg
 * - 019-supermarket.svg
 * - 020-gasoline station.svg
 * - 023-pharmacy.svg
 * - Bank.svg
 * - Dumbbell. weight. fitness. exercise. strength.svg
 * - esps.svg
 * - mosque.svg
 * - Restaurant-01.svg
 * - school building.school building. educational institution. campus. schoolhouse.svg
 * - -_pizza. Italian food. slice of pizza. oven-baked. fast food.svg
 */

/**
 * List of all valid SVG icon filenames
 */
export const VALID_SVG_ICONS = [
  '008-bus-2.svg',
  '013-fuel pump.svg',
  '019-supermarket.svg',
  '020-gasoline station.svg',
  '023-pharmacy.svg',
  'Bank.svg',
  'Dumbbell. weight. fitness. exercise. strength.svg',
  'esps.svg',
  'mosque.svg',
  'Restaurant-01.svg',
  'school building.school building. educational institution. campus. schoolhouse.svg',
  '-_pizza. Italian food. slice of pizza. oven-baked. fast food.svg',
];

/**
 * Extract the clean icon filename from a potentially dirty string
 * Handles cases where icon value might have extra text appended or truncated
 */
function extractIconFilename(icon: string): string {
  if (!icon) return '';
  
  // Trim whitespace
  icon = icon.trim();
  
  // First, try to find a match in our valid SVG icons list
  for (const validIcon of VALID_SVG_ICONS) {
    // Exact match
    if (icon === validIcon) {
      return validIcon;
    }
    
    // Check if the icon string starts with or contains the valid icon filename
    if (icon.startsWith(validIcon) || icon.includes(validIcon)) {
      return validIcon;
    }
    
    // Check without the .svg extension (in case it was truncated)
    const iconWithoutExt = validIcon.replace('.svg', '');
    
    // Match if icon starts with the base filename (handles "008-bus-2." -> "008-bus-2.svg")
    if (icon.startsWith(iconWithoutExt)) {
      return validIcon;
    }
    
    // Match if valid icon starts with the icon string (handles partial matches)
    // Examples:
    // "019-superm" -> "019-supermarket.svg" (iconWithoutExt starts with "019-superm")
    // "Dumbbell." -> "Dumbbell. weight. fitness. exercise. strength.svg"
    // "school bui" -> "school building.school building. educational institution. campus. schoolhouse.svg"
    // "023-pharma" -> "023-pharmacy.svg"
    // "020-gasoli" -> "020-gasoline station.svg"
    // "Restaurant" -> "Restaurant-01.svg"
    // "-_pizza. I" -> "-_pizza. Italian food. slice of pizza. oven-baked. fast food.svg"
    if (iconWithoutExt.toLowerCase().startsWith(icon.toLowerCase())) {
      // Require at least 3 characters for a match to avoid false positives
      if (icon.length >= 3) {
        return validIcon;
      }
    }
    
    // Also check if icon is a prefix of valid icon (reverse match)
    // This handles cases where the database has a partial filename
    if (icon.length >= 5 && iconWithoutExt.toLowerCase().startsWith(icon.toLowerCase())) {
      return validIcon;
    }
  }
  
  // If it contains .svg, extract everything up to and including .svg
  const svgMatch = icon.match(/([^\s]+\.svg)/i);
  if (svgMatch) {
    const extracted = svgMatch[1];
    // Verify it's a valid icon
    if (VALID_SVG_ICONS.includes(extracted)) {
      return extracted;
    }
    // If not in our list but ends with .svg, return it anyway (might be a new icon)
    return extracted;
  }
  
  // Try fuzzy matching for partial filenames (more aggressive)
  // This is a fallback for cases where the database has very truncated values
  const iconLower = icon.toLowerCase();
  for (const validIcon of VALID_SVG_ICONS) {
    const iconWithoutExt = validIcon.replace('.svg', '').toLowerCase();
    
    // If the icon string is a significant prefix of a valid icon
    // Match at least 5 characters for numbered icons (e.g., "019-superm" -> "019-supermarket")
    // Match at least 3 characters for named icons (e.g., "Dumbbell" -> "Dumbbell. weight...")
    if (iconLower.length >= 5 && iconWithoutExt.startsWith(iconLower)) {
      return validIcon;
    }
    if (iconLower.length >= 3 && !/^\d/.test(iconLower) && iconWithoutExt.startsWith(iconLower)) {
      return validIcon;
    }
  }
  
  // If it doesn't contain .svg and doesn't match any known pattern, return as-is (might be emoji)
  return icon;
}

/**
 * Check if an icon string is an SVG filename (ends with .svg)
 */
export function isSvgIcon(icon: string): boolean {
  if (!icon) return false;
  const cleanIcon = extractIconFilename(icon);
  return cleanIcon.toLowerCase().endsWith('.svg');
}

/**
 * Get the full path for an SVG icon
 * URL-encodes the filename to handle spaces and special characters
 */
export function getSvgIconPath(icon: string): string {
  if (!icon) return '';
  const cleanIcon = extractIconFilename(icon);
  if (!isSvgIcon(cleanIcon)) return '';
  
  // URL-encode the filename to handle spaces and special characters
  const encodedFilename = encodeURIComponent(cleanIcon);
  
  // Debug logging in production to help diagnose issues
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    console.log('[Icon Debug]', {
      original: icon,
      cleaned: cleanIcon,
      encoded: encodedFilename,
      path: `/icons/nearby-places/${encodedFilename}`
    });
  }
  
  return `/icons/nearby-places/${encodedFilename}`;
}

/**
 * Get a clean icon value for storage (removes any extra text)
 */
export function getCleanIconValue(icon: string): string {
  if (!icon) return '📍';
  const cleanIcon = extractIconFilename(icon);
  // If it's not an SVG, return as-is (emoji)
  if (!cleanIcon.toLowerCase().endsWith('.svg')) {
    return cleanIcon;
  }
  return cleanIcon;
}
