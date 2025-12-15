import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import { Stepper } from '@/components/ui/Stepper';
import { Button } from '@/components/ui/Button';
import { useOrderFormStore, type CargoType } from '@/stores/useOrderFormStore';
import type { CustomerScreenProps } from '@/types/navigation';

const cargoTypes: Array<{
  type: CargoType;
  labelEn: string;
  labelKa: string;
  icon: string;
}> = [
  { type: 'small', labelEn: 'Small item', labelKa: 'პატარა ამანათი', icon: 'inventory-2' },
  { type: 'furniture', labelEn: 'Furniture', labelKa: 'ავეჯი', icon: 'weekend' },
  { type: 'documents', labelEn: 'Documents', labelKa: 'დოკუმენტები', icon: 'folder' },
  { type: 'household', labelEn: 'Household', labelKa: 'საყოფაცხხო ნივთები', icon: 'home' },
];

export const NewOrderStep1Screen: React.FC<
  CustomerScreenProps<'NewOrderStep1'>
> = ({ navigation }) => {
  const { formData, updateFormData } = useOrderFormStore();
  const selectedType = formData.cargoType;

  const handleSelect = (type: CargoType) => {
    updateFormData({ cargoType: type });
  };

  const handleContinue = () => {
    if (selectedType) {
      navigation.navigate('NewOrderStep2');
    }
  };

  return (
    <View style={styles.container}>
      <Stepper currentStep={1} totalSteps={4} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>აირჩიე ტვირთის ტიპი</Text>
        <Text style={styles.subtitle}>Choose cargo type</Text>

        <View style={styles.grid}>
          {cargoTypes.map((item) => {
            const isSelected = selectedType === item.type;
            return (
              <TouchableOpacity
                key={item.type}
                style={[
                  styles.card,
                  isSelected && styles.cardSelected,
                ]}
                onPress={() => handleSelect(item.type)}
                activeOpacity={0.7}>
                <View
                  style={[
                    styles.iconContainer,
                    isSelected && styles.iconContainerSelected,
                  ]}>
                  <Icon
                    name={item.icon}
                    size={32}
                    color={isSelected ? Colors.primary : Colors.text.secondary}
                  />
                </View>
                <Text
                  style={[
                    styles.cardLabelEn,
                    isSelected && styles.cardLabelSelected,
                  ]}>
                  {item.labelEn}
                </Text>
                <Text style={styles.cardLabelKa}>{item.labelKa}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="გაგრძელება →"
          onPress={handleContinue}
          disabled={!selectedType}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  title: {
    ...Typography.h2,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  card: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.warning,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  iconContainerSelected: {
    backgroundColor: Colors.primary,
  },
  cardLabelEn: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  cardLabelSelected: {
    color: Colors.dark,
  },
  cardLabelKa: {
    ...Typography.small,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  footer: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
