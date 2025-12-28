import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { MessageBubble } from '@/components/shared/MessageBubble';
import { MessageInput } from '@/components/shared/MessageInput';
import { useMessagesQuery } from '@/hooks/queries/useMessagesQuery';
import { useMessageMutations } from '@/hooks/mutations/useMessageMutations';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Message } from '@/types';
import type { CustomerScreenProps } from '@/types/navigation';

// WebSocket URL - adjust based on your environment
const WS_URL = __DEV__
  ? 'ws://localhost:3001'
  : 'wss://your-domain.com';

export const ChatScreen: React.FC<CustomerScreenProps<'Chat'>> = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { jobId, chatId, driverId, customerId } = route.params as {
    jobId?: string;
    chatId?: string;
    driverId?: string;
    customerId?: string;
  };

  const { user } = useAuthStore();
  const flatListRef = useRef<FlatList>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const {
    data: messages = [],
    isLoading,
    refetch,
  } = useMessagesQuery({ jobId, chatId });

  const { sendMessage, markAsRead } = useMessageMutations();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  // Mark messages as read when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (jobId || chatId) {
        markAsRead.mutate({ jobId, chatId });
      }
    }, [jobId, chatId])
  );

  // WebSocket connection with fallback to polling
  useEffect(() => {
    if (!jobId && !chatId) return;

    let pollingInterval: ReturnType<typeof setInterval>;

    const connectWebSocket = () => {
      try {
        const wsUrl = jobId
          ? `${WS_URL}/messages?jobId=${jobId}&token=${user?.id}`
          : `${WS_URL}/chats/${chatId}/messages?token=${user?.id}`;

        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('WebSocket connected');
          setIsConnected(true);
          // Clear polling interval if it exists
          if (pollingInterval) {
            clearInterval(pollingInterval);
          }
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'new_message') {
              console.log('New message received via WebSocket');
              refetch();
              
              // Mark as read if message is from other user
              if (data.message?.sender_id !== user?.id) {
                markAsRead.mutate({ jobId, chatId });
              }
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
        };

        ws.onclose = () => {
          console.log('WebSocket disconnected');
          setIsConnected(false);
          wsRef.current = null;
          
          // Attempt to reconnect after 5 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Attempting to reconnect WebSocket...');
            connectWebSocket();
          }, 5000);

          // Start polling as fallback
          startPolling();
        };
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
        setIsConnected(false);
        // Fall back to polling
        startPolling();
      }
    };

    const startPolling = () => {
      // Poll every 3 seconds as fallback
      pollingInterval = setInterval(() => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          refetch();
        }
      }, 3000);
    };

    // Try to connect via WebSocket
    connectWebSocket();

    // Cleanup
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [jobId, chatId, user?.id]);

  const handleSend = async (content: string) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to send messages');
      return;
    }

    try {
      await sendMessage.mutateAsync({ jobId, chatId, content });
      // Message will appear via real-time update or refetch
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isOwn = item.sender_id === user?.id;
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const showAvatar =
      !previousMessage || previousMessage.sender_id !== item.sender_id;

    return (
      <MessageBubble message={item} isOwn={isOwn} showAvatar={showAvatar} />
    );
  };

  const renderEmptyState = () => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <EmptyState
          icon="chat-bubble-outline"
          title="No messages yet"
          message="Start the conversation by sending a message"
        />
      </View>
    );
  };

  const renderHeader = () => {
    if (messages.length === 0) return null;

    return (
      <View style={styles.headerSpacer}>
        <Text style={styles.headerText}>
          {new Date(messages[0]?.created_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!jobId && !chatId) {
    return (
      <View style={styles.errorContainer}>
        <EmptyState
          icon="error-outline"
          title="Invalid Chat"
          message="No job or chat ID provided"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Connection status indicator */}
      {!isConnected && (
        <View style={styles.connectionStatus}>
          <Text style={styles.connectionText}>
            Using polling mode (WebSocket unavailable)
          </Text>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.messagesList,
          messages.length === 0 && styles.emptyList,
        ]}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
        onContentSizeChange={() => {
          if (messages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: false });
          }
        }}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
      />

      <MessageInput
        onSend={handleSend}
        isSending={sendMessage.isPending}
        placeholder="Type a message..."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  connectionStatus: {
    backgroundColor: Colors.orange,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  connectionText: {
    ...Typography.tiny,
    color: Colors.white,
    fontWeight: '600',
  },
  messagesList: {
    paddingVertical: Spacing.md,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.xl,
  },
  headerSpacer: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  headerText: {
    ...Typography.small,
    color: Colors.text.light,
    fontWeight: '600',
  },
});
