import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-toast-message';
import {Input} from '../../components/common/Input';
import {Button} from '../../components/common/Button';
import {useAuthStore} from '../../store/authStore';
import {signupSchema} from '../../utils/validation';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';

interface SignupFormData {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  role: 'customer' | 'driver';
  terms_accepted: boolean;
}

export const SignupScreen: React.FC = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {signUp} = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'customer' | 'driver'>('customer');

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      confirm_password: '',
      role: 'customer',
      terms_accepted: false,
    },
  });

  const termsAccepted = watch('terms_accepted');

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try {
      await signUp(data.email, data.password, data.full_name, data.role);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Account created successfully',
      });
      navigation.navigate('VerifyEmail' as never);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: t('errors.error'),
        text2: error.message || t('errors.networkError'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>{t('auth.signup')}</Text>
          <Text style={styles.subtitle}>
            Create an account to get started
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.roleSelector}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'customer' && styles.roleButtonActive,
              ]}
              onPress={() => {
                setRole('customer');
                setValue('role', 'customer');
              }}>
              <Text
                style={[
                  styles.roleButtonText,
                  role === 'customer' && styles.roleButtonTextActive,
                ]}>
                {t('auth.customer')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'driver' && styles.roleButtonActive,
              ]}
              onPress={() => {
                setRole('driver');
                setValue('role', 'driver');
              }}>
              <Text
                style={[
                  styles.roleButtonText,
                  role === 'driver' && styles.roleButtonTextActive,
                ]}>
                {t('auth.driver')}
              </Text>
            </TouchableOpacity>
          </View>

          <Controller
            control={control}
            name="full_name"
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                label={t('auth.fullName')}
                placeholder={t('auth.fullName')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.full_name?.message}
                autoCapitalize="words"
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                label={t('auth.email')}
                placeholder={t('auth.email')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                label={t('auth.password')}
                placeholder={t('auth.password')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
              />
            )}
          />

          <Controller
            control={control}
            name="confirm_password"
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                label={t('auth.confirmPassword')}
                placeholder={t('auth.confirmPassword')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirm_password?.message}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
              />
            )}
          />

          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => setValue('terms_accepted', !termsAccepted)}>
            <View
              style={[
                styles.checkbox,
                termsAccepted && styles.checkboxChecked,
              ]}>
              {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>{t('auth.termsAccepted')}</Text>
          </TouchableOpacity>
          {errors.terms_accepted && (
            <Text style={styles.error}>{errors.terms_accepted.message}</Text>
          )}

          <Button
            title={t('auth.signUp')}
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading || !termsAccepted}
            style={styles.submitButton}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>{t('auth.alreadyHaveAccount')} </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginLink}>{t('auth.signIn')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    padding: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
  },
  form: {
    width: '100%',
  },
  roleSelector: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  roleButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  roleButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  roleButtonText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  roleButtonTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 4,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsText: {
    ...typography.caption,
    color: colors.text.secondary,
    flex: 1,
  },
  error: {
    ...typography.small,
    color: colors.error,
    marginBottom: spacing.md,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  loginText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  loginLink: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
});

