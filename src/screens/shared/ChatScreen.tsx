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
import { io, Socket } from 'socket.io-client';
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

// Socket.IO server URL
const SOCKET_URL ='http://localhost:3001';

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
  const socketRef = useRef<Socket | null>(null);
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

  // Socket.IO connection with fallback to polling
  useEffect(() => {
    if (!user?.id) return;
    if (!jobId && !chatId) return;

    let pollingInterval: ReturnType<typeof setInterval>;

    const connectSocket = () => {
      console.log('Connecting to Socket.IO server:', SOCKET_URL);
      
      try {
        const socket = io(SOCKET_URL, {
          path: '/socket.io',
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: Infinity,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
          console.log('Socket.IO connected:', socket.id);
          setIsConnected(true);
          
          // Clear polling interval if it exists
          if (pollingInterval) {
            clearInterval(pollingInterval);
          }

          // Join user room
          socket.emit('join', user.id);
          console.log('Joined user room:', user.id);

          // Join job room if jobId exists
          if (jobId) {
            socket.emit('join-job', jobId);
            console.log('Joined job room:', jobId);
          }
        });

        socket.on('disconnect', (reason: string) => {
          console.log('Socket.IO disconnected:', reason);
          setIsConnected(false);
          
          // Start polling as fallback
          startPolling();
        });

        socket.on('connect_error', (error: Error) => {
          console.error('Socket.IO connection error:', error);
          setIsConnected(false);
          startPolling();
        });

        // Listen for new messages
        socket.on('new-message', (message: Message) => {
          console.log('New message received via Socket.IO:', message.id);
          refetch();
          
          // Mark as read if message is from other user
          if (message.sender_id !== user.id) {
            markAsRead.mutate({ jobId, chatId });
          }
        });

        // Health check response
        socket.on('pong', () => {
          console.log('Socket.IO pong received');
        });
      } catch (error) {
        console.error('Failed to create Socket.IO connection:', error);
        setIsConnected(false);
        startPolling();
      }
    };

    const startPolling = () => {
      // Poll every 3 seconds as fallback
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
      pollingInterval = setInterval(() => {
        if (!socketRef.current || !socketRef.current.connected) {
          refetch();
        }
      }, 3000);
    };

    // Connect to Socket.IO
    connectSocket();

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave-job', jobId);
        socketRef.current.disconnect();
        socketRef.current = null;
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

  // if (isLoading) {
  //   return <LoadingSpinner fullScreen />;
  // }

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
