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

export const NewOrderStep2Screen: React.FC<
  CustomerScreenProps<'NewOrderStep2'>
> = ({ navigation }) => {
  const { formData, updateFormData } = useOrderFormStore();
  const [pickupAddress, setPickupAddress] = useState(
    formData.pickupAddress?.address || '',
  );
  const [deliveryAddress, setDeliveryAddress] = useState(
    formData.deliveryAddress?.address || '',
  );

  const handleContinue = () => {
    if (pickupAddress && deliveryAddress) {
      updateFormData({
        pickupAddress: {
          address: pickupAddress,
          name: '',
        },
        deliveryAddress: {
          address: deliveryAddress,
          name: '',
        },
        distance: 25, // Mock data
        timeEstimate: 2.1, // Mock data
      });
      navigation.navigate('NewOrderStep3');
    }
  };

  return (
    <View style={styles.container}>
      <Stepper currentStep={2} totalSteps={4} />

      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Icon name="map" size={48} color={Colors.text.light} />
          <Text style={styles.mapPlaceholderText}>Map View</Text>
          <View style={styles.pickupPin}>
            <Icon name="place" size={24} color={Colors.darkBlue} />
          </View>
          <View style={styles.deliveryPin}>
            <Icon name="place" size={24} color={Colors.primary} />
          </View>
          <View style={styles.routeLine} />
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Distance</Text>
            <Text style={styles.infoValue}>25 km</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Time estimate</Text>
            <Text style={styles.infoValue}>2.1 mins</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}>
          <Input
            label="Pickup address"
            icon="place"
            placeholder="Enter pickup address"
            value={pickupAddress}
            onChangeText={setPickupAddress}
            containerStyle={styles.input}
          />

          <Input
            label="Delivery address"
            icon="place"
            placeholder="Enter delivery address"
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
            containerStyle={styles.input}
          />

          <TouchableOpacity style={styles.currentLocationButton}>
            <Icon name="send" size={20} color={Colors.primary} />
            <Text style={styles.currentLocationText}>Current location</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Button
          title="შემდეგი →"
          onPress={handleContinue}
          disabled={!pickupAddress || !deliveryAddress}
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
  mapContainer: {
    height: 300,
    backgroundColor: Colors.background,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mapPlaceholderText: {
    ...Typography.body,
    color: Colors.text.light,
    marginTop: Spacing.sm,
  },
  pickupPin: {
    position: 'absolute',
    top: '30%',
    left: '25%',
  },
  deliveryPin: {
    position: 'absolute',
    bottom: '30%',
    right: '25%',
  },
  routeLine: {
    position: 'absolute',
    top: '35%',
    left: '28%',
    width: '45%',
    height: 2,
    backgroundColor: Colors.primary,
    transform: [{ rotate: '45deg' }],
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingTop: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  input: {
    marginBottom: Spacing.md,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: 12,
    marginTop: Spacing.sm,
  },
  currentLocationText: {
    ...Typography.body,
    color: Colors.primary,
    marginLeft: Spacing.sm,
  },
  footer: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
