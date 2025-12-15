import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import { Stepper } from '@/components/ui/Stepper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useOrderFormStore } from '@/stores/useOrderFormStore';
import { useCreateOrderMutation } from '@/hooks/mutations/useOrderMutations';
import { calculatePrice } from '@/utils/priceCalculator';
import type { CustomerScreenProps } from '@/types/navigation';

const itemCategories = [
  'Furniture',
  'Electronics',
  'Boxes',
  'Construction Waste',
  'Appliances',
  'Other',
];

const sizeOptions = ['small', 'medium', 'large', 'xlarge'];
const weightOptions = ['light', 'medium', 'heavy'];

export const NewOrderStep4Screen: React.FC<
  CustomerScreenProps<'NewOrderStep4'>
> = ({ navigation }) => {
  const { formData, updateFormData, resetForm } = useOrderFormStore();
  const createOrder = useCreateOrderMutation();
  const jobType = formData.jobType;

  const [description, setDescription] = useState(formData.description || '');
  const [itemCategory, setItemCategory] = useState(
    formData.item_category || '',
  );
  const [itemSize, setItemSize] = useState<typeof sizeOptions[number] | null>(
    formData.item_size || null,
  );
  const [itemWeight, setItemWeight] = useState<
    typeof weightOptions[number] | null
  >(formData.item_weight || null);
  const [requiresHelp, setRequiresHelp] = useState(
    formData.requires_help || false,
  );
  const [customerPrice, setCustomerPrice] = useState(
    formData.customer_price || '',
  );
  const [scheduledPickup, setScheduledPickup] = useState(
    formData.scheduled_pickup || '',
  );
  const [paymentType, setPaymentType] = useState(formData.paymentType);

  // Calculate platform fee and driver payout
  const priceValue = parseFloat(customerPrice) || 0;
  const platformFee =
    paymentType === 'CASH' ? 0 : priceValue * 0.15; // 15% for online
  const driverPayout = priceValue - platformFee;

  // For gift type, all prices are 0
  const finalPrice = jobType === 'gift' ? 0 : priceValue;
  const finalPlatformFee = jobType === 'gift' ? 0 : platformFee;
  const finalDriverPayout = jobType === 'gift' ? 0 : driverPayout;

  const buildFormData = () => {
    const formDataObj = new FormData();

    // Required fields
    formDataObj.append('title', formData.title);
    formDataObj.append('job_type', jobType || 'move');
    formDataObj.append('pickup_address', formData.pickupLocation?.address || '');
    formDataObj.append(
      'pickup_lat',
      formData.pickupLocation?.lat?.toString() || '',
    );
    formDataObj.append(
      'pickup_lng',
      formData.pickupLocation?.lng?.toString() || '',
    );

    // Delivery location (skip for gift)
    if (jobType !== 'gift' && formData.deliveryLocation) {
      formDataObj.append(
        'delivery_address',
        formData.deliveryLocation.address,
      );
      formDataObj.append(
        'delivery_lat',
        formData.deliveryLocation.lat.toString(),
      );
      formDataObj.append(
        'delivery_lng',
        formData.deliveryLocation.lng.toString(),
      );
    }

    // Contact information
    formDataObj.append('pickup_contact_name', formData.pickupContactName);
    formDataObj.append('pickup_contact_phone', formData.pickupContactPhone);
    formDataObj.append('pickup_notes', formData.pickupNotes);
    formDataObj.append('pickup_floor', formData.pickupFloor);
    formDataObj.append('pickup_elevator', formData.pickupElevator.toString());

    if (jobType !== 'gift') {
      formDataObj.append('delivery_contact_name', formData.deliveryContactName);
      formDataObj.append(
        'delivery_contact_phone',
        formData.deliveryContactPhone,
      );
      formDataObj.append('delivery_notes', formData.deliveryNotes);
      formDataObj.append('delivery_floor', formData.deliveryFloor);
      formDataObj.append(
        'delivery_elevator',
        formData.deliveryElevator.toString(),
      );
    }

    // Item details
    formDataObj.append('description', description);
    formDataObj.append('item_category', itemCategory || '');
    formDataObj.append('item_size', itemSize || '');
    formDataObj.append('item_weight', itemWeight || '');
    formDataObj.append('requires_help', requiresHelp.toString());

    // Photos (if any)
    formData.pickupPhotos.forEach((photoUri, index) => {
      formDataObj.append('pickup_photos', {
        uri: photoUri,
        type: 'image/jpeg',
        name: `photo_${index}.jpg`,
      } as any);
    });

    // Pricing
    formDataObj.append('payment_type', paymentType);
    formDataObj.append('customer_price', finalPrice.toString());
    formDataObj.append('platform_fee', finalPlatformFee.toFixed(2));
    formDataObj.append('driver_payout', finalDriverPayout.toFixed(2));

    // Scheduling
    if (scheduledPickup) {
      formDataObj.append('scheduled_pickup', scheduledPickup);
    }

    return formDataObj;
  };

  const handleContinue = async () => {
    // Update form data
    updateFormData({
      description,
      item_category: itemCategory,
      item_size: itemSize,
      item_weight: itemWeight,
      requires_help: requiresHelp,
      customer_price: customerPrice,
      scheduled_pickup: scheduledPickup,
      paymentType,
      platform_fee: finalPlatformFee,
      driver_payout: finalDriverPayout,
    });

    try {
      const formDataObj = buildFormData();
      const response = await createOrder.mutateAsync(formDataObj);

      if (response.data?.id) {
        resetForm();
        navigation.navigate('OrderSuccess', {
          jobId: response.data.id,
        });
      }
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  const isValid =
    jobType === 'gift' ||
    (customerPrice.trim().length > 0 &&
      parseFloat(customerPrice) > 0 &&
      !isNaN(parseFloat(customerPrice)));

  return (
    <View style={styles.container}>
      <Stepper currentStep={4} totalSteps={4} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Item Details</Text>
        <Text style={styles.headerKa}>ნივთის დეტალები</Text>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.sectionTitleKa}>აღწერა</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="e.g., 13 bags of construction waste. I think one person won't be enough"
            placeholderTextColor={Colors.text.light}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
          />
        </View>

        {/* Item Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category (Optional)</Text>
          <Text style={styles.sectionTitleKa}>კატეგორია</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}>
            {itemCategories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  itemCategory === category && styles.categoryChipSelected,
                ]}
                onPress={() => setItemCategory(category)}>
                <Text
                  style={[
                    styles.categoryChipText,
                    itemCategory === category &&
                      styles.categoryChipTextSelected,
                  ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Item Size */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Size (Optional)</Text>
          <View style={styles.optionsRow}>
            {sizeOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  itemSize === option && styles.optionButtonSelected,
                ]}
                onPress={() => setItemSize(option)}>
                <Text
                  style={[
                    styles.optionText,
                    itemSize === option && styles.optionTextSelected,
                  ]}>
                  {option.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Item Weight */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weight (Optional)</Text>
          <View style={styles.optionsRow}>
            {weightOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  itemWeight === option && styles.optionButtonSelected,
                ]}
                onPress={() => setItemWeight(option)}>
                <Text
                  style={[
                    styles.optionText,
                    itemWeight === option && styles.optionTextSelected,
                  ]}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Requires Help */}
        <View style={styles.section}>
          <View style={styles.switchRow}>
            <View style={styles.switchLabelContainer}>
              <Text style={styles.sectionTitle}>Need Help Loading</Text>
              <Text style={styles.sectionTitleKa}>
                დახმარება სჭირდება დატვირთვაში
              </Text>
            </View>
            <Switch
              value={requiresHelp}
              onValueChange={setRequiresHelp}
              trackColor={{ false: Colors.lightGray, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        {/* Pricing & Scheduling Section */}
        <View style={styles.pricingSection}>
          <Text style={styles.pricingSectionTitle}>Pricing & Scheduling</Text>

          {/* Your Price */}
          <View style={styles.priceInputContainer}>
            <Text style={styles.priceLabel}>Your Price *</Text>
            <Text style={styles.priceLabelKa}>თქვენი ფასი</Text>
            {jobType === 'gift' ? (
              <View style={styles.giftPriceContainer}>
                <Text style={styles.giftPriceText}>Free pickup, no charges</Text>
                <Text style={styles.giftPriceTextKa}>უფასო აღება</Text>
              </View>
            ) : (
              <Input
                placeholder="500"
                value={customerPrice}
                onChangeText={setCustomerPrice}
                keyboardType="decimal-pad"
                containerStyle={styles.priceInput}
              />
            )}
          </View>

          {/* Preferred Pickup Time */}
          <View style={styles.timeInputContainer}>
            <Text style={styles.priceLabel}>Preferred Pickup Time</Text>
            <Text style={styles.priceLabelKa}>სასურველი აღების დრო</Text>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => {
                // TODO: Implement datetime picker
                Alert.alert('Info', 'DateTime picker integration needed');
              }}>
              <Icon name="access-time" size={20} color={Colors.text.secondary} />
              <Text style={styles.timePickerText}>
                {scheduledPickup || 'Select date and time'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Price Breakdown */}
          {jobType !== 'gift' && priceValue > 0 && (
            <View style={styles.priceBreakdown}>
              <View style={styles.priceRow}>
                <Text style={styles.priceBreakdownLabel}>Customer Price:</Text>
                <Text style={styles.priceBreakdownValue}>
                  {finalPrice.toFixed(2)} GEL
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceBreakdownLabel}>Platform Fee:</Text>
                <Text style={styles.priceBreakdownValue}>
                  {finalPlatformFee.toFixed(2)} GEL
                  {paymentType === 'ONLINE_PAYMENT' && ' (15%)'}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceBreakdownLabel}>Driver Payout:</Text>
                <Text style={styles.priceBreakdownValue}>
                  {finalDriverPayout.toFixed(2)} GEL
                </Text>
              </View>
            </View>
          )}

          {/* Payment Type Selection */}
          {jobType !== 'gift' && (
            <View style={styles.paymentTypeContainer}>
              <Text style={styles.priceLabel}>Payment Type</Text>
              <View style={styles.paymentTypeRow}>
                <TouchableOpacity
                  style={[
                    styles.paymentTypeButton,
                    paymentType === 'CASH' && styles.paymentTypeButtonSelected,
                  ]}
                  onPress={() => setPaymentType('CASH')}>
                  <Icon
                    name="money"
                    size={24}
                    color={
                      paymentType === 'CASH' ? Colors.white : Colors.text.secondary
                    }
                  />
                  <Text
                    style={[
                      styles.paymentTypeText,
                      paymentType === 'CASH' &&
                        styles.paymentTypeTextSelected,
                    ]}>
                    Cash
                  </Text>
                  <Text style={styles.paymentTypeSubtext}>0% fee</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.paymentTypeButton,
                    paymentType === 'ONLINE_PAYMENT' &&
                      styles.paymentTypeButtonSelected,
                  ]}
                  onPress={() => setPaymentType('ONLINE_PAYMENT')}>
                  <Icon
                    name="credit-card"
                    size={24}
                    color={
                      paymentType === 'ONLINE_PAYMENT'
                        ? Colors.white
                        : Colors.text.secondary
                    }
                  />
                  <Text
                    style={[
                      styles.paymentTypeText,
                      paymentType === 'ONLINE_PAYMENT' &&
                        styles.paymentTypeTextSelected,
                    ]}>
                    Online
                  </Text>
                  <Text style={styles.paymentTypeSubtext}>15% fee</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Create Delivery"
          onPress={handleContinue}
          disabled={!isValid || createOrder.isPending}
          loading={createOrder.isPending}
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
  header: {
    ...Typography.h2,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  headerKa: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  sectionTitleKa: {
    ...Typography.small,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  descriptionInput: {
    ...Typography.body,
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: Spacing.md,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text.primary,
  },
  categoryScroll: {
    marginBottom: Spacing.sm,
  },
  categoryChip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
  },
  categoryChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  categoryChipTextSelected: {
    color: Colors.white,
    fontWeight: '600',
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabelContainer: {
    flex: 1,
  },
  pricingSection: {
    backgroundColor: Colors.warning, // #FEF3C7 as per spec
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  pricingSectionTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  priceInputContainer: {
    marginBottom: Spacing.md,
  },
  priceLabel: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  priceLabelKa: {
    ...Typography.small,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  priceInput: {
    marginBottom: 0,
  },
  giftPriceContainer: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: 8,
    alignItems: 'center',
  },
  giftPriceText: {
    ...Typography.bodyBold,
    color: Colors.primary,
  },
  giftPriceTextKa: {
    ...Typography.small,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  timeInputContainer: {
    marginBottom: Spacing.md,
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timePickerText: {
    ...Typography.body,
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
  },
  priceBreakdown: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  priceBreakdownLabel: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  priceBreakdownValue: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
  },
  paymentTypeContainer: {
    marginTop: Spacing.sm,
  },
  paymentTypeRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  paymentTypeButton: {
    flex: 1,
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  paymentTypeButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  paymentTypeText: {
    ...Typography.bodyBold,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
  },
  paymentTypeTextSelected: {
    color: Colors.white,
  },
  paymentTypeSubtext: {
    ...Typography.tiny,
    color: Colors.text.light,
    marginTop: Spacing.xs,
  },
  footer: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
