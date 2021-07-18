import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {List} from '../../components';
import {Fire} from '../../config';
import {colors, fonts, getData} from '../../utils';

const Messages = ({navigation}) => {
  const dispacth = useDispatch();
  const [user, setUser] = useState({});
  const [historyChat, setHistoryChat] = useState([]);

  useEffect(() => {
    getDataUserFromLocal();
    const rootDB = Fire.database().ref();
    const urlHistory = `messages/${user.uid}-${user.fullName}/`;
    const messagesDB = rootDB.child(urlHistory);

    messagesDB.on('value', async snapshot => {
      if (snapshot.val()) {
        const oldData = snapshot.val();
        const data = [];

        const promises = await Object.keys(oldData).map(async key => {
          const urlUidUstadz = `users/${oldData[key].uidPartner}`;
          const detailUstadz = await rootDB.child(urlUidUstadz).once('value');
          data.push({
            id: key,
            detailUstadz: detailUstadz.val(),
            ...oldData[key],
          });
        });

        await Promise.all(promises);
        setHistoryChat(data);

        // untuk menghitung jumlah chat yang belum dibaca dan memunculkannya di tabMenu
        let countRead = 0;
        data.map(dataChat => {
          if (dataChat.readAt !== undefined) {
            if (dataChat.readAt === 1) {
              countRead += dataChat.readAt - 1;
            } else if (dataChat.readAt.length === 0) {
              countRead += dataChat.readAt.length + 1;
            }
          }
        });
        // update jumlah chat yang belum dibaca ke redux
        dispacth({
          type: 'MESSAGE_COUNT',
          value: countRead,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.fullName, user.uid]);

  const getDataUserFromLocal = () => {
    getData('user').then(res => {
      setUser(res);
    });
  };

  return (
    <View style={styles.page}>
      <View style={styles.content}>
        <Text style={styles.title}>Messages</Text>
        {historyChat.length === 0 ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.secondary} size={'large'} />
          </View>
        ) : (
          historyChat
            .map(chat => {
              const dataUstadz = {
                id: chat.detailUstadz.uid,
                data: chat.detailUstadz,
              };
              return (
                <List
                  key={chat.id}
                  profile={{uri: chat.detailUstadz.photo}}
                  name={chat.detailUstadz.fullName}
                  desc={chat.lastContentChat}
                  time={chat.lastChatTime}
                  read={chat.readAt !== undefined ? chat.readAt : 'kirim'}
                  datetime={chat.lastChatDatetime}
                  isMe={user.uid !== chat.uidPartner}
                  onPress={() => navigation.navigate('Chatting', dataUstadz)}
                />
              );
            })
            .sort((a, b) => {
              if (a.props.datetime <= b.props.datetime) {
                return 1;
              }
              if (a.props.datetime >= b.props.datetime) {
                return -1;
              }
              return 0;
            })
        )}
      </View>
    </View>
  );
};

export default Messages;

const styles = StyleSheet.create({
  page: {backgroundColor: colors.secondary, flex: 1},
  content: {
    backgroundColor: colors.white,
    flex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    marginTop: 30,
    marginLeft: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
