import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigation } from '@react-navigation/native';

export const ProfileScreen = () => {
  const { user, logout } = useAuthStore();
  const navigation = useNavigation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ],
    );
  };

  const menuItems = [
    {
      icon: 'person',
      label: 'Edit Profile',
      onPress: () => {
        // Navigate to edit profile screen
      },
    },
    {
      icon: 'settings',
      label: 'Settings',
      onPress: () => {
        // Navigate to settings screen
      },
    },
    {
      icon: 'help',
      label: 'Help & Support',
      onPress: () => {
        // Navigate to help screen
      },
    },
    {
      icon: 'info',
      label: 'About',
      onPress: () => {
        // Navigate to about screen
      },
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {user?.avatar_url ? (
              <Image
                source={{ uri: user.avatar_url }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="person" size={48} color={Colors.white} />
              </View>
            )}
          </View>
          <Text style={styles.name}>
            {user?.full_name || user?.email || 'User'}
          </Text>
          {user?.email && (
            <Text style={styles.email}>{user.email}</Text>
          )}
          {user?.phone && (
            <Text style={styles.phone}>{user.phone}</Text>
          )}
          {user?.rating && (
            <View style={styles.ratingContainer}>
              <Icon name="star" size={20} color={Colors.primary} />
              <Text style={styles.rating}>{user.rating.toFixed(1)}</Text>
            </View>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Icon name={item.icon} size={24} color={Colors.primary} />
                </View>
                <Text style={styles.menuItemLabel}>{item.label}</Text>
              </View>
              <Icon
                name="chevron-right"
                size={24}
                color={Colors.text.light}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Button
            title="Logout"
            onPress={handleLogout}
            loading={isLoggingOut}
            variant="secondary"
            icon={
              <Icon
                name="logout"
                size={20}
                color={Colors.error}
                style={{ marginRight: Spacing.xs }}
              />
            }
            style={[styles.logoutButton, { borderColor: Colors.error }]}
          />
        </View>

        {/* App Version */}
        <Text style={styles.version}>Version 0.0.1</Text>
      </ScrollView>
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
    paddingBottom: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.white,
  },
  avatarContainer: {
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  name: {
    ...Typography.h2,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  email: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  phone: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  rating: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
    marginLeft: Spacing.xs,
  },
  menuSection: {
    backgroundColor: Colors.white,
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  menuItemLabel: {
    ...Typography.body,
    color: Colors.text.primary,
  },
  logoutSection: {
    padding: Spacing.md,
    marginTop: Spacing.lg,
  },
  logoutButton: {
    borderColor: Colors.error,
  },
  logoutButtonText: {
    color: Colors.error,
  },
  version: {
    ...Typography.tiny,
    color: Colors.text.light,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});
