import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {Button, Gap, Header, Input} from '../../components';
import {Fire} from '../../config';
import {colors, showError, storeData, useForm} from '../../utils';
import messaging from '@react-native-firebase/messaging';

const Register = ({navigation}) => {
  const dispatch = useDispatch();
  const [getToken, setGetToken] = useState('');
  const [form, setForm] = useForm({
    fullName: '',
    guru: '',
    university: '',
    str_number: '',
    gender: 'pria',
    email: '',
    password: '',
  });

  const [itemGender] = useState([
    {
      id: 1,
      label: 'Pria',
      value: 'pria',
    },
    {
      id: 2,
      label: 'Wanita',
      value: 'wanita',
    },
  ]);

  const onContinue = () => {
    dispatch({type: 'SET_LOADING', value: true});
    Fire.auth()
      .createUserWithEmailAndPassword(form.email, form.password)
      .then(success => {
        dispatch({type: 'SET_LOADING', value: false});
        setForm('reset');
        const data = {
          fullName: form.fullName,
          guru: form.guru,
          rate: 0,
          university: form.university,
          str_number: form.str_number,
          gender: form.gender,
          email: form.email,
          password: form.password,
          uid: success.user.uid,
          token: getToken,
        };

        Fire.database()
          .ref(`guru/${success.user.uid}/`)
          .set(data);

        storeData('user', data);
        navigation.navigate('UploadPhoto', data);
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
              console.log('message.getToken ', token);
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
      <Header onPress={() => navigation.goBack()} title="Daftar Akun" />
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input
            label="Full Name"
            value={form.fullName}
            onChangeText={value => setForm('fullName', value)}
          />
          <Gap height={24} />
          <Input
            label="Guru"
            value={form.guru}
            onChangeText={value => setForm('guru', value)}
          />
          <Gap height={24} />
          <Input
            label="Universitas"
            value={form.university}
            onChangeText={value => setForm('university', value)}
          />
          <Gap height={24} />
          <Input
            label="Nomor STR"
            value={form.str_number}
            onChangeText={value => setForm('str_number', value)}
          />
          <Gap height={24} />
          <Input
            label="Jenis Kelamin"
            value={form.gender}
            onValueChange={value => setForm('gender', value)}
            select
            selectItem={itemGender}
          />
          <Gap height={24} />
          <Input
            label="Email"
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
          <Gap height={40} />
          <Button title="Continue" onPress={onContinue} />
          <Gap height={40} />
        </ScrollView>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  page: {backgroundColor: colors.white, flex: 1},
  content: {paddingHorizontal: 40, flex: 1},
});
