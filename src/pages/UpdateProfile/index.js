import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useDispatch} from 'react-redux';
import {ILNullPhoto} from '../../assets';
import {Button, Gap, Header, Input, Profile} from '../../components';
import {Fire} from '../../config';
import {colors, getData, showError, showSuccess, storeData} from '../../utils';

const UpdateProfile = ({navigation}) => {
  const dispatch = useDispatch();
  const [profile, setProfile] = useState({
    fullName: '',
    guru: '',
    email: '',
  });
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(ILNullPhoto);

  useEffect(() => {
    getData('user').then(res => {
      const data = res;
      setPhoto({uri: res.photo});
      setProfile(data);
    });
  }, []);

  const update = () => {
    if (password.length > 0) {
      if (password.length <= 5) {
        showError('Password kurang dari 6 karater');
      } else {
        updatePassword();
        updateProfileData();
      }
    } else {
      updateProfileData();
    }
  };

  const updatePassword = () => {
    Fire.auth().onAuthStateChanged(user => {
      if (user) {
        user
          .updatePassword(password)
          .then(() => {
            console.log('update password');
            showSuccess('Your password has been changed successfully');
            navigation.replace('MainApp');
          })
          .catch(err => {
            showError(err.message);
          });
      }
    });
  };

  const updateProfileData = () => {
    dispatch({type: 'SET_LOADING', value: true});
    const data = profile;
    Fire.database()
      .ref(`guru/${profile.uid}/`)
      .update(data)
      .then(() => {
        storeData('user', data)
          .then(() => {
            setTimeout(() => {
              console.log('update data');
              dispatch({type: 'SET_LOADING', value: false});
              navigation.replace('MainApp');
            }, 3000);
          })
          .catch(() => {
            showError('Terjadi Masalah');
          });
      })
      .catch(err => {
        showError(err.message);
      });
  };

  const changeText = (key, value) => {
    setProfile({
      ...profile,
      [key]: value,
    });
  };

  const getImage = () => {
    launchImageLibrary(
      {includeBase64: true, quality: 0.3, maxWidth: 200, maxHeight: 200},
      response => {
        if (response.didCancel || response.error) {
          showError('oops, sepertinya anda tidak memilih foto nya?');
        } else {
          const uploadFile = `data:${response.type};base64, ${response.base64}`;
          const source = {uri: uploadFile};
          setPhoto(source);
          // save photo direct to firebase after user select photo from the gallery
          dispatch({type: 'SET_LOADING', value: true});
          setTimeout(async () => {
            await Fire.database()
              // root users (table name)
              // success.user.uid to save data with the registered uid user
              .ref(`guru/${profile.uid}/`)
              // save data to firebase
              .update({photo: uploadFile});

            // store data to localstorage
            const data = profile;
            data.photo = uploadFile;
            storeData('user', data);

            console.log('data localstorage', data);

            dispatch({type: 'SET_LOADING', value: false});
            navigation.replace('MainApp');
          }, 3000);
        }
      },
    );
  };
  return (
    <View style={styles.page}>
      <Header title="Edit Profile" onPress={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Profile isRemove photo={photo} onPress={getImage} />
          <Gap height={26} />
          <Input
            label="Full Name"
            value={profile.fullName}
            onChangeText={value => changeText('fullName', value)}
          />
          <Gap height={24} />
          <Input
            label="Guru"
            value={profile.guru}
            onChangeText={value => changeText('guru', value)}
          />
          <Gap height={24} />
          <Input label="Email" value={profile.email} disable />
          <Gap height={24} />
          <Input
            label="Password"
            secureTextEntry
            value={password}
            onChangeText={value => setPassword(value)}
          />
          <Gap height={40} />
          <Button title="Save Profile" onPress={update} />
        </View>
      </ScrollView>
    </View>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  page: {backgroundColor: colors.white, flex: 1},
  content: {padding: 40, paddingTop: 0},
});
