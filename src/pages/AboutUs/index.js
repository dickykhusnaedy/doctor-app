import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {ILAstrobot} from '../../assets/illustration';
import {colors, fonts} from '../../utils';

const AboutUs = () => {
  return (
    <View style={styles.page}>
      <Text style={styles.bold}>About Us</Text>
      <Image source={ILAstrobot} style={styles.image} />
      <Text style={styles.bold}>Ustadz App</Text>
      <View style={styles.body}>
        <Text style={styles.title}>Version 1.1</Text>
        <Text style={styles.title}>Last update on 16 May 2021</Text>
      </View>
      <View />
    </View>
  );
};

export default AboutUs;

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: colors.white},
  image: {width: '100%', height: 150, marginTop: -30},
  body: {marginHorizontal: 20},
  bold: {
    fontSize: 20,
    fontFamily: fonts.primary[800],
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {fontSize: 16, color: colors.text.secondary, marginTop: 12},
});
