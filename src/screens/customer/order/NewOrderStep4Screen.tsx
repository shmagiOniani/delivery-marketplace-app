import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Switch,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
// @ts-ignore - DateTimePicker types may not be available
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PhotoUpload } from '@/screens/customer/job/components/PhotoUpload';
import { useCreateOrderMutation } from '@/hooks/mutations/useOrderMutations';
import { calculateDistance, estimateDuration } from '@/utils/distanceCalculator';
import { calculatePrice } from '@/utils/priceCalculator';
import type { CustomerScreenProps } from '@/types/navigation';
import type { JobPurpose } from '@/types';

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export const NewOrderStep4Screen: React.FC<
  CustomerScreenProps<'NewOrderStep4'>
> = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    jobType,
    title,
    pickupLocation,
    pickupContactName,
    pickupContactPhone,
    pickupNotes,
    pickupFloor,
    pickupElevator,
    deliveryLocation,
    deliveryContactName,
    deliveryContactPhone,
    deliveryNotes,
    deliveryFloor,
    deliveryElevator,
  } = route.params as {
    jobType: JobPurpose;
    title: string;
    pickupLocation: Location;
    pickupContactName: string;
    pickupContactPhone: string;
    pickupNotes: string;
    pickupFloor?: number;
    pickupElevator: boolean;
    deliveryLocation: Location;
    deliveryContactName: string;
    deliveryContactPhone: string;
    deliveryNotes: string;
    deliveryFloor?: number;
    deliveryElevator: boolean;
  };

  const createOrderMutation = useCreateOrderMutation();

  // Calculate distance and duration
  const distance = calculateDistance(
    pickupLocation.latitude,
    pickupLocation.longitude,
    deliveryLocation.latitude,
    deliveryLocation.longitude
  );
  const duration = estimateDuration(distance);

  const [photos, setPhotos] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [requiresHelp, setRequiresHelp] = useState(false);
  const [customerPrice, setCustomerPrice] = useState('');
  const [scheduledPickup, setScheduledPickup] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [errors, setErrors] = useState<{
    photos?: string;
    description?: string;
    customerPrice?: string;
  }>({});

  const isGiftJob = jobType === 'gift';

  // Calculate pricing (for non-gift jobs)
  const pricing = !isGiftJob && customerPrice
    ? calculatePrice({
        distanceKm: distance,
        floor: pickupFloor || 0,
        hasElevator: pickupElevator,
        itemSize: 'medium', // Default, can be enhanced later
      })
    : null;

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const existingDate = scheduledPickup || new Date();
      selectedDate.setHours(existingDate.getHours());
      selectedDate.setMinutes(existingDate.getMinutes());
      setScheduledPickup(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const existingDate = scheduledPickup || new Date();
      existingDate.setHours(selectedTime.getHours());
      existingDate.setMinutes(selectedTime.getMinutes());
      setScheduledPickup(existingDate);
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date | null): string => {
    if (!date) return 'Select time';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const validate = () => {
    const newErrors: typeof errors = {};

    if (photos.length === 0) {
      newErrors.photos = 'Please upload at least one photo';
    }

    if (!description.trim() || description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!isGiftJob && (!customerPrice || parseFloat(customerPrice) <= 0)) {
      newErrors.customerPrice = 'Please enter a valid price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    try {
      const formData = new FormData();

      // Basic info
      formData.append('job_type', jobType);
      formData.append('title', title);
      formData.append('description', description.trim());

      // Pickup location
      formData.append('pickup_address', pickupLocation.address);
      formData.append('pickup_lat', pickupLocation.latitude.toString());
      formData.append('pickup_lng', pickupLocation.longitude.toString());
      
      // Pickup contact
      if (pickupContactName) {
        formData.append('pickup_contact_name', pickupContactName);
      }
      if (pickupContactPhone) {
        formData.append('pickup_contact_phone', pickupContactPhone);
      }
      if (pickupNotes) {
        formData.append('pickup_notes', pickupNotes);
      }
      if (pickupFloor !== undefined && pickupFloor > 0) {
        formData.append('pickup_floor', pickupFloor.toString());
      }
      formData.append('pickup_elevator', pickupElevator.toString());

      // Delivery location
      formData.append('delivery_address', deliveryLocation.address);
      formData.append('delivery_lat', deliveryLocation.latitude.toString());
      formData.append('delivery_lng', deliveryLocation.longitude.toString());
      
      // Delivery contact (only for move jobs)
      if (jobType === 'move') {
        if (deliveryContactName) {
          formData.append('delivery_contact_name', deliveryContactName);
        }
        if (deliveryContactPhone) {
          formData.append('delivery_contact_phone', deliveryContactPhone);
        }
        if (deliveryNotes) {
          formData.append('delivery_notes', deliveryNotes);
        }
        if (deliveryFloor !== undefined && deliveryFloor > 0) {
          formData.append('delivery_floor', deliveryFloor.toString());
        }
        formData.append('delivery_elevator', deliveryElevator.toString());
      }

      // Photos
      if (photos.length > 0) {
        formData.append('pickup_photos', JSON.stringify(photos));
      }

      // Requires help
      formData.append('requires_help', requiresHelp.toString());

      // Pricing
      if (isGiftJob) {
        formData.append('customer_price', '0');
        formData.append('platform_fee', '0');
        formData.append('driver_payout', '0');
      } else {
        const price = parseFloat(customerPrice);
        const platformFee = price * 0.15; // 15% for ONLINE_PAYMENT
        const driverPayout = price - platformFee;
        
        formData.append('customer_price', price.toString());
        formData.append('platform_fee', platformFee.toFixed(2));
        formData.append('driver_payout', driverPayout.toFixed(2));
      }
      formData.append('payment_type', 'ONLINE_PAYMENT'); // Default

      // Scheduled pickup
      if (scheduledPickup) {
        formData.append('scheduled_pickup', scheduledPickup.toISOString());
      }

      // Submit order
      const result = await createOrderMutation.mutateAsync(formData);

      if (result.success) {
        // Check for moderation flags
        if (result.reasons && result.reasons.length > 0) {
          Alert.alert(
            'Order Created (Under Review)',
            `Your order has been created but is being reviewed:\n\n${result.reasons.join('\n')}\n\nIt may not be visible to drivers until approved.`,
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.navigate('Customer', {
                    screen: 'OrderSuccess',
                    params: { jobId: result.data.id },
                  } as any);
                },
              },
            ]
          );
        } else {
          navigation.navigate('Customer', {
            screen: 'OrderSuccess',
            params: { jobId: result.data.id },
          } as any);
        }
      }
    } catch (error: any) {
      console.error('Order creation error:', error);
      
      if (error.reasons && error.reasons.length > 0) {
        Alert.alert(
          'Order Creation Failed',
          `Your order was rejected:\n\n${error.reasons.join('\n')}\n\nPlease review your content and try again.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Order Failed',
          error.message || 'Failed to create order. Please try again.',
          [{ text: 'OK' }]
        );
      }
    }
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
        <View style={styles.section}>
          <PhotoUpload
            photos={photos}
            onPhotosChange={setPhotos}
            maxPhotos={3}
            label="Photos of Item *"
          />
          {errors.photos && (
            <Text style={styles.errorText}>{errors.photos}</Text>
          )}
        </View>

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
            placeholder="e.g., 13 bags of construction waste. I think one person won't be enough"
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

        {/* Requires Help */}
        <View style={styles.section}>
          <View style={styles.checkboxContainer}>
            <View style={styles.checkboxInfo}>
              <Icon name="help-outline" size={24} color={Colors.dark} />
              <View style={styles.checkboxTextContainer}>
                <Text style={styles.checkboxLabel}>Need Help Loading</Text>
                <Text style={styles.checkboxHint}>
                  Toggle if you need help loading items
                </Text>
              </View>
            </View>
            <Switch
              value={requiresHelp}
              onValueChange={setRequiresHelp}
              trackColor={{ false: Colors.lightGray, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        {/* Pricing & Scheduling */}
        <View style={styles.pricingSection}>
          <Text style={styles.sectionTitle}>Pricing & Scheduling</Text>
          
          <View style={styles.twoColumn}>
            {/* Customer Price */}
            <View style={styles.column}>
              <Text style={styles.label}>
                Your Price {!isGiftJob && '*'}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  errors.customerPrice && styles.inputError,
                  isGiftJob && styles.inputDisabled,
                ]}
                value={isGiftJob ? '0' : customerPrice}
                onChangeText={(text) => {
                  if (text === '' || /^\d*\.?\d*$/.test(text)) {
                    setCustomerPrice(text);
                    if (errors.customerPrice) {
                      setErrors({ ...errors, customerPrice: undefined });
                    }
                  }
                }}
                placeholder="500"
                placeholderTextColor={Colors.text.secondary}
                keyboardType="decimal-pad"
                editable={!isGiftJob}
              />
              {isGiftJob && (
                <Text style={styles.giftHint}>
                  Free pickup, no charges
                </Text>
              )}
              {errors.customerPrice && (
                <Text style={styles.errorText}>{errors.customerPrice}</Text>
              )}
            </View>

            {/* Scheduled Pickup */}
            <View style={styles.column}>
              <Text style={styles.label}>Preferred Pickup Time</Text>
              <View style={styles.dateTimeContainer}>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateTimeButtonText}>
                    {formatDate(scheduledPickup)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={styles.dateTimeButtonText}>
                    {formatTime(scheduledPickup)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Date/Time Pickers */}
        {showDatePicker && (
          <DateTimePicker
            value={scheduledPickup || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={scheduledPickup || new Date()}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            createOrderMutation.isPending && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={createOrderMutation.isPending}
          activeOpacity={0.8}
        >
          {createOrderMutation.isPending ? (
            <>
              <ActivityIndicator color={Colors.white} />
              <Text style={styles.submitButtonText}>Creating...</Text>
            </>
          ) : (
            <>
              <Text style={styles.submitButtonText}>Continue to Payment</Text>
              <Icon name="arrow-forward" size={20} color={Colors.white} />
            </>
          )}
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
  sectionTitle: {
    ...Typography.bodyBold,
    color: Colors.dark,
    marginBottom: Spacing.md,
    fontSize: 18,
  },
  label: {
    ...Typography.body,
    color: Colors.dark,
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    ...Typography.body,
    color: Colors.dark,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputDisabled: {
    backgroundColor: Colors.lightGray,
    color: Colors.text.secondary,
  },
  inputError: {
    borderColor: Colors.error,
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
  giftHint: {
    ...Typography.small,
    color: Colors.orange,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  checkboxInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxLabel: {
    ...Typography.bodyBold,
    color: Colors.dark,
    marginBottom: Spacing.xs / 2,
  },
  checkboxHint: {
    ...Typography.small,
    color: Colors.text.secondary,
  },
  pricingSection: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  twoColumn: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  column: {
    flex: 1,
  },
  dateTimeContainer: {
    gap: Spacing.sm,
  },
  dateTimeButton: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dateTimeButtonText: {
    ...Typography.body,
    color: Colors.dark,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: Colors.darkBlue,
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    shadowColor: Colors.darkBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    ...Typography.bodyBold,
    color: Colors.white,
    fontSize: 18,
  },
});
