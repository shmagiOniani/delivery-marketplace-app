import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
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
import { useAuthStore } from '@/stores/useAuthStore';
import type { CustomerScreenProps } from '@/types/navigation';

const recyclingLocations = [
  {
    id: 'tbilisi-central',
    name: 'Tbilisi Central Recycling Center',
    nameKa: 'თბილისის ცენტრალური რეციკლირების ცენტრი',
    lat: 41.7151,
    lng: 44.8271,
  },
  {
    id: 'vake',
    name: 'Vake Recycling Point',
    nameKa: 'ვაკეს რეციკლირების პუნქტი',
    lat: 41.6971,
    lng: 44.7756,
  },
  {
    id: 'saburtalo',
    name: 'Saburtalo Recycling Facility',
    nameKa: 'საბურთალოს რეციკლირების ობიექტი',
    lat: 41.72,
    lng: 44.768,
  },
  {
    id: 'isani',
    name: 'Isani Waste Management Center',
    nameKa: 'ისანის ნაგავის მართვის ცენტრი',
    lat: 41.707,
    lng: 44.789,
  },
  {
    id: 'gldani',
    name: 'Gldani Recycling Station',
    nameKa: 'გლდანის რეციკლირების სადგური',
    lat: 41.76,
    lng: 44.82,
  },
];

export const NewOrderStep3Screen: React.FC<
  CustomerScreenProps<'NewOrderStep3'>
