import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Text } from 'react-native';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { GiftedChat, InputToolbar, Bubble } from 'react-native-gifted-chat';
import { useRoute, useIsFocused } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const route = useRoute();
  const { data, id } = route.params;
  const isDeleting = useRef(false); // Prevent concurrent deletions
  const isMounted = useRef(true); // Track component mount state
  const deleteTimeout = useRef(null); // Debounce deletion
  const isFocused = useIsFocused(); // Check if screen is focused
  const chatId = [id, data.userId].sort().join('_');

  useEffect(() => {
    console.log('Chat component mounted, chatId:', chatId);
    isMounted.current = true;

    const unsubscribe = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        async (querySnapshot) => {
          if (!isMounted.current || !isFocused) {
            console.log('Skipping onSnapshot update: component unmounted or not focused');
            return;
          }

          const messagesFirestore = querySnapshot.docs.map((doc) => {
            const messageData = doc.data();
            return {
              _id: doc.id,
              text: messageData.text || '',
              image: messageData.image || null,
              createdAt: messageData.createdAt?.toDate() || new Date(),
              user: {
                _id: messageData.sendBy,
                name: messageData.sendBy === id ? 'You' : data.Name,
                avatar: messageData.sendBy === id ? null : data.ProfilePicture || 'https://placeimg.com/140/140/any',
              },
            };
          });

          console.log('Fetched messages:', messagesFirestore.length, 'Messages:', messagesFirestore.map(m => m.text));

          // Update state
          setMessages(messagesFirestore);

          // Delete oldest messages if count >= 4
          if (messagesFirestore.length >= 4 && !isDeleting.current && isMounted.current && isFocused) {
            console.log('Triggering deleteOldestMessages, message count:', messagesFirestore.length);
            if (deleteTimeout.current) clearTimeout(deleteTimeout.current);
            deleteTimeout.current = setTimeout(async () => {
              if (!isMounted.current || !isFocused || isDeleting.current) return;
              isDeleting.current = true;

              try {
                const messagesRef = firestore()
                  .collection('chats')
                  .doc(chatId)
                  .collection('messages')
                  .orderBy('createdAt', 'asc') // Oldest first
                  .limit(messagesFirestore.length - 2); // Keep latest 2

                const snapshot = await messagesRef.get();
                console.log('Messages to delete:', snapshot.docs.length, 'Message IDs:', snapshot.docs.map(doc => doc.id));

                if (!snapshot.empty) {
                  const batch = firestore().batch();
                  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
                  await batch.commit();
                  console.log('Oldest messages deleted, keeping latest 2');
                } else {
                  console.log('No messages to delete');
                }
              } catch (error) {
                console.error('Error deleting oldest messages:', error);
              } finally {
                isDeleting.current = false;
              }
            }, 1000); // 1-second debounce
          }
        },
        (error) => {
          console.error('Error fetching messages:', error);
        }
      );

    return () => {
      console.log('Chat component unmounting, chatId:', chatId);
      isMounted.current = false;
      unsubscribe();
      if (deleteTimeout.current) clearTimeout(deleteTimeout.current);
    };
  }, [chatId, id, data.Name, data.ProfilePicture, isFocused]);

  const handleImagePick = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    try {
      const result = await launchImageLibrary(options);
      if (result.didCancel || !result.assets || result.assets.length === 0) {
        console.log('Image selection cancelled');
        return;
      }

      const { uri, fileName } = result.assets[0];
      const correctedUri = Platform.OS === 'android' ? uri.replace('file://', '') : uri;
      const imageName = fileName || `image_${Date.now()}.jpg`;
      const reference = storage().ref(`chat_images/${chatId}/${imageName}`);

      await reference.putFile(correctedUri);
      const imageUrl = await reference.getDownloadURL();

      const imageMessage = {
        _id: Math.random().toString(36).substring(7),
        image: imageUrl,
        text: '',
        sendBy: id,
        sendTo: data.userId,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      if (isMounted.current && isFocused) {
        setMessages((previousMessages) => GiftedChat.append(previousMessages, imageMessage));
        await firestore()
          .collection('chats')
          .doc(chatId)
          .collection('messages')
          .add(imageMessage);
        console.log('Image message sent successfully!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const onSend = useCallback(
    async (newMessages = []) => {
      const msg = newMessages[0];
      const finalMsg = {
        ...msg,
        text: msg.text || '',
        image: null,
        sendBy: id,
        sendTo: data.userId,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      try {
        if (isMounted.current && isFocused) {
          setMessages((previousMessages) => GiftedChat.append(previousMessages, finalMsg));
          await firestore()
            .collection('chats')
            .doc(chatId)
            .collection('messages')
            .add(finalMsg);
          console.log('Text message sent successfully:', finalMsg.text);
        }
      } catch (error) {
        console.error('Error sending text message:', error);
      }
    },
    [chatId, id, data.userId]
  );

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#007AFF',
          borderRadius: 15,
          padding: 5,
          marginRight: 10,
          marginVertical: 5,
        },
        left: {
          backgroundColor: '#000000',
          borderRadius: 15,
          padding: 5,
          marginLeft: 10,
          marginVertical: 5,
        },
      }}
      textStyle={{
        right: { color: '#FFFFFF' },
        left: { color: '#FFFFFF' },
      }}
    />
  );

  const renderInputToolbar = (props) => (
    <View style={styles.inputToolbar}>
      <TouchableOpacity onPress={handleImagePick} style={styles.imageButton}>
        <Text style={styles.imageButtonText}>📷</Text>
      </TouchableOpacity>
      <InputToolbar {...props} containerStyle={styles.inputContainer} />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{ _id: id, name: 'You' }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  inputToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  imageButton: { padding: 10 },
  imageButtonText: { fontSize: 24 },
  inputContainer: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default Chat;