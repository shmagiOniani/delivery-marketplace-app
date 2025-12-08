import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { ComponentStyles } from '@/constants/ComponentStyles';

interface InputProps extends TextInputProps {
  error?: string;
  icon?: string;
  label?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  error,
  icon,
  label,
  containerStyle,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {icon && (
          <Icon
            name={icon === 'email' ? 'mail' : icon}
            size={20}
            color={error ? Colors.error : Colors.text.secondary}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[
            ComponentStyles.input,
            { flex: 1, width: '100%' },
            icon && styles.inputWithIcon,
            error && styles.inputError,
            style,
          ]}
          placeholderTextColor={Colors.text.light}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    ...Typography.small,
    color: Colors.text.primary,
    marginBottom: 8,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  inputWithIcon: {
    paddingLeft: 48,
    flex: 1,
    width: '100%',
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    ...Typography.tiny,
    color: Colors.error,
    marginTop: 4,
  },
});