> = ({ navigation }) => {
  const { formData, updateFormData } = useOrderFormStore();
  const { user } = useAuthStore();
  const jobType = formData.jobType;

  // Skip this step for gift type
  useEffect(() => {
    if (jobType === 'gift') {
      navigation.navigate('NewOrderStep4');
    }
  }, [jobType, navigation]);

  const [deliveryAddress, setDeliveryAddress] = useState(
    formData.deliveryLocation?.address || '',
  );
  const [deliveryLat, setDeliveryLat] = useState(
    formData.deliveryLocation?.lat?.toString() || '',
  );
  const [deliveryLng, setDeliveryLng] = useState(
    formData.deliveryLocation?.lng?.toString() || '',
  );
  const [selectedRecyclingLocation, setSelectedRecyclingLocation] = useState(
    formData.selectedRecyclingLocation || '',
  );
  const [deliveryContactName, setDeliveryContactName] = useState(
    formData.deliveryContactName || user?.full_name || '',
  );
  const [deliveryContactPhone, setDeliveryContactPhone] = useState(
    formData.deliveryContactPhone || user?.phone || '',
  );
  const [deliveryNotes, setDeliveryNotes] = useState(
    formData.deliveryNotes || '',
  );
  const [deliveryFloor, setDeliveryFloor] = useState(
    formData.deliveryFloor || '',
  );
  const [deliveryElevator, setDeliveryElevator] = useState(
    formData.deliveryElevator || false,
  );

  const handleSelectRecyclingLocation = (locationId: string) => {
    const location = recyclingLocations.find((loc) => loc.id === locationId);
    if (location) {
      setSelectedRecyclingLocation(locationId);
      setDeliveryAddress(location.name);
      setDeliveryLat(location.lat.toString());
      setDeliveryLng(location.lng.toString());
    }
  };

  const handleContinue = () => {
    if (jobType === 'recycle') {
      if (selectedRecyclingLocation) {
        const location = recyclingLocations.find(
          (loc) => loc.id === selectedRecyclingLocation,
        );
        if (location) {
          updateFormData({
            deliveryLocation: {
              address: location.name,
              lat: location.lat,
              lng: location.lng,
            },
            selectedRecyclingLocation,
            deliveryContactName,
            deliveryContactPhone,
            deliveryNotes,
            deliveryFloor,
            deliveryElevator,
          });
          navigation.navigate('NewOrderStep4');
        }
      }
    } else if (jobType === 'move') {
      if (deliveryAddress && deliveryLat && deliveryLng) {
        updateFormData({
          deliveryLocation: {
            address: deliveryAddress,
            lat: parseFloat(deliveryLat),
            lng: parseFloat(deliveryLng),
          },
          deliveryContactName,
          deliveryContactPhone,
          deliveryNotes,
          deliveryFloor,
          deliveryElevator,
        });
        navigation.navigate('NewOrderStep4');
      }
    }
  };

  const isValid =
    jobType === 'recycle'
      ? selectedRecyclingLocation.length > 0
      : deliveryAddress.trim().length > 0 &&
        deliveryLat &&
        deliveryLng &&
        !isNaN(parseFloat(deliveryLat)) &&
        !isNaN(parseFloat(deliveryLng));

  if (jobType === 'gift') {
    return null; // This step is skipped for gift type
  }

  return (
    <View style={styles.container}>
      <Stepper currentStep={3} totalSteps={4} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Delivery Location</Text>
        <Text style={styles.headerKa}>მიწოდების ლოკაცია</Text>

        {jobType === 'recycle' ? (
          /* Recycling Location Selector */
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recycling Location *</Text>
            <Text style={styles.sectionTitleKa}>რეციკლირების ლოკაცია</Text>
            <View style={styles.recyclingLocationsList}>
              {recyclingLocations.map((location) => {
                const isSelected = selectedRecyclingLocation === location.id;
                return (
                  <TouchableOpacity
                    key={location.id}
                    style={[
                      styles.recyclingLocationCard,
                      isSelected && styles.recyclingLocationCardSelected,
                    ]}
                    onPress={() => handleSelectRecyclingLocation(location.id)}
                    activeOpacity={0.7}>
                    <Icon
                      name="location-on"
                      size={24}
                      color={isSelected ? Colors.primary : Colors.text.secondary}
                    />
                    <View style={styles.recyclingLocationInfo}>
                      <Text
                        style={[
                          styles.recyclingLocationName,
                          isSelected && styles.recyclingLocationNameSelected,
                        ]}>
                        {location.name}
                      </Text>
                      <Text style={styles.recyclingLocationNameKa}>
                        {location.nameKa}
                      </Text>
                    </View>
                    {isSelected && (
                      <Icon name="check-circle" size={24} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Read-only Map for selected recycling location */}
            {selectedRecyclingLocation && (
              <View style={styles.mapContainer}>
                <View style={styles.mapPlaceholder}>
                  <Icon name="map" size={48} color={Colors.text.light} />
                  <Text style={styles.mapPlaceholderText}>
                    {recyclingLocations.find(
                      (loc) => loc.id === selectedRecyclingLocation,
                    )?.name}
                  </Text>
                  <View style={styles.marker}>
                    <Icon name="place" size={24} color={Colors.primary} />
                  </View>
                </View>
              </View>
            )}
          </View>
        ) : (
          /* Move Type: Map Picker */
          <>
            <View style={styles.mapContainer}>
              <View style={styles.mapPlaceholder}>
                <Icon name="map" size={48} color={Colors.text.light} />
                <Text style={styles.mapPlaceholderText}>Map View</Text>
                {deliveryLat && deliveryLng && (
                  <View style={styles.marker}>
                    <Icon name="place" size={24} color={Colors.primary} />
                  </View>
                )}
              </View>
            </View>

            <View style={styles.section}>
              <Input
                label="Delivery Address *"
                icon="place"
                placeholder="Enter delivery address"
                value={deliveryAddress}
                onChangeText={setDeliveryAddress}
                containerStyle={styles.input}
              />
              <View style={styles.coordinatesRow}>
                <View style={styles.coordinateInput}>
                  <Input
                    label="Latitude"
                    placeholder="41.7200"
                    value={deliveryLat}
                    onChangeText={setDeliveryLat}
                    keyboardType="numeric"
                    containerStyle={styles.input}
                  />
                </View>
                <View style={styles.coordinateInput}>
                  <Input
                    label="Longitude"
                    placeholder="44.8300"
                    value={deliveryLng}
                    onChangeText={setDeliveryLng}
                    keyboardType="numeric"
                    containerStyle={styles.input}
                  />
                </View>
              </View>
            </View>
          </>
        )}

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.twoColumnGrid}>
            <View style={styles.gridItem}>
              <Input
                label="Contact Name"
                placeholder="Jane Doe"
                value={deliveryContactName}
                onChangeText={setDeliveryContactName}
                containerStyle={styles.input}
              />
            </View>
            <View style={styles.gridItem}>
              <Input
                label="Contact Phone"
                placeholder="+995 555 123 456"
                value={deliveryContactPhone}
                onChangeText={setDeliveryContactPhone}
                keyboardType="phone-pad"
                containerStyle={styles.input}
              />
            </View>
          </View>
        </View>

        {/* Delivery Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Special instructions for delivery"
            placeholderTextColor={Colors.text.light}
            value={deliveryNotes}
            onChangeText={setDeliveryNotes}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Floor & Elevator */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Floor & Elevator</Text>
          <View style={styles.twoColumnGrid}>
            <View style={styles.gridItem}>
              <Input
                label="Floor"
                placeholder="0"
                value={deliveryFloor}
                onChangeText={setDeliveryFloor}
                keyboardType="numeric"
                containerStyle={styles.input}
              />
            </View>
            <View style={[styles.gridItem, styles.elevatorContainer]}>
              <Text style={styles.elevatorLabel}>Has Elevator</Text>
              <Switch
                value={deliveryElevator}
                onValueChange={setDeliveryElevator}
                trackColor={{ false: Colors.lightGray, true: Colors.primary }}
                thumbColor={Colors.white}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Next →" onPress={handleContinue} disabled={!isValid} />
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
  mapContainer: {
    height: 300,
    marginBottom: Spacing.md,
    borderRadius: 12,
    overflow: 'hidden',
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
  marker: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    marginLeft: -12,
  },
  input: {
    marginBottom: Spacing.md,
  },
  coordinatesRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  coordinateInput: {
    flex: 1,
  },
  twoColumnGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  gridItem: {
    flex: 1,
  },
  elevatorContainer: {
    justifyContent: 'flex-end',
    paddingBottom: Spacing.sm,
  },
  elevatorLabel: {
    ...Typography.small,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  notesInput: {
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
  recyclingLocationsList: {
    gap: Spacing.sm,
  },
  recyclingLocationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  recyclingLocationCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.warning,
  },
  recyclingLocationInfo: {
    flex: 1,
  },
  recyclingLocationName: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  recyclingLocationNameSelected: {
    color: Colors.dark,
  },
  recyclingLocationNameKa: {
    ...Typography.small,
    color: Colors.text.secondary,
  },
  footer: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
