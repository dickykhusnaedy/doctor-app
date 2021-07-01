import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {ILLogo} from '../../assets';
import {Button, Gap, Input, Link} from '../../components';
import {Fire} from '../../config';
import {colors, fonts, showError, storeData, useForm} from '../../utils';
import messaging from '@react-native-firebase/messaging';

const Login = ({navigation}) => {
  const [form, setForm] = useForm({email: '', password: ''});
  const dispatch = useDispatch();
  const [getToken, setGetToken] = useState('');

  const login = () => {
    dispatch({type: 'SET_LOADING', value: true});
    Fire.auth()
      .signInWithEmailAndPassword(form.email, form.password)
      .then(res => {
        dispatch({type: 'SET_LOADING', value: false});
        Fire.database()
          .ref(`guru/${res.user.uid}/`)
          .once('value')
          .then(resDB => {
            const dataLogin = {
              email: resDB.val().email,
              fullName: resDB.val().fullName,
              gender: resDB.val().gender,
              guru: resDB.val().guru,
              university: resDB.val().university,
              str_number: resDB.val().str_number,
              rate: resDB.val().rate,
              token: getToken,
              password: resDB.val().password,
              uid: resDB.val().uid,
            };
            if (resDB.val()) {
              Fire.database()
                .ref(`guru/${res.user.uid}/`)
                .update(dataLogin);
              storeData('user', dataLogin);
              navigation.replace('MainApp');
            }
          });
      })
      .catch(err => {
        dispatch({type: 'SET_LOADING', value: false});
        showError(err.message);
      });
  };

  useEffect(() => {
    messaging()
      .requestPermission()
      .then(authStatus => {
        if (
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          // eslint-disable-next-line eqeqeq
          authStatus == messaging.AuthorizationStatus.PROVISIONAL
        ) {
          messaging()
            .getToken()
            .then(token => {
              setGetToken(token);
            });

          messaging().onTokenRefresh(token => {
            console.log('messaging.onTokenRefresh: ', token);
          });
        }
      });
  }, []);

  return (
    <View style={styles.page}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Gap height={40} />
        <ILLogo />
        <Text style={styles.title}>Masuk dan mulai berkonsultasi</Text>
        <Input
          label="Email Address"
          value={form.email}
          onChangeText={value => setForm('email', value)}
        />
        <Gap height={24} />
        <Input
          label="Password"
          value={form.password}
          onChangeText={value => setForm('password', value)}
          secureTextEntry
        />
        <Gap height={10} />
        <Link title="Forgot My Password" size={12} />
        <Gap height={40} />
        <Button title="Sign In" onPress={login} />
        <Gap height={30} />
        <Link
          title="Create New Account"
          size={16}
          align="center"
          onPress={() => navigation.navigate('Register')}
        />
      </ScrollView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  page: {paddingHorizontal: 40, backgroundColor: colors.white, flex: 1},
  title: {
    fontSize: 20,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    marginTop: 40,
    marginBottom: 40,
    maxWidth: 153,
  },
});
