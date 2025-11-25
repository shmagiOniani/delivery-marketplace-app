import {format, formatDistanceToNow} from 'date-fns';
import {enUS, ka} from 'date-fns/locale';

export const formatCurrency = (amount: number, currency: string = 'GEL'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: string | Date, locale: string = 'en'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const localeObj = locale === 'ka' ? ka : enUS;
  return format(dateObj, 'PPp', {locale: localeObj});
};

export const formatRelativeTime = (date: string | Date, locale: string = 'en'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const localeObj = locale === 'ka' ? ka : enUS;
  return formatDistanceToNow(dateObj, {addSuffix: true, locale: localeObj});
};

export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)}km`;
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

