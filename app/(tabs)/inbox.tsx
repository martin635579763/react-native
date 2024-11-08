import { View, FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// You can move this to a separate types file later
interface Message {
  id: string;
  sender: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

// Dummy data for testing
const DUMMY_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'John Doe',
    lastMessage: 'Hey, is the villa still available for next week?',
    timestamp: '2h ago',
    unread: true,
  },
  {
    id: '2',
    sender: 'Sarah Smith',
    lastMessage: 'Thanks for your response! I\'ll check the dates.',
    timestamp: '5h ago',
    unread: false,
  },
  // Add more dummy messages as needed
];

const MessageItem = ({ message }: { message: Message }) => (
  <View style={styles.messageItem}>
    <View style={styles.avatarContainer}>
      <Ionicons name="person-circle-outline" size={50} color="#666" />
    </View>
    <View style={styles.messageContent}>
      <View style={styles.messageHeader}>
        <Text style={[styles.senderName, message.unread && styles.unread]}>
          {message.sender}
        </Text>
        <Text style={styles.timestamp}>{message.timestamp}</Text>
      </View>
      <Text style={[styles.lastMessage, message.unread && styles.unread]} numberOfLines={2}>
        {message.lastMessage}
      </Text>
    </View>
  </View>
);

export default function InboxScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      
      {DUMMY_MESSAGES.length > 0 ? (
        <FlatList
          data={DUMMY_MESSAGES}
          renderItem={({ item }) => <MessageItem message={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubble-outline" size={50} color="#666" />
          <Text style={styles.emptyStateText}>No messages yet</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  messageItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 16,
    color: '#000',
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  unread: {
    fontWeight: 'bold',
    color: '#000',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
}); 