import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  time: string;
}

interface Chat {
  id: string;
  title: string;
  property: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  messages: Message[];
}

const sampleChats: Chat[] = [
  {
    id: '1',
    title: 'Sarah Johnson',
    property: 'Modern Downtown Apartment',
    lastMessage: 'Is the apartment still available?',
    time: '2m ago',
    unread: 2,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b60ff6d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
    messages: [
      { id: '1', text: 'Hi! I\'m interested in your apartment listing.', sender: 'other', time: '10:30 AM' },
      { id: '2', text: 'Hello! Thank you for your interest. It\'s a great property.', sender: 'user', time: '10:35 AM' },
      { id: '3', text: 'Could you tell me more about the neighborhood?', sender: 'other', time: '10:40 AM' },
      { id: '4', text: 'Of course! It\'s in the heart of downtown with great restaurants and shops nearby.', sender: 'user', time: '10:45 AM' },
      { id: '5', text: 'That sounds perfect! When would be a good time to schedule a viewing?', sender: 'other', time: '10:50 AM' },
      { id: '6', text: 'Is the apartment still available?', sender: 'other', time: '11:20 AM' },
    ]
  },
  {
    id: '2',
    title: 'Mike Chen',
    property: 'Cozy Family House',
    lastMessage: 'Thanks for the quick response!',
    time: '1h ago',
    unread: 0,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    messages: [
      { id: '1', text: 'Hello, I saw your house listing. Is it pet-friendly?', sender: 'other', time: '9:15 AM' },
      { id: '2', text: 'Hi Mike! Yes, we allow pets with a small deposit.', sender: 'user', time: '9:20 AM' },
      { id: '3', text: 'Great! I have a golden retriever. What\'s the deposit amount?', sender: 'other', time: '9:25 AM' },
      { id: '4', text: 'The pet deposit is $200, which is refundable.', sender: 'user', time: '9:30 AM' },
      { id: '5', text: 'Thanks for the quick response!', sender: 'other', time: '9:35 AM' },
    ]
  },
];

export default function MessagesScreen() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [chats, setChats] = useState(sampleChats);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              messages: [...chat.messages, message],
              lastMessage: newMessage,
              time: 'now'
            }
          : chat
      )
    );

    // Update selected chat messages
    setSelectedChat(prev => prev ? {
      ...prev,
      messages: [...prev.messages, message]
    } : null);

    setNewMessage('');
  };

  const renderChatItem = (chat: Chat) => (
    <TouchableOpacity
      key={chat.id}
      style={styles.chatItem}
      onPress={() => setSelectedChat(chat)}
    >
      <Image source={{ uri: chat.avatar }} style={styles.avatar} />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatTitle}>{chat.title}</Text>
          <Text style={styles.chatTime}>{chat.time}</Text>
        </View>
        <Text style={styles.propertyName} numberOfLines={1}>{chat.property}</Text>
        <Text style={styles.lastMessage} numberOfLines={2}>{chat.lastMessage}</Text>
      </View>
      {chat.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{chat.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.sender === 'user' ? styles.userMessage : styles.otherMessage
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          message.sender === 'user' ? styles.userBubble : styles.otherBubble
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.sender === 'user' ? styles.userMessageText : styles.otherMessageText
          ]}
        >
          {message.text}
        </Text>
        <Text
          style={[
            styles.messageTime,
            message.sender === 'user' ? styles.userMessageTime : styles.otherMessageTime
          ]}
        >
          {message.time}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {/* Chat List */}
      <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
        {chats.map(renderChatItem)}
      </ScrollView>

      {/* Chat Modal */}
      <Modal visible={!!selectedChat} animationType="slide">
        <SafeAreaView style={styles.chatModal}>
          <KeyboardAvoidingView 
            style={styles.chatModal} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {/* Chat Header */}
            <View style={styles.chatModalHeader}>
              <TouchableOpacity onPress={() => setSelectedChat(null)}>
                <Ionicons name="chevron-back" size={24} color="#6B4EFF" />
              </TouchableOpacity>
              <View style={styles.chatModalHeaderContent}>
                <Image source={{ uri: selectedChat?.avatar }} style={styles.chatAvatar} />
                <View style={styles.chatModalHeaderText}>
                  <Text style={styles.chatModalTitle}>{selectedChat?.title}</Text>
                  <Text style={styles.chatModalSubtitle}>{selectedChat?.property}</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Ionicons name="call-outline" size={24} color="#6B4EFF" />
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <ScrollView 
              style={styles.messagesContainer}
              showsVerticalScrollIndicator={false}
              ref={(ref) => ref?.scrollToEnd({ animated: true })}
            >
              {selectedChat?.messages.map(renderMessage)}
            </ScrollView>

            {/* Message Input */}
            <View style={styles.messageInputContainer}>
              <View style={styles.messageInputWrapper}>
                <TextInput
                  style={styles.messageInput}
                  placeholder="Type a message..."
                  value={newMessage}
                  onChangeText={setNewMessage}
                  multiline
                />
                <TouchableOpacity 
                  style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
                  onPress={sendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Ionicons name="send" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  chatTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  propertyName: {
    fontSize: 12,
    color: '#6B4EFF',
    fontWeight: '500',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  unreadBadge: {
    backgroundColor: '#6B4EFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  chatModalHeaderContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  chatAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  chatModalHeaderText: {
    flex: 1,
  },
  chatModalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  chatModalSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#6B4EFF',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#111827',
  },
  messageTime: {
    fontSize: 11,
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  otherMessageTime: {
    color: '#9CA3AF',
  },
  messageInputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  messageInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 4,
    paddingVertical: 4,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 12,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#6B4EFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
});