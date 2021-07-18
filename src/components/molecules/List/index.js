import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {colors, fonts} from '../../../utils';
import {
  IconNext,
  IconEditProfile,
  IconLanguage,
  IconRate,
  IconHelp,
} from '../../../assets';

const List = ({profile, name, desc, time, type, onPress, icon, read, isMe}) => {
  const [colorText, setColorText] = useState(colors.text.secondary);
  const [fontText, setFontText] = useState(fonts.primary[300]);

  // this function for trim text
  const trimText = text => {
    let maxLength = 60;
    if (text.length > maxLength) {
      return text.substring(0, maxLength).trimEnd() + ' ...';
    } else {
      return text;
    }
  };

  const Icon = () => {
    if (icon === 'edit-profile') {
      return <IconEditProfile />;
    }
    if (icon === 'language') {
      return <IconLanguage />;
    }
    if (icon === 'rate') {
      return <IconRate />;
    }
    if (icon === 'help') {
      return <IconHelp />;
    }
    return <IconEditProfile />;
  };

  useEffect(() => {
    if (read !== undefined) {
      if (read === 1) {
        setColorText(colors.text.secondary);
        setFontText(fonts.primary[300]);
      } else if (read.length === 0) {
        setColorText(colors.text.primary);
        setFontText(fonts.primary[700]);
      } else {
        if (read === 'kirim' && isMe) {
          setColorText(colors.text.secondary);
          setFontText(fonts.primary[300]);
        }
      }
    }
  }, [read, isMe]);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {icon ? <Icon /> : <Image source={profile} style={styles.avatar} />}
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        {read !== undefined && (
          <Text style={styles.descReadAt(colorText, fontText)}>
            {trimText(desc)}
          </Text>
        )}
        {read === undefined && (
          <Text style={styles.desc}>{trimText(desc)}</Text>
        )}
      </View>
      <View style={styles.rate}>
        <Text style={styles.desc}>{time}</Text>
      </View>
      {type === 'next' && <IconNext />}
    </TouchableOpacity>
  );
};

export default List;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {flex: 1, marginLeft: 16},
  avatar: {width: 46, height: 46, borderRadius: 46 / 2},
  name: {
    fontSize: 16,
    fontFamily: fonts.primary.normal,
    color: colors.text.primary,
  },
  desc: {
    fontSize: 12,
    fontFamily: fonts.primary[300],
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
  descReadAt: (colorText, fontText) => ({
    fontSize: 12,
    color: colorText,
    fontFamily: fontText,
  }),
});
