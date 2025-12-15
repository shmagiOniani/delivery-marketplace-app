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
import { useOrderFormStore } from '@/stores/useOrderFormStore';
import type { CustomerScreenProps } from '@/types/navigation';

export const NewOrderStep4Screen: React.FC<
  CustomerScreenProps<'NewOrderStep4'>
> = ({ navigation }) => {
  const { formData, updateFormData } = useOrderFormStore();
  const [pickupName, setPickupName] = useState(
    formData.pickupAddress?.name || '',
  );
  const [pickupFloor, setPickupFloor] = useState(
    formData.pickupAddress?.floor || '',
  );
  const [deliveryName, setDeliveryName] = useState(
    formData.deliveryAddress?.name || '',
  );
  const [deliveryFloor, setDeliveryFloor] = useState(
    formData.deliveryAddress?.floor || '',
  );
  const [timePreference, setTimePreference] = useState<
    'flexible' | 'specific'
  >(formData.timePreference || 'flexible');

  const price = 60.0;
  const serviceFee = 10.0;
  const total = price + serviceFee;

  const handleContinue = () => {
    updateFormData({
      pickupAddress: {
        ...formData.pickupAddress!,
        name: pickupName,
        floor: pickupFloor,
      },
      deliveryAddress: {
        ...formData.deliveryAddress!,
        name: deliveryName,
        floor: deliveryFloor,
      },
      price,
      serviceFee,
      timePreference,
    });
    // Navigate to success screen
    navigation.navigate('OrderSuccess', {
      jobId: `ORD-${Math.floor(Math.random() * 10000)}`,
    });
  };

  return (
    <View style={styles.container}>
      <Stepper currentStep={4} totalSteps={4} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Distance</Text>
            <Text style={styles.infoValue}>
              {formData.distance || 27} km
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Time estimate</Text>
            <Text style={styles.infoValue}>
              {formData.timeEstimate || 12.8} min
            </Text>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery contact</Text>
          <Input
            placeholder="Name"
            value={deliveryName}
            onChangeText={setDeliveryName}
            containerStyle={styles.input}
          />
          <Input
            placeholder="Floor"
            value={deliveryFloor}
            onChangeText={setDeliveryFloor}
            containerStyle={styles.input}
          />
        </View>

        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.priceValue}>${price.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service</Text>
            <Text style={styles.priceValue}>${serviceFee.toFixed(2)}</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time picker</Text>
          <View style={styles.timePickerRow}>
            <TouchableOpacity
              style={[
                styles.timeOption,
                timePreference === 'flexible' && styles.timeOptionSelected,
              ]}
              onPress={() => setTimePreference('flexible')}>
              <Text
                style={[
                  styles.timeOptionText,
                  timePreference === 'flexible' &&
                    styles.timeOptionTextSelected,
                ]}>
                Flexible
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.timeOption,
                timePreference === 'specific' && styles.timeOptionSelected,
              ]}
              onPress={() => setTimePreference('specific')}>
              <Text
                style={[
                  styles.timeOptionText,
                  timePreference === 'specific' &&
                    styles.timeOptionTextSelected,
                ]}>
                Specific
              </Text>
            </TouchableOpacity>
          </View>
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    ...Typography.small,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  infoValue: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  input: {
    marginBottom: Spacing.md,
  },
  priceSection: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  priceLabel: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  priceValue: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
  },
  totalRow: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalLabel: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
    fontSize: 18,
  },
  totalValue: {
    ...Typography.h3,
    color: Colors.primary,
  },
  timePickerRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  timeOption: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  timeOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeOptionText: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  timeOptionTextSelected: {
    color: Colors.white,
    fontWeight: '600',
  },
  footer: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
