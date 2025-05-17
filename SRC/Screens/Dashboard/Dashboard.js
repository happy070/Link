import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

let id = '';

const Dashboard = () => {
  const [myUsers, setMyUsers] = useState([]);
  const navigation = useNavigation();

  const NavigateToChat = (item, id) => {
    navigation.navigate('Chat', { data: item, id: id });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        id = await AsyncStorage.getItem('USERID');
        const mobileNumber = await AsyncStorage.getItem('MOBILE');
        console.log('MobileNumber:', mobileNumber);

        if (mobileNumber) {
          const response = await firestore()
            .collection('users')
            .where('Mobile', '!=', mobileNumber)
            .get();
          setMyUsers(response._docs.map((doc) => ({ id: doc.id, ...doc._data })));
          console.log('Complete data', response._docs);
        } else {
          console.log('No mobile number found in AsyncStorage');
        }
      } catch (error) {
        console.log('Error fetching data', error);
      }
    };

    fetchUserData();
  }, []);

  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return '??';
    const words = name.trim().split(' ');
    return words.length > 1
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : words[0][0].toUpperCase();
  };

  // Function to delete chat
  const deleteChat = async (userId) => {
    try {
      const chatId = [id, userId].sort().join('_');
      const messagesRef = firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages');

      // Get all messages
      const snapshot = await messagesRef.get();
      if (snapshot.empty) return;

      // Batch delete all messages
      const batch = firestore().batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      // Update local state to remove the chat
      setMyUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, LastMessage: '', LastMessageTime: '' }
            : user
        )
      );

      console.log('Chat deleted successfully');
    } catch (error) {
      console.error('Error deleting chat:', error);
      Alert.alert('Error', 'Failed to delete chat. Please try again.');
    }
  };

  // Handle long press to show delete option
  const handleLongPress = (userId, userName) => {
    Alert.alert(
      'Delete Chat',
      `Are you sure you want to delete the chat with ${userName}? This will delete the chat for both users.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteChat(userId),
        },
      ],
      { cancelable: true }
    );
  };

  // Render each user item
  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userContainer}
      onPress={() => NavigateToChat(item, id)}
      onLongPress={() => handleLongPress(item.id, item.Name)}
    >
      <View style={styles.dpContainer}>
        {item.ProfilePicture ? (
          <Image
            source={{ uri: item.ProfilePicture }}
            style={styles.profilePicture}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.initialsContainer}>
            <Text style={styles.initialsText}>{getInitials(item.Name)}</Text>
          </View>
        )}
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.Name || 'Unknown User'}</Text>
        <Text style={styles.lastMessage}>
          {item.LastMessage || 'Start a conversation...'}
        </Text>
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.timestamp}>{item.LastMessageTime || 'Just now'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Chats</Text>
      </View>
      {/* User List */}
      <FlatList
        data={myUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Fixed typo
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1F1F1F',
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(3),
    paddingTop: responsiveHeight(4),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerText: {
    fontSize: responsiveFontSize(3),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerIcon: {
    padding: responsiveWidth(2),
  },
  flatListContent: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1),
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    marginVertical: responsiveHeight(0.5),
    padding: responsiveWidth(3),
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  dpContainer: {
    width: responsiveWidth(14),
    height: responsiveWidth(14),
    borderRadius: responsiveWidth(7),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  profilePicture: {
    width: '100%',
    height: '100%',
  },
  initialsContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: responsiveFontSize(2.8),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
    marginLeft: responsiveWidth(3),
  },
  userName: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  lastMessage: {
    fontSize: responsiveFontSize(1.8),
    color: '#BBBBBB',
    marginTop: responsiveHeight(0.5),
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: responsiveFontSize(1.6),
    color: '#FFA500',
  },
});

export default Dashboard;