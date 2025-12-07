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
  const firstImage =
    order.pickup_photos && order.pickup_photos.length > 0
      ? order.pickup_photos[0]
      : order.delivery_photos && order.delivery_photos.length > 0
      ? order.delivery_photos[0]
      : null;

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.content}>
        {firstImage && (
          <Image source={{ uri: firstImage }} style={styles.image} />
        )}
        <View style={styles.details}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {order.title}
              </Text>
              <Text style={styles.orderId}>#{order.id.slice(0, 8)}</Text>
            </View>
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
              <Text style={styles.price}>
                {order.customer_price.toFixed(2)} GEL
              </Text>
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
  titleContainer: {
    flex: 1,
    marginRight: Spacing.xs,
  },
  title: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  orderId: {
    ...Typography.tiny,
    color: Colors.text.light,
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

