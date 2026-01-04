import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { CustomerScreenProps } from '@/types/navigation';

interface ItemType {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

const ITEM_TYPES: ItemType[] = [
  {
    id: 'furniture',
    name: 'Furniture',
    icon: 'chair',
    description: 'Tables, chairs, sofas, cabinets',
    color: Colors.primary,
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: 'devices',
    description: 'TVs, computers, appliances',
    color: Colors.orange,
  },
  {
    id: 'boxes',
    name: 'Boxes',
    icon: 'inventory-2',
    description: 'Packed boxes, packages',
    color: Colors.success,
  },
  {
    id: 'other',
    name: 'Other',
    icon: 'category',
    description: 'Other items',
    color: Colors.gray,
  },
];

export const NewOrderStep1Screen: React.FC<
  CustomerScreenProps<'NewOrderStep1'>
> = () => {
  const navigation = useNavigation();
  const [selectedType, setSelectedType] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleNext = () => {
    if (!selectedType) {
      setError('Please select an item type');
      return;
    }

    navigation.navigate('Customer', {
      screen: 'NewOrderStep2',
      params: { itemType: selectedType },
    } as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>What are you shipping?</Text>
          <Text style={styles.subtitle}>
            Select the type of item to help us estimate the delivery
          </Text>
        </View>

        {/* Item Type Cards */}
        <View style={styles.cardsContainer}>
          {ITEM_TYPES.map((type) => {
            const isSelected = selectedType === type.id;
            return (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.card,
                  isSelected && [
                    styles.cardSelected,
                    { borderColor: type.color },
                  ],
                ]}
                onPress={() => {
                  setSelectedType(type.id);
                  setError('');
                }}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${type.color}15` },
                  ]}
                >
                  <Icon name={type.icon} size={32} color={type.color} />
                </View>
                <Text style={styles.cardTitle}>{type.name}</Text>
                <Text style={styles.cardDescription}>{type.description}</Text>
                {isSelected && (
                  <View style={[styles.checkmark, { backgroundColor: type.color }]}>
                    <Icon name="check" size={16} color={Colors.white} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Next Button */}
        <TouchableOpacity
          style={[
            styles.nextButton,
            !selectedType && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!selectedType}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>Continue</Text>
          <Icon name="arrow-forward" size={20} color={Colors.white} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl * 2,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    color: Colors.dark,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  cardsContainer: {
    marginBottom: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  cardSelected: {
    borderWidth: 2,
    backgroundColor: '#FFFBEB',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    ...Typography.h3,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  cardDescription: {
    ...Typography.small,
    color: Colors.text.secondary,
  },
  checkmark: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...Typography.small,
    color: Colors.error,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonDisabled: {
    backgroundColor: Colors.lightGray,
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    ...Typography.bodyBold,
    color: Colors.white,
    fontSize: 18,
  },
});
