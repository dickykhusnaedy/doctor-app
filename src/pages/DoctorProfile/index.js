import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Header, Profile, ProfileItem, Gap} from '../../components';
import {colors} from '../../utils';

const DoctorProfile = ({navigation, route}) => {
  const dataGuru = route.params;
  return (
    <View style={styles.page}>
      <Header title="Doctor Profile" onPress={() => navigation.goBack()} />
      <Profile
        name={dataGuru.data.fullName}
        desc={dataGuru.data.guru}
        photo={{uri: dataGuru.data.photo}}
      />
      <Gap height={10} />
      <ProfileItem label="Alumnus" value={dataGuru.data.university} />
      <ProfileItem
        label="Tempat Praktik"
        value={dataGuru.data.hospital_address}
      />
      <ProfileItem label="No. STR" value={dataGuru.data.str_number} />
      <View style={styles.action}>
        <Button
          title="Start Consultation"
          onPress={() => navigation.navigate('Chatting', dataGuru)}
        />
      </View>
    </View>
  );
};

export default DoctorProfile;

const styles = StyleSheet.create({
  page: {backgroundColor: colors.white, flex: 1},
  action: {paddingHorizontal: 40, paddingTop: 23},
});
