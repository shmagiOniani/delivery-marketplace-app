import { ViewStyle, TextStyle } from 'react-native';
import { Colors } from './Colors';
import { Spacing } from './Spacing';

export const ComponentStyles = {
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,
  button: {
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 24,
  } as ViewStyle,
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: Colors.white,
    width: '100%',
  } as TextStyle,
} as const;

