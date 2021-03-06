import React, {useState, useEffect, useRef} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Header, ChatItem, InputChat} from '../../components';
import {
  fonts,
  colors,
  getData,
  showError,
  getChatTime,
  setDateChat,
  getDateTime,
} from '../../utils';
import {Fire} from '../../config';

const Chatting = ({navigation, route}) => {
  const dataUstadz = route.params;
  const scrollViewRef = useRef();
  const [chatContent, setChatContent] = useState('');
  const [user, setUser] = useState({});
  const [chatData, setChatData] = useState([]);

  const trimText = text => {
    let maxLength = 40;
    if (text.length > maxLength) {
      return text.substring(0, maxLength).trimEnd() + ' ...';
    } else {
      return text;
    }
  };

  useEffect(() => {
    const chatId = `${dataUstadz.data.uid}-${dataUstadz.data.fullName}_${
      user.uid
    }-${user.fullName}`;
    const urlMessage = `messages/${user.uid}-${user.fullName}/${chatId}`;

    if (chatData.length > 0) {
      if (user.uid !== undefined && dataUstadz.data.uid !== undefined) {
        Fire.database()
          .ref(urlMessage)
          .update({readAt: 1});
      }
    }
  }, [
    chatData.length,
    dataUstadz.data.fullName,
    dataUstadz.data.uid,
    user.fullName,
    user.uid,
  ]);

  useEffect(() => {
    getDataUserFromLocal();
    const chatID = `${dataUstadz.data.uid}-${dataUstadz.data.fullName}_${
      user.uid
    }-${user.fullName}`;
    const urlFirebase = `chatting/${chatID}/allchat/`;
    Fire.database()
      .ref(urlFirebase)
      .on('value', snapshot => {
        if (snapshot.val()) {
          const dataSnapshot = snapshot.val();
          const allDataChat = [];
          Object.keys(dataSnapshot).map(key => {
            const dataChat = dataSnapshot[key];
            const newDataChat = [];

            Object.keys(dataChat).map(itemChat => {
              newDataChat.push({
                id: itemChat,
                data: dataChat[itemChat],
              });
            });

            allDataChat.push({
              id: key,
              data: newDataChat,
            });
          });
          setChatData(allDataChat);
        }
      });
  }, [dataUstadz.data.fullName, dataUstadz.data.uid, user.fullName, user.uid]);

  const getDataUserFromLocal = () => {
    getData('user').then(res => {
      setUser(res);
    });
  };

  const chatSend = () => {
    const today = new Date();

    const data = {
      sendBy: user.uid,
      chatDate: today.getTime(),
      chatTime: getChatTime(today),
      chatContent: chatContent,
      lastChatDatetime: getDateTime(today),
    };

    const chatID = `${dataUstadz.data.uid}-${dataUstadz.data.fullName}_${
      user.uid
    }-${user.fullName}`;

    const urlFirebase = `chatting/${chatID}/allchat/${setDateChat(today)}`;
    const urlMessageUser = `messages/${user.uid}-${user.fullName}/${chatID}`;
    const urlMessageUstadz = `messages/${dataUstadz.data.uid}-${
      dataUstadz.data.fullName
    }/${chatID}`;
    const dataHistoryChatForUser = {
      lastContentChat: chatContent,
      lastChatDate: setDateChat(today),
      lastChatTime: getChatTime(today),
      uidPartner: dataUstadz.data.uid,
      token: user.token,
      lastChatDatetime: getDateTime(today),
    };
    const dataHistoryChatForUstadz = {
      lastContentChat: chatContent,
      lastChatDate: setDateChat(today),
      lastChatTime: getChatTime(today),
      uidPartner: user.uid,
      readAt: '',
      lastChatDatetime: getDateTime(today),
    };

    //kirim ke firebase
    Fire.database()
      .ref(urlFirebase)
      .push(data)
      .then(() => {
        setChatContent('');
        // set history for user
        Fire.database()
          .ref(urlMessageUser)
          .set(dataHistoryChatForUser);

        // set history for ustadz
        Fire.database()
          .ref(urlMessageUstadz)
          .set(dataHistoryChatForUstadz);
      })
      .catch(err => {
        showError(err.message);
      });

    fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        Authorization:
          'key=AAAAaCu_v2M:APA91bGMRyW-oT39uFwZjWAM-x6EdRYXccc7kvQeH1H2B9ws3mx9i-O02ANCqm1vNu5DYUFRY-vg7VynCg95FbppCmX2QPGPuXEGYEWbJVz5CGZ2bcItG3Q4E0j12Xc63WJhNwV4KRem',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: `${dataUstadz.data.token}`,
        soundName: 'default',
        notification: {
          title: `${user.fullName}`,
          body: `${trimText(chatContent)}`,
        },
        data: {
          msgType: 'Chat',
          id: `${chatID}`,
          detailUstadz: {
            token: `${user.token}`,
            email: `${user.email}`,
            fullName: `${user.fullName}`,
            gender: `${user.gender}`,
            guru: `${user.guru}`,
            photo:
              'https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png',
            uid: `${user.uid}`,
          },
        },
      }),
    });
  };
  return (
    <View style={styles.page}>
      <Header
        type="dark-profile"
        title={dataUstadz.data.fullName}
        desc={dataUstadz.data.guru}
        photo={{uri: dataUstadz.data.photo}}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd()}>
          {chatData.map(chat => {
            return (
              <View key={chat.id}>
                <Text style={styles.chatDate}>{chat.id}</Text>
                {chat.data.map(itemChat => {
                  const isMe = itemChat.data.sendBy === user.uid;
                  return (
                    <ChatItem
                      key={itemChat.id}
                      isMe={isMe}
                      text={itemChat.data.chatContent}
                      date={itemChat.data.chatTime}
                      photo={isMe ? null : {uri: dataUstadz.data.photo}}
                    />
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      </View>
      <InputChat
        value={chatContent}
        onChangeText={value => setChatContent(value)}
        onButtonPress={chatSend}
        targetChat={dataUstadz}
      />
    </View>
  );
};

export default Chatting;

const styles = StyleSheet.create({
  page: {backgroundColor: colors.white, flex: 1},
  content: {flex: 1},
  chatDate: {
    fontSize: 11,
    fontFamily: fonts.primary.normal,
    color: colors.text.secondary,
    marginVertical: 20,
    textAlign: 'center',
  },
});
