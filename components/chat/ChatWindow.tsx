import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  ActivityIndicator, Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/lib/authContext';
import { getMessages, sendMessage, subscribeToMessages } from '@/actions/messages';
import { useTheme } from '@/lib/themeContext';
import type { Message } from '@/types';

interface Props {
  jobId: string;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function ChatWindow({ jobId }: Props) {
  const { user } = useAuth();
  const { colors: C, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [text,     setText]     = useState('');
  const [sending,  setSending]  = useState(false);
  const [kbVisible, setKbVisible] = useState(false);
  const listRef   = useRef<FlatList>(null);
  const sentIds   = useRef<Set<string>>(new Set()); 

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, () => setKbVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setKbVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

 useEffect(() => {
    let unsubFn: (() => void) | null = null;

    getMessages(jobId)
      .then((msgs) => {
        setMessages(msgs);
        msgs.forEach((m) => sentIds.current.add(m.id));
      })
      .catch(console.warn)
      .finally(() => setLoading(false));

    unsubFn = subscribeToMessages(jobId, (msg) => {
      if (sentIds.current.has(msg.id)) return;
      sentIds.current.add(msg.id);
      setMessages((prev) => [...prev, msg]);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    });

    return () => {
      if (unsubFn) unsubFn();
    };
  }, [jobId]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 150);
    }
  }, [messages.length]);

  async function handleSend() {
    if (!text.trim() || !user) return;
    const content = text.trim();
    setText('');
    setSending(true);
    try {
      const msg = await sendMessage(jobId, content);
      sentIds.current.add(msg.id);
      setMessages((prev) => [...prev, msg]);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (e) {
      console.warn(e);
      setText(content); 
    } finally {
      setSending(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[st.container, { backgroundColor: C.surface }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={[st.header, { borderBottomColor: C.divider }]}>
        <Ionicons name="chatbubbles-outline" size={18} color={C.text1} />
        <Text style={[st.headerTitle, { color: C.text1 }]}>Job Chat</Text>
      </View>

      {loading ? (
        <View style={st.center}>
          <ActivityIndicator color={C.blue600} />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={st.messageList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={st.emptyWrap}>
              <Ionicons name="chatbubble-ellipses-outline" size={36} color={C.text3} />
              <Text style={[st.emptyText, { color: C.text3 }]}>No messages yet.</Text>
            </View>
          }
          renderItem={({ item }) => {
            const isOwn = item.sender_id === user?.id;
            return (
              <View style={[st.msgRow, isOwn && st.msgRowOwn]}>
                {!isOwn && (
                  <View style={[st.avatar, { backgroundColor: isDark ? C.blue800 : C.blue50 }]}>
                    <Text style={[st.avatarText, { color: C.blue400 }]}>
                      {(item.profiles?.full_name ?? 'U').charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={[st.bubble, isOwn ? st.bubbleOwn : [st.bubbleOther, { backgroundColor: isDark ? C.surface2 : '#f1f5f9' }]]}>
                  {!isOwn && item.profiles?.full_name && (
                    <Text style={[st.senderName, { color: C.blue600 }]}>{item.profiles.full_name}</Text>
                  )}
                  <Text style={[st.msgText, isOwn ? { color: '#fff' } : { color: C.text1 }]}>{item.content}</Text>
                  <Text style={[st.msgTime, isOwn ? { color: 'rgba(255,255,255,0.65)' } : { color: C.text3 }]}>
                    {formatTime(item.created_at)}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      )}

      <View style={[st.inputRow, { paddingBottom: kbVisible ? 12 : Math.max(insets.bottom, 12) }]}>
        <View style={[st.inputContainer, { backgroundColor: isDark ? C.surface2 : '#f1f5f9' }]}>
          <TextInput
            style={[st.input, { color: C.text1 }]}
            placeholder="Type a message..."
            placeholderTextColor={C.text3}
            value={text}
            onChangeText={setText}
            multiline
            maxLength={500}
          />
        </View>
        <TouchableOpacity
          style={[st.sendBtnWrapper, (!text.trim() || sending) && st.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!text.trim() || sending}
        >
          <LinearGradient
            colors={['#0ea5e9', '#0284c7']}
            style={st.sendBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {sending
              ? <ActivityIndicator size="small" color="#fff" />
              : <Ionicons name="send" size={15} color="#fff" style={{ marginLeft: 2 }} />
            }
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, borderRadius: 24, overflow: 'hidden' },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    padding: 16, borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 14, fontWeight: '700' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  messageList: { padding: 16, gap: 12, flexGrow: 1 },

  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingTop: 40 },
  emptyText: { fontSize: 12, textAlign: 'center' },

  msgRow:    { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgRowOwn: { flexDirection: 'row-reverse' },

  avatar: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 11, fontWeight: '700' },

  bubble: {
    maxWidth: '75%',
    borderRadius: 16, borderBottomLeftRadius: 4,
    padding: 12, gap: 4,
  },
  bubbleOwn: {
    backgroundColor: '#0ea5e9',
    borderBottomLeftRadius: 16, borderBottomRightRadius: 4,
  },
  bubbleOther: {
  },
  senderName: { fontSize: 11, fontWeight: '700', marginBottom: 2 },
  msgText:    { fontSize: 14, lineHeight: 20 },
  msgTime:    { fontSize: 10, alignSelf: 'flex-end', marginTop: 2 },

  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    padding: 16,
  },
  inputContainer: {
    flex: 1,
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 40,
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 12,
    maxHeight: 100,
  },
  sendBtnWrapper: {
    width: 40, height: 40, borderRadius: 16,
    overflow: 'hidden'
  },
  sendBtn: {
    width: '100%', height: '100%',
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.4 },
});
