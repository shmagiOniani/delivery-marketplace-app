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
            name={icon}
            size={20}
            color={error ? Colors.error : Colors.gray}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[
            ComponentStyles.input,
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
  },
  icon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  inputWithIcon: {
    paddingLeft: 48,
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

