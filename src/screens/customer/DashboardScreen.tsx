import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {Button} from '../../components/common/Button';
import {Card} from '../../components/common/Card';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';

export const CustomerDashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('jobs.createJob')}</Text>
      </View>
      <Card style={styles.card}>
        <Text style={styles.cardText}>Customer Dashboard</Text>
        <Button
          title={t('jobs.createJob')}
          onPress={() => navigation.navigate('CreateJob' as never)}
          style={styles.button}
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  card: {
    margin: spacing.lg,
  },
  cardText: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  button: {
    marginTop: spacing.md,
  },
});

