import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { EmptyState } from '@/components/ui/EmptyState';
import type { CustomerTabScreenProps } from '@/types/navigation';

export const MessagesListScreen: React.FC<
  CustomerTabScreenProps<'Messages'>
> = () => {
  const navigation = useNavigation();

  // Mock messages/conversations - replace with actual API call
  const conversations: any[] = [];

  const handleConversationPress = (jobId: string) => {
    navigation.navigate('Customer', {
      screen: 'Chat',
      params: { jobId },
    } as any);
  };

  return (
    <View style={styles.container}>
      {conversations.length === 0 ? (
        <EmptyState
          title="No Messages"
          message="You don't have any conversations yet"
          icon="message"
        />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.conversationItem}
              onPress={() => handleConversationPress(item.jobId)}
            >
              <View style={styles.avatar}>
                <Icon name="person" size={24} color={Colors.white} />
              </View>
              <View style={styles.conversationContent}>
                <Text style={styles.conversationName}>{item.name}</Text>
                <Text style={styles.conversationPreview} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
              </View>
              <Text style={styles.conversationTime}>{item.time}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  conversationContent: {
    flex: 1,
  },
  conversationName: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  conversationPreview: {
    ...Typography.small,
    color: Colors.text.secondary,
  },
  conversationTime: {
    ...Typography.tiny,
    color: Colors.text.light,
  },
});

