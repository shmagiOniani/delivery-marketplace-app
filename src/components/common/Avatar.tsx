import React from 'react';
import {View, Image, Text, StyleSheet, ViewStyle} from 'react-native';
import {typography} from '../../theme/typography';
import {colors} from '../../theme/colors';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 40,
  style,
}) => {
  const getInitials = (fullName: string): string => {
    const names = fullName.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const avatarStyle = [
    styles.avatar,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
    },
    style,
  ];

  const textStyle = {
    fontSize: size * 0.4,
    fontWeight: '600' as const,
  };

  if (uri) {
    return (
      <Image
        source={{uri}}
        style={avatarStyle}
      />
    );
  }

  return (
    <View style={[avatarStyle, styles.placeholder]}>
      {name && (
        <Text style={[styles.initials, textStyle]}>{getInitials(name)}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  placeholder: {
    backgroundColor: colors.primary,
  },
  initials: {
    color: '#FFFFFF',
  },
});

