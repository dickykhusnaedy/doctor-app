import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {
  IconDoctor,
  IconMessages,
  IconDoctorActive,
  IconMessagesActive,
  IconHome,
  IconHomeActive,
} from '../../../assets';
import {colors, fonts} from '../../../utils';

const TabItem = ({title, active, onPress, onLongPress}) => {
  const countMessageNoRead = useSelector(state => state.message);
  const IconMessageCount = () => {
    return (
      <>
        <View style={styles.countRound}>
          <Text style={styles.countText}>{countMessageNoRead}</Text>
        </View>
        {active ? <IconMessagesActive /> : <IconMessages />}
      </>
    );
  };
  const Icon = () => {
    if (title === 'Home') {
      return active ? <IconHomeActive /> : <IconHome />;
    }
    if (title === 'Messages') {
      return <IconMessageCount />;
    }
    if (title === 'Profile') {
      return active ? <IconDoctorActive /> : <IconDoctor />;
    }
    return <IconDoctor />;
  };
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}>
      <Icon />
      <Text style={styles.text(active)}>{title}</Text>
    </TouchableOpacity>
  );
};

export default TabItem;

const styles = StyleSheet.create({
  container: {alignItems: 'center'},
  text: active => ({
    fontSize: 10,
    color: active ? colors.text.menuActive : colors.text.menuInactive,
    fontFamily: fonts.primary[600],
    marginTop: 4,
  }),
  countRound: {
    top: -6,
    right: 0,
    zIndex: 1,
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 3,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.red,
  },
  countText: {
    fontSize: 10,
    color: colors.white,
    marginTop: -2,
    fontFamily: fonts.primary[600],
  },
});
