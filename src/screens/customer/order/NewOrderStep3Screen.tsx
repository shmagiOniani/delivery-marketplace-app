import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PhotoUpload } from '@/screens/customer/job/components/PhotoUpload';
import type { CustomerScreenProps } from '@/types/navigation';

const ITEM_SIZES = [
  { id: 'small', label: 'Small', description: 'Fits in a car trunk' },
  { id: 'medium', label: 'Medium', description: 'Requires a van' },
  { id: 'large', label: 'Large', description: 'Requires a truck' },
];

export const NewOrderStep3Screen: React.FC<
  CustomerScreenProps<'NewOrderStep3'>
> = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    itemType,
    pickupLocation,
    deliveryLocation,
    distance,
    duration,
  } = route.params as {
    itemType: string;
    pickupLocation: { latitude: number; longitude: number; address: string };
    deliveryLocation: { latitude: number; longitude: number; address: string };
    distance: number;
    duration: number;
  };

  const [images, setImages] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [itemSize, setItemSize] = useState<string>('');
  const [floor, setFloor] = useState('');
  const [hasElevator, setHasElevator] = useState(true);
  const [errors, setErrors] = useState<{
    description?: string;
    itemSize?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!description.trim() || description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!itemSize) {
      newErrors.itemSize = 'Please select item size';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) {
      return;
    }

    navigation.navigate('Customer', {
      screen: 'NewOrderStep4',
      params: {
        itemType,
        pickupLocation,
        deliveryLocation,
        distance,
        duration,
        images,
        description: description.trim(),
        itemSize,
        floor: floor ? parseInt(floor, 10) : undefined,
        hasElevator,
      },
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
          <Text style={styles.title}>Item Details</Text>
          <Text style={styles.subtitle}>
            Provide details about the item to help drivers prepare
          </Text>
        </View>

        {/* Photos */}
        <PhotoUpload
          photos={images}
          onPhotosChange={setImages}
          maxPhotos={5}
          label="Item Photos"
        />

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[
              styles.textArea,
              errors.description && styles.inputError,
            ]}
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              if (errors.description) {
                setErrors({ ...errors, description: undefined });
              }
            }}
            placeholder="Describe the item, its condition, and any special handling requirements..."
            placeholderTextColor={Colors.text.secondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />
          <View style={styles.inputFooter}>
            {errors.description ? (
              <Text style={styles.errorText}>{errors.description}</Text>
            ) : (
              <Text style={styles.hint}>
                Minimum 10 characters. Be specific about size and weight.
              </Text>
            )}
            <Text style={styles.charCount}>{description.length}/500</Text>
          </View>
        </View>

        {/* Item Size */}
        <View style={styles.section}>
          <Text style={styles.label}>Item Size *</Text>
          <View style={styles.sizeContainer}>
            {ITEM_SIZES.map((size) => {
              const isSelected = itemSize === size.id;
              return (
                <TouchableOpacity
                  key={size.id}
                  style={[
                    styles.sizeCard,
                    isSelected && styles.sizeCardSelected,
                  ]}
                  onPress={() => {
                    setItemSize(size.id);
                    if (errors.itemSize) {
                      setErrors({ ...errors, itemSize: undefined });
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.sizeLabel}>{size.label}</Text>
                  <Text style={styles.sizeDescription}>{size.description}</Text>
                  {isSelected && (
                    <View style={styles.sizeCheckmark}>
                      <Icon name="check" size={16} color={Colors.white} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          {errors.itemSize && (
            <Text style={styles.errorText}>{errors.itemSize}</Text>
          )}
        </View>

        {/* Floor and Elevator */}
        <View style={styles.section}>
          <Text style={styles.label}>Pickup Details</Text>
          
          <View style={styles.floorContainer}>
            <Text style={styles.floorLabel}>Floor (optional)</Text>
            <TextInput
              style={styles.floorInput}
              value={floor}
              onChangeText={(text) => {
                // Only allow numbers
                if (text === '' || /^\d+$/.test(text)) {
                  setFloor(text);
                }
              }}
              placeholder="0"
              placeholderTextColor={Colors.text.secondary}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>

          <View style={styles.elevatorContainer}>
            <View style={styles.elevatorInfo}>
              <Icon name="elevator" size={24} color={Colors.dark} />
              <View style={styles.elevatorTextContainer}>
                <Text style={styles.elevatorLabel}>Elevator Available</Text>
                <Text style={styles.elevatorHint}>
                  Toggle if there's an elevator at pickup location
                </Text>
              </View>
            </View>
            <Switch
              value={hasElevator}
              onValueChange={setHasElevator}
              trackColor={{ false: Colors.lightGray, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
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
    marginBottom: Spacing.lg,
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
  section: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.bodyBold,
    color: Colors.dark,
    marginBottom: Spacing.sm,
  },
  textArea: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    ...Typography.body,
    color: Colors.dark,
    minHeight: 100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputError: {
    borderColor: Colors.error,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  hint: {
    flex: 1,
    ...Typography.small,
    color: Colors.text.secondary,
  },
  charCount: {
    ...Typography.small,
    color: Colors.text.secondary,
    marginLeft: Spacing.sm,
  },
  errorText: {
    ...Typography.small,
    color: Colors.error,
  },
  sizeContainer: {
    gap: Spacing.sm,
  },
  sizeCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  sizeCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#FFFBEB',
  },
  sizeLabel: {
    ...Typography.bodyBold,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  sizeDescription: {
    ...Typography.small,
    color: Colors.text.secondary,
  },
  sizeCheckmark: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  floorLabel: {
    ...Typography.body,
    color: Colors.dark,
  },
  floorInput: {
    width: 80,
    ...Typography.bodyBold,
    color: Colors.dark,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: Spacing.sm,
  },
  elevatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  elevatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  elevatorTextContainer: {
    flex: 1,
  },
  elevatorLabel: {
    ...Typography.bodyBold,
    color: Colors.dark,
    marginBottom: Spacing.xs / 2,
  },
  elevatorHint: {
    ...Typography.small,
    color: Colors.text.secondary,
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
  nextButtonText: {
    ...Typography.bodyBold,
    color: Colors.white,
    fontSize: 18,
  },
});
