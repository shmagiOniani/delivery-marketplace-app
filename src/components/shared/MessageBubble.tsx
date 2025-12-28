import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import type { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  showAvatar = true,
}) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const getAvatarUri = () => {
    if (message.sender?.avatar_url) {
      return message.sender.avatar_url;
    }
    return null;
  };

  const getInitials = () => {
    if (message.sender?.full_name) {
      return message.sender.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return '?';
  };

  const avatarUri = getAvatarUri();

  return (
    <View style={[styles.container, isOwn ? styles.ownContainer : styles.otherContainer]}>
      {!isOwn && showAvatar && (
        <View style={styles.avatarContainer}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>{getInitials()}</Text>
            </View>
          )}
        </View>
      )}

      <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
        {!isOwn && message.sender?.full_name && (
          <Text style={styles.senderName}>{message.sender.full_name}</Text>
        )}
        <Text style={[styles.messageText, isOwn ? styles.ownText : styles.otherText]}>
          {message.content}
        </Text>
        <View style={styles.footer}>
          <Text style={[styles.timestamp, isOwn && styles.ownTimestamp]}>
            {formatTime(message.created_at)}
          </Text>
          {isOwn && (
            <Text style={styles.readReceipt}>{message.read ? '✓✓' : '✓'}</Text>
          )}
        </View>
      </View>

      {isOwn && showAvatar && <View style={styles.avatarSpacer} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  ownContainer: {
    justifyContent: 'flex-end',
  },
  otherContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginRight: Spacing.xs,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...Typography.small,
    color: Colors.white,
    fontWeight: '600',
  },
  avatarSpacer: {
    width: 32,
    marginLeft: Spacing.xs,
  },
  bubble: {
    maxWidth: '70%',
    borderRadius: 16,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  ownBubble: {
    backgroundColor: '#1E293B',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#F1F5F9',
    borderBottomLeftRadius: 4,
  },
  senderName: {
    ...Typography.small,
    color: Colors.text.secondary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  messageText: {
    ...Typography.body,
    lineHeight: 20,
  },
  ownText: {
    color: Colors.white,
  },
  otherText: {
    color: '#0F172A',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: Spacing.xs,
  },
  timestamp: {
    ...Typography.tiny,
    color: '#94A3B8',
  },
  ownTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  readReceipt: {
    ...Typography.tiny,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
});

