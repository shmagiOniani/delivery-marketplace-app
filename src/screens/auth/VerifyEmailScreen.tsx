import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-toast-message';
import {Button} from '../../components/common/Button';
import {authService} from '../../services/supabase/auth';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';

export const VerifyEmailScreen: React.FC = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    try {
      const {error} = await authService.resendVerificationEmail();
      if (error) throw error;
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Verification email sent',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: t('errors.error'),
        text2: error.message || 'Failed to send verification email',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('auth.emailVerification')}</Text>
        <Text style={styles.message}>{t('auth.verifyEmailMessage')}</Text>
      </View>

      <View style={styles.actions}>
        <Button
          title={t('auth.resendVerification')}
          onPress={handleResend}
          loading={loading}
          disabled={loading}
          style={styles.button}
        />
        <Button
          title={t('auth.backToLogin')}
          onPress={() => navigation.navigate('Login' as never)}
          variant="secondary"
          style={styles.button}
        />
      </View>
    </ScrollView>
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  actions: {
    gap: spacing.md,
  },
  button: {
    width: '100%',
  },
});

