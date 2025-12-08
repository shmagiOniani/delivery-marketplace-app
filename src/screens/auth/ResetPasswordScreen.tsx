import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResetPasswordMutation } from '@/hooks/mutations/useResetPasswordMutation';
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from '@/lib/validation/schemas';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { AuthScreenProps } from '@/types/navigation';

export const ResetPasswordScreen: React.FC<
  AuthScreenProps<'ResetPassword'>
> = ({ navigation, route }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const resetPasswordMutation = useResetPasswordMutation();

  // Get token from route params if available (from email link)
  const token = route.params?.token;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
      token: token,
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    resetPasswordMutation.mutate({
      password: data.password,
      token: data.token,
    });
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your new password below. Make sure it's at least 6 characters
              with uppercase, lowercase, and a number.
            </Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.passwordContainer}>
                  <Input
                    label="New Password"
                    placeholder="Enter your new password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    icon="lock"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password-new"
                    editable={!resetPasswordMutation.isPending}
                    style={styles.passwordInput}
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Icon
                      name={showPassword ? 'visibility-off' : 'visibility'}
                      size={22}
                      color={Colors.text.secondary}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.passwordContainer}>
                  <Input
                    label="Confirm New Password"
                    placeholder="Confirm your new password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.confirmPassword?.message}
                    icon="lock-outline"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoComplete="password-new"
                    editable={!resetPasswordMutation.isPending}
                    style={styles.passwordInput}
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Icon
                      name={showConfirmPassword ? 'visibility-off' : 'visibility'}
                      size={22}
                      color={Colors.text.secondary}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />

            <View style={styles.passwordHint}>
              <Text style={styles.passwordHintText}>
                Password must contain at least 6 characters with uppercase,
                lowercase, and a number
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title="Reset Password"
                onPress={handleSubmit(onSubmit)}
                loading={resetPasswordMutation.isPending}
                disabled={resetPasswordMutation.isPending}
                style={styles.submitButton}
              />
            </View>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Remember your password? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                disabled={resetPasswordMutation.isPending}
              >
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
  },
  backButton: {
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    alignSelf: 'flex-start',
  },
  header: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  form: {
    flex: 1,
    justifyContent: 'space-between',
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 48,
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    top: 40,
    padding: 8,
    zIndex: 10,
  },
  passwordHint: {
    marginTop: -Spacing.sm,
    marginBottom: Spacing.md,
  },
  passwordHintText: {
    ...Typography.tiny,
    color: Colors.text.light,
    lineHeight: 16,
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingTop: Spacing.xl,
  },
  submitButton: {
    marginBottom: Spacing.lg,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  loginText: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  loginLink: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
});

