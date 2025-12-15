import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import { Stepper } from '@/components/ui/Stepper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  useOrderFormStore,
  type WeightOption,
  type SizeOption,
} from '@/stores/useOrderFormStore';
import type { CustomerScreenProps } from '@/types/navigation';

const weightOptions: WeightOption[] = ['light', 'medium', 'heavy'];
const sizeOptions: SizeOption[] = ['small', 'medium', 'large', 'xlarge'];

export const NewOrderStep3Screen: React.FC<
  CustomerScreenProps<'NewOrderStep3'>
> = ({ navigation }) => {
  const { formData, updateFormData } = useOrderFormStore();
  const [description, setDescription] = useState(formData.description || '');
  const [weight, setWeight] = useState<WeightOption | null>(formData.weight);
  const [size, setSize] = useState<SizeOption | null>(formData.size);
  const [fragile, setFragile] = useState(formData.fragile);
  const [pickupName, setPickupName] = useState(
    formData.pickupAddress?.name || '',
  );
  const [pickupFloor, setPickupFloor] = useState(
    formData.pickupAddress?.floor || '',
  );

  const handleContinue = () => {
    updateFormData({
      description,
      weight: weight || null,
      size: size || null,
      fragile,
      pickupAddress: {
        ...formData.pickupAddress!,
        name: pickupName,
        floor: pickupFloor,
      },
    });
    navigation.navigate('NewOrderStep4');
  };

  return (
    <View style={styles.container}>
      <Stepper currentStep={3} totalSteps={4} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.photoSection}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <View style={styles.photoGrid}>
            {[0, 1, 2, 3, 4].map((index) => (
              <TouchableOpacity
                key={index}
                style={styles.photoPlaceholder}
                activeOpacity={0.7}>
                {index === 0 ? (
                  <Icon name="inventory-2" size={32} color={Colors.text.light} />
                ) : (
                  <Icon name="add" size={32} color={Colors.text.light} />
                )}
                <Text style={styles.photoPlaceholderText}>
                  {index === 0 ? 'Photo' : '+'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description (500 chars)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Enter item description"
            placeholderTextColor={Colors.text.light}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <Text style={styles.charCount}>
            {description.length}/500
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weight</Text>
          <View style={styles.optionsRow}>
            {weightOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  weight === option && styles.optionButtonSelected,
                ]}
                onPress={() => setWeight(option)}>
                <Text
                  style={[
                    styles.optionText,
                    weight === option && styles.optionTextSelected,
                  ]}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Size</Text>
          <View style={styles.optionsRow}>
            {sizeOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  size === option && styles.optionButtonSelected,
                ]}
                onPress={() => setSize(option)}>
                <Text
                  style={[
                    styles.optionText,
                    size === option && styles.optionTextSelected,
                  ]}>
                  {option.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.fragileRow}>
            <View style={styles.fragileLabelContainer}>
              <Text style={styles.sectionTitle}>Fragile</Text>
              <TouchableOpacity style={styles.infoIcon}>
                <Icon name="info" size={16} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>
            <Switch
              value={fragile}
              onValueChange={setFragile}
              trackColor={{ false: Colors.lightGray, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup contact</Text>
          <Input
            placeholder="Name"
            value={pickupName}
            onChangeText={setPickupName}
            containerStyle={styles.input}
          />
          <Input
            placeholder="Floor"
            value={pickupFloor}
            onChangeText={setPickupFloor}
            containerStyle={styles.input}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Continue" onPress={handleContinue} />
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
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  photoSection: {
    marginBottom: Spacing.lg,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  photoPlaceholder: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: Colors.background,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  photoPlaceholderText: {
    ...Typography.tiny,
    color: Colors.text.light,
    marginTop: Spacing.xs,
  },
  textArea: {
    ...Typography.body,
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: Spacing.md,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text.primary,
  },
  charCount: {
    ...Typography.tiny,
    color: Colors.text.light,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  optionTextSelected: {
    color: Colors.white,
    fontWeight: '600',
  },
  fragileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fragileLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginLeft: Spacing.xs,
  },
  input: {
    marginBottom: Spacing.md,
  },
  footer: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
