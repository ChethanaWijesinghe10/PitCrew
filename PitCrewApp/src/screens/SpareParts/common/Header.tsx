import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/base';

interface HeaderProps {
  title: string;
  icon: ImageSourcePropType;
  count: number;
  onClickIcon: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, icon, count, onClickIcon }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {/* <TouchableOpacity
        style={styles.arrowIcon}
        onPress={() => navigation.navigate('SelectLogin' as never)}>
        <Image source={require('../../../../assets/img/SpareParts/arrow.png')} style={styles.icon} />
      </TouchableOpacity> */}
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity style={styles.cartIcon} onPress={onClickIcon}>
        <Image source={icon} style={styles.icon} />
        {count > 0 && <Text style={styles.count}>{count}</Text>}
      </TouchableOpacity>
      {/* <View style={styles.cartIcon}>
        <Icon type='cart-outline' name='ionicons' onPress={onClickIcon} />
        {count > 0 && <Text style={styles.count}>{count}</Text>}
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#291D7D',
    height: 60,
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    fontSize: 20,
    color: 'white',
    marginLeft: 20,
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium'
  },
  arrowIcon: {
    marginRight: 20,
  },
  cartIcon: {
    position: 'relative',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  count: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    textAlign: 'center',
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
});

export default Header;
