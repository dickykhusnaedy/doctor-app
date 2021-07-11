import {NavigationContainer} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import React, {useEffect, useState} from 'react';
import {LogBox} from 'react-native';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import {Provider, useSelector} from 'react-redux';
import {Loading} from './components';
import store from './redux/store';
import Router from './router';
import {colors, showError} from './utils';

const navigationRef = React.createRef();
var fcmSubscribe = null;

const MainApp = () => {
  const stateGlobal = useSelector(state => state);
  LogBox.ignoreAllLogs();
  LogBox.ignoreLogs(['Setting a timer for a long period of time']);
  const [loading, setLoading] = useState(true);

  const forwardToChatPage = (idChat, dataChat) => {
    navigationRef.current?.navigate({
      name: 'Chatting',
      params: {
        id: idChat,
        data: {
          token: dataChat.token,
          email: dataChat.email,
          fullName: dataChat.fullName,
          kelas: dataChat.kelas,
          photo: dataChat.photo,
          uid: dataChat.uid,
        },
      },
    });
  };

  const processNotification = (remoteMessage, fromBackground) => {
    let title = '';
    let body = '';

    let idChat = '';
    let dataChat = '';

    if (remoteMessage) {
      // if apps running in background or not
      if (remoteMessage.notification) {
        title = remoteMessage.notification.title;
        body = remoteMessage.notification.body;
      }

      if (remoteMessage.data) {
        // if user tap on the notication when app is in background or not
        if (fromBackground && remoteMessage.data.msgType) {
          idChat = remoteMessage.data.id;
          dataChat = JSON.parse(remoteMessage.data.detailUstadz);

          switch (remoteMessage.data.msgType) {
            case 'Chat':
              forwardToChatPage(idChat, dataChat);
              return;
          }
        }
        // apps running in foreground
        if (!fromBackground && remoteMessage.data.msgType) {
          idChat = remoteMessage.data.id;
          dataChat = JSON.parse(remoteMessage.data.detailUstadz);
          switch (remoteMessage.data.msgType) {
            case 'Chat':
              showMessage({
                message: remoteMessage.notification.title,
                description: remoteMessage.notification.body,
                type: 'default',
                duration: 2000,
                textStyle: {fontWeight: 'bold', fontSize: 14},
                backgroundColor: colors.primary,
                color: colors.white,
                onPress: () => {
                  forwardToChatPage(idChat, dataChat);
                  console.log('Pindah halmaann');
                },
              });
              break;
          }
        }
      }
    }
  };

  useEffect(() => {
    messaging()
      .requestPermission()
      .then(authStatus => {
        console.log('APNs Status: ', authStatus);
        if (
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          // eslint-disable-next-line eqeqeq
          authStatus == messaging.AuthorizationStatus.PROVISIONAL
        ) {
          fcmSubscribe = messaging().onMessage(async remoteMessage => {
            processNotification(remoteMessage, false);
          });

          messaging().onNotificationOpenedApp(remoteMessage => {
            processNotification(remoteMessage, true);
          });

          messaging()
            .getInitialNotification()
            .then(remoteMessage => {
              if (remoteMessage) {
                processNotification(remoteMessage, true);
              }
              setLoading(false);
            });
        }
      })
      .catch(err => {
        showError(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return null;
  }

  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Router />
      </NavigationContainer>
      <FlashMessage position="top" />
      {stateGlobal.loading && <Loading />}
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
};

export default App;
