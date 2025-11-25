import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button} from '../../components/common/Button';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {useTranslation} from 'react-i18next';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Carryo</Text>
        <Text style={styles.subtitle}>
          Your trusted delivery marketplace
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          title={t('auth.login')}
          onPress={() => navigation.navigate('Auth' as never, {screen: 'Login'} as never)}
          variant="primary"
          size="large"
          style={styles.button}
        />
        <Button
          title={t('auth.signup')}
          onPress={() => navigation.navigate('Auth' as never, {screen: 'Signup'} as never)}
          variant="secondary"
          size="large"
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
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxxxl,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  subtitle: {
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

