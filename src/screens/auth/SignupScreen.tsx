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
import { useSignupMutation } from '@/hooks/mutations/useAuthMutations';
import { signupSchema, type SignupFormData } from '@/lib/validation/schemas';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { AuthScreenProps } from '@/types/navigation';

export const SignupScreen: React.FC<AuthScreenProps<'Signup'>> = ({
  navigation,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const signupMutation = useSignupMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      full_name: '',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    signupMutation.mutate(data);
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
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Sign up to start using Carryo
            </Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="full_name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Full Name (Optional)"
                  placeholder="Enter your full name"
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.full_name?.message}
                  icon="person"
                  autoCapitalize="words"
                  autoComplete="name"
                  editable={!signupMutation.isPending}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  icon="email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  editable={!signupMutation.isPending}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Input
                    label="Password"
                    placeholder="Enter your password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    icon="lock"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password-new"
                    editable={!signupMutation.isPending}
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Icon
                      name={showPassword ? 'visibility-off' : 'visibility'}
                      size={20}
                      color={Colors.gray}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Input
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.confirmPassword?.message}
                    icon="lock-outline"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoComplete="password-new"
                    editable={!signupMutation.isPending}
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Icon
                      name={showConfirmPassword ? 'visibility-off' : 'visibility'}
                      size={20}
                      color={Colors.gray}
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

            <Button
              title="Sign Up"
              onPress={handleSubmit(onSubmit)}
              loading={signupMutation.isPending}
              disabled={signupMutation.isPending}
              style={styles.submitButton}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                disabled={signupMutation.isPending}
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
  header: {
    marginTop: Spacing.xxl,
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
  },
  form: {
    flex: 1,
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    top: 40,
    padding: 8,
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
  submitButton: {
    marginTop: Spacing.md,
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
