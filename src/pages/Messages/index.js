import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {List} from '../../components';
import {Fire} from '../../config';
import {colors, fonts, getData} from '../../utils';

const Messages = ({navigation}) => {
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
      }
    });
  }, [user.fullName, user.uid]);

  const getDataUserFromLocal = () => {
    getData('user').then(res => {
      setUser(res);
    });
  };

  console.log(historyChat);

  return (
    <View style={styles.page}>
      <View style={styles.content}>
        <Text style={styles.title}>Messages</Text>
        {historyChat.map(chat => {
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
              onPress={() => navigation.navigate('Chatting', dataUstadz)}
            />
          );
        })}
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
});
