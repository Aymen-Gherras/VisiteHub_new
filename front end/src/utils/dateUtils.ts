/**
 * Utility functions for date formatting and time calculations
 */

/**
 * Calculate time difference and return human-readable string
 * @param date - The date to compare against current time
 * @returns Human-readable time difference (e.g., "il y a 2 heures", "il y a 3 jours")
 */
export function getTimeAgo(date: Date | string): string {
  const now = new Date();
  const pastDate = new Date(date);
  const diffInMs = now.getTime() - pastDate.getTime();
  
  // Convert to different time units
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  // Return appropriate time ago string
  if (diffInSeconds < 60) {
    return 'il y a moins d\'une minute';
  } else if (diffInMinutes < 60) {
    return `il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
  } else if (diffInHours < 24) {
    return `il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
  } else if (diffInDays < 7) {
    return `il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
  } else if (diffInWeeks < 4) {
    return `il y a ${diffInWeeks} semaine${diffInWeeks > 1 ? 's' : ''}`;
  } else if (diffInMonths < 12) {
    return `il y a ${diffInMonths} mois`;
  } else {
    return `il y a ${diffInYears} an${diffInYears > 1 ? 's' : ''}`;
  }
}

/**
 * Format date for display in property details
 * @param date - The date to format
 * @returns Formatted date string (e.g., "15 janvier 2024")
 */
export function formatPropertyDate(date: Date | string): string {
  const propertyDate = new Date(date);
  
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  
  return propertyDate.toLocaleDateString('fr-FR', options);
}

/**
 * Get rent period label in French
 * @param period - The rent period ('month' or 'day')
 * @returns French label for the period
 */
export function getRentPeriodLabel(period: 'month' | 'day' | undefined): string {
  switch (period) {
    case 'day':
      return '/jour';
    case 'month':
    default:
      return '/mois';
  }
}

/**
 * Check if a property is recently added (within last 7 days)
 * @param date - The property creation date
 * @returns True if property is recently added
 */
export function isRecentlyAdded(date: Date | string): boolean {
  const now = new Date();
  const propertyDate = new Date(date);
  const diffInDays = Math.floor((now.getTime() - propertyDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return diffInDays <= 7;
}