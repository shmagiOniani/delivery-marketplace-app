import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatDate, timeAgo } from '@/utils/dateFormatters';
import type { Job } from '@/types';

interface OrderCardProps {
  order: Job;
  onPress: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => {
  const firstImage = order.images && order.images.length > 0 ? order.images[0] : null;

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.content}>
        {firstImage && (
          <Image source={{ uri: firstImage }} style={styles.image} />
        )}
        <View style={styles.details}>
          <View style={styles.header}>
            <Text style={styles.orderId}>Order #{order.id.slice(0, 8)}</Text>
            <StatusBadge status={order.status} />
          </View>

          <View style={styles.route}>
            <View style={styles.routeItem}>
              <Icon name="radio-button-checked" size={16} color={Colors.success} />
              <Text style={styles.address} numberOfLines={1}>
                {order.pickup_address}
              </Text>
            </View>
            <View style={styles.routeItem}>
              <Icon name="place" size={16} color={Colors.error} />
              <Text style={styles.address} numberOfLines={1}>
                {order.delivery_address}
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{order.price.toFixed(2)} GEL</Text>
              {order.distance_km && (
                <Text style={styles.distance}>
                  {order.distance_km.toFixed(1)} km
                </Text>
              )}
            </View>
            <Text style={styles.time}>{timeAgo(order.created_at)}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  content: {
    flexDirection: 'row',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: Spacing.md,
  },
  details: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  orderId: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
  },
  route: {
    marginBottom: Spacing.sm,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  address: {
    ...Typography.small,
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    ...Typography.bodyBold,
    color: Colors.primary,
    marginRight: Spacing.sm,
  },
  distance: {
    ...Typography.tiny,
    color: Colors.text.light,
  },
  time: {
    ...Typography.tiny,
    color: Colors.text.light,
  },
});

