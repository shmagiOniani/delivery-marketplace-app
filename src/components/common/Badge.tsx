import React from 'react';
import {View, Text, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';

interface BadgeProps {
  label: string;
  color?: string;
  backgroundColor?: string;
  size?: 'small' | 'medium';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color = '#FFFFFF',
  backgroundColor,
  size = 'medium',
  style,
  textStyle,
}) => {
  const badgeStyle = [
    styles.badge,
    styles[`${size}Badge`],
    backgroundColor && {backgroundColor},
    style,
  ];

  const badgeTextStyle = [
    styles.text,
    styles[`${size}Text`],
    {color},
    textStyle,
  ];

  return (
    <View style={badgeStyle}>
      <Text style={badgeTextStyle}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallBadge: {
    height: 20,
    paddingHorizontal: spacing.xs,
  },
  mediumBadge: {
    height: 24,
    paddingHorizontal: spacing.sm,
  },
  text: {
    fontWeight: '600',
  },
  smallText: {
    ...typography.small,
  },
  mediumText: {
    ...typography.caption,
  },
});

