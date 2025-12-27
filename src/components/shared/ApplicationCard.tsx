import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface Application {
  id: string;
  job_id: string;
  driver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string | null;
  driver_price?: number | null;
  proposed_pickup_date?: string | null;
  applied_at: string;
  driver: {
    id: string;
    full_name: string;
    rating: number;
    avatar_url?: string | null;
    phone?: string | null;
    driver_profile?: {
      vehicle_type?: string | null;
      is_verified: boolean;
    } | null;
  };
}

interface ApplicationCardProps {
  application: Application;
  onSelect?: (applicationId: string) => void;
  isSelecting?: boolean;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onSelect,
  isSelecting,
}) => {
  const navigation = useNavigation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleViewProfile = () => {
    // Navigate to driver profile
    // @ts-ignore - Navigation types may need to be extended
    navigation.navigate('DriverProfile', { driverId: application.driver_id });
  };

  const handleSelect = () => {
    if (onSelect) {
      Alert.alert(
        'Select Driver',
        `Are you sure you want to select ${application.driver.full_name} for this delivery?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Select',
            onPress: () => onSelect(application.id),
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.driverInfo}>
          {application.driver.avatar_url ? (
            <Image
              source={{ uri: application.driver.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Icon name="person" size={24} color={Colors.text.light} />
            </View>
          )}
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>{application.driver.full_name}</Text>
            <View style={styles.ratingRow}>
              <Icon name="star" size={16} color="#FCD34D" />
              <Text style={styles.rating}>
                {application.driver.rating.toFixed(1)}
              </Text>
              {application.driver.driver_profile?.is_verified && (
                <>
                  <Icon name="verified" size={16} color={Colors.primary} />
                  <Text style={styles.verifiedText}>Verified</Text>
                </>
              )}
            </View>
          </View>
        </View>
        {application.status !== 'pending' && (
          <StatusBadge status={application.status} />
        )}
      </View>

      {application.driver.driver_profile?.vehicle_type && (
        <View style={styles.infoRow}>
          <Icon name="directions-car" size={16} color={Colors.text.secondary} />
          <Text style={styles.infoText}>
            {application.driver.driver_profile.vehicle_type}
          </Text>
        </View>
      )}

      <View style={styles.infoRow}>
        <Icon name="schedule" size={16} color={Colors.text.secondary} />
        <Text style={styles.infoText}>Applied {formatDate(application.applied_at)}</Text>
      </View>

      {application.driver_price && (
        <View style={styles.priceRow}>
          <Icon name="attach-money" size={16} color={Colors.primary} />
          <Text style={styles.priceText}>₾{application.driver_price.toFixed(2)}</Text>
        </View>
      )}

      {application.proposed_pickup_date && (
        <View style={styles.infoRow}>
          <Icon name="event" size={16} color={Colors.text.secondary} />
          <Text style={styles.infoText}>
            Proposed pickup: {formatDate(application.proposed_pickup_date)}
          </Text>
        </View>
      )}

      {application.message && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageLabel}>Message:</Text>
          <Text style={styles.messageText}>{application.message}</Text>
        </View>
      )}

      {application.driver.phone && (
        <View style={styles.infoRow}>
          <Icon name="phone" size={16} color={Colors.text.secondary} />
          <Text style={styles.infoText}>{application.driver.phone}</Text>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity onPress={handleViewProfile} style={styles.viewProfileButton}>
          <Text style={styles.viewProfileText}>View Profile</Text>
        </TouchableOpacity>
        {application.status === 'pending' && onSelect && (
          <Button
            title={isSelecting ? 'Selecting...' : 'Select'}
            onPress={handleSelect}
            disabled={isSelecting}
            style={styles.selectButton}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: Spacing.sm,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    ...Typography.small,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  verifiedText: {
    ...Typography.small,
    color: Colors.primary,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  infoText: {
    ...Typography.small,
    color: Colors.text.secondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  priceText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '700',
  },
  messageContainer: {
    backgroundColor: Colors.background,
    padding: Spacing.sm,
    borderRadius: 8,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  messageLabel: {
    ...Typography.small,
    color: Colors.text.secondary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  messageText: {
    ...Typography.small,
    color: Colors.text.primary,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  viewProfileButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewProfileText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  selectButton: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
});

