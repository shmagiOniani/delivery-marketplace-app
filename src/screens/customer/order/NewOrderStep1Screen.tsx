import React, { useState } from 'react';
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
import { Input } from '@/components/ui/Input';
import { useOrderFormStore, type JobType } from '@/stores/useOrderFormStore';
import type { CustomerScreenProps } from '@/types/navigation';

const jobTypes: Array<{
  type: JobType;
  labelEn: string;
  labelKa: string;
  icon: string;
  descriptionEn: string;
  descriptionKa: string;
}> = [
  {
    type: 'move',
    labelEn: 'Move',
    labelKa: 'გადატანა',
    icon: 'local-shipping',
    descriptionEn: 'From one place to another',
    descriptionKa: 'ერთი ადგილიდან მეორეში',
  },
  {
    type: 'recycle',
    labelEn: 'Recycle',
    labelKa: 'რეციკლირება',
    icon: 'recycling',
    descriptionEn: 'Take to recycle/trash',
    descriptionKa: 'რეციკლირებაში გადატანა',
  },
  {
    type: 'gift',
    labelEn: 'Gift',
    labelKa: 'საჩუქარი',
    icon: 'card-giftcard',
    descriptionEn: 'Free pickup, no charges',
    descriptionKa: 'უფასო აღება',
  },
];

export const NewOrderStep1Screen: React.FC<
  CustomerScreenProps<'NewOrderStep1'>
> = ({ navigation }) => {
  const { formData, updateFormData } = useOrderFormStore();
  const [title, setTitle] = useState(formData.title || '');
  const selectedJobType = formData.jobType;

  const handleSelectJobType = (type: JobType) => {
    updateFormData({ jobType: type });
  };

  const handleContinue = () => {
    if (selectedJobType && title.trim().length >= 3) {
      updateFormData({ title: title.trim() });
      navigation.navigate('NewOrderStep2');
    }
  };

  const isValid = selectedJobType !== null && title.trim().length >= 3;

  return (
    <View style={styles.container}>
      <Stepper currentStep={1} totalSteps={4} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Delivery Type</Text>
        <Text style={styles.subtitle}>მიწოდების ტიპი</Text>

        {/* Title Input */}
        <View style={styles.titleSection}>
          <Input
            label="Title *"
            placeholder="e.g., Moving furniture from apartment"
            value={title}
            onChangeText={setTitle}
            containerStyle={styles.titleInput}
            maxLength={100}
          />
        </View>

        {/* Job Type Selection */}
        <View style={styles.jobTypesContainer}>
          {jobTypes.map((item) => {
            const isSelected = selectedJobType === item.type;
            return (
              <TouchableOpacity
                key={item.type}
                style={[
                  styles.jobTypeCard,
                  isSelected && styles.jobTypeCardSelected,
                ]}
                onPress={() => handleSelectJobType(item.type)}
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
                    styles.jobTypeLabelEn,
                    isSelected && styles.jobTypeLabelSelected,
                  ]}>
                  {item.labelEn}
                </Text>
                <Text style={styles.jobTypeLabelKa}>{item.labelKa}</Text>
                <Text style={styles.jobTypeDescription}>
                  {item.descriptionEn}
                </Text>
                <Text style={styles.jobTypeDescriptionKa}>
                  {item.descriptionKa}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Next →"
          onPress={handleContinue}
          disabled={!isValid}
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
  titleSection: {
    marginBottom: Spacing.lg,
  },
  titleInput: {
    marginBottom: 0,
  },
  jobTypesContainer: {
    gap: Spacing.md,
  },
  jobTypeCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  jobTypeCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#F3E8FF', // Purple background as per spec
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  iconContainerSelected: {
    backgroundColor: Colors.primary,
  },
  jobTypeLabelEn: {
    ...Typography.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  jobTypeLabelSelected: {
    color: Colors.dark,
  },
  jobTypeLabelKa: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  jobTypeDescription: {
    ...Typography.small,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  jobTypeDescriptionKa: {
    ...Typography.tiny,
    color: Colors.text.light,
    textAlign: 'center',
  },
  footer: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
