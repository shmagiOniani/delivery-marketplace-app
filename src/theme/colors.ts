export const colors = {
  primary: '#1E293B',      // Slate Gray (Dark Blue)
  secondary: '#EAB308',    // Gold Yellow
  accent: '#eab308',       // Gold Yellow (accent)
  background: '#F1F5F9',  // Cool Gray
  surface: '#FFFFFF',      // White
  text: {
    primary: '#0F172A',    // Deep Slate
    secondary: '#64748B',  // Slate Gray
    disabled: '#94A3B8',  // Light Slate
  },
  border: '#E2E8F0',      // Light Gray
  status: {
    pending: '#F59E0B',    // Yellow
    accepted: '#3B82F6',  // Blue
    inTransit: '#8B5CF6', // Purple
    delivered: '#10B981', // Green
    cancelled: '#EF4444', // Red
  },
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
};

export type Colors = typeof colors;

