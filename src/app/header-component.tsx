import * as React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { color } from '../theme'
import Icon from 'react-native-vector-icons/Ionicons'
/*
  Persistent header in the app.
*/
export class Header extends React.Component<any, any>  {
  render() {
    return (
      <View style={styles.topContainer}>
        <Text style={styles.vendorHeader}>
          Vendor Name
        </Text>
        <Text style={styles.logo}>
          Logo
        </Text>
        <Icon style={styles.icon} name="md-settings" size={30} color="black" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 0.08,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

  },
  vendorHeader: {
    color: color.palette.black,
  }, 
  logo: {
    color: color.palette.black,
    paddingLeft: 2
  },
  icon: {
  }
})