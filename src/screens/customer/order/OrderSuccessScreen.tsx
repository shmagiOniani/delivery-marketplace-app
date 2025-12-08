import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { CustomerScreenProps } from '@/types/navigation';
import { useJobsQuery } from '@/hooks/queries/useJobsQuery';

export const OrderSuccessScreen: React.FC<
  CustomerScreenProps<'OrderSuccess'>
> = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { jobId } = route.params as { jobId: string };
  const { data: jobsData, isLoading } = useJobsQuery({});
  const order = jobsData?.data?.find((job) => job.id === jobId);

  if (isLoading || !order) {
    return <LoadingSpinner fullScreen />;
  }

  const pickupCoordinates = {
    latitude: order.pickup_lat,
    longitude: order.pickup_lng,
  };

  const deliveryCoordinates = {
    latitude: order.delivery_lat,
    longitude: order.delivery_lng,
  };

  const centerLat = (pickupCoordinates.latitude + deliveryCoordinates.latitude) / 2;
  const centerLng = (pickupCoordinates.longitude + deliveryCoordinates.longitude) / 2;

  const routeCoordinates = [
    pickupCoordinates,
    {
      latitude: centerLat,
      longitude: centerLng,
    },
    deliveryCoordinates,
  ];

  const handleTrackOrder = () => {
    navigation.navigate('Customer', {
      screen: 'OrderTracking',
      params: { jobId },
    } as any);
  };

  const handleGoHome = () => {
    navigation.navigate('Customer', {
      screen: 'CustomerTabs',
      params: { screen: 'Home' },
    } as any);
  };

  const handleShare = (platform: string) => {
    // Handle share functionality
    console.log(`Sharing to ${platform}`);
  };

  const socialPlatforms = [
    { name: 'Facebook', icon: 'facebook' },
    { name: 'Twitter', icon: 'alternate-email' },
    { name: 'X', icon: 'close' },
    { name: 'YouTube', icon: 'play-circle-filled' },
    { name: 'Telegram', icon: 'send' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Success Icon */}
      <View style={styles.successIconContainer}>
        <View style={styles.successCircle}>
          <Icon name="check" size={48} color={Colors.white} />
        </View>
        <Text style={styles.successTitle}>Order Successful</Text>
      </View>

      {/* Order Confirmation Card */}
      <View style={styles.card}>
        <Text style={styles.orderId}>
          Order #{order.id.slice(-4).toUpperCase()}
        </Text>

        {/* Mini Map */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: centerLat,
              longitude: centerLng,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Polyline
              coordinates={routeCoordinates}
              strokeColor={Colors.primary}
              strokeWidth={3}
              lineDashPattern={[5, 5]}
            />
            <Marker coordinate={pickupCoordinates}>
              <View style={styles.pickupMarker}>
                <Icon name="radio-button-checked" size={16} color={Colors.primary} />
              </View>
            </Marker>
            <Marker coordinate={deliveryCoordinates}>
              <View style={styles.deliveryMarker}>
                <Icon name="place" size={16} color={Colors.warning} />
              </View>
            </Marker>
            <Marker
              coordinate={{
                latitude: centerLat,
                longitude: centerLng,
              }}
            >
              <View style={styles.carMarker}>
                <Icon name="directions-car" size={16} color={Colors.primary} />
              </View>
            </Marker>
          </MapView>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title="Track Order"
            onPress={handleTrackOrder}
            style={styles.trackButton}
          />
          <TouchableOpacity
            style={styles.homeButton}
            onPress={handleGoHome}
            activeOpacity={0.7}
          >
            <Text style={styles.homeButtonText}>Home</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Share Options */}
      <View style={styles.shareSection}>
        <Text style={styles.shareTitle}>Share on 7 platforms</Text>
        <View style={styles.shareIcons}>
          {socialPlatforms.map((platform, index) => (
            <TouchableOpacity
              key={index}
              style={styles.shareIcon}
              onPress={() => handleShare(platform.name)}
              activeOpacity={0.7}
            >
              <Icon name={platform.icon as any} size={24} color={Colors.text.secondary} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  successTitle: {
    ...Typography.h2,
    color: Colors.text.primary,
    fontWeight: '700',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: Spacing.xl,
  },
  orderId: {
    ...Typography.h3,
    color: Colors.text.primary,
    fontWeight: '700',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  pickupMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  carMarker: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 2,
  },
  actionsContainer: {
    gap: Spacing.md,
  },
  trackButton: {
    backgroundColor: Colors.primary,
  },
  homeButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButtonText: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
  },
  shareSection: {
    width: '100%',
    alignItems: 'center',
  },
  shareTitle: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  shareIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    flexWrap: 'wrap',
  },
  shareIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
