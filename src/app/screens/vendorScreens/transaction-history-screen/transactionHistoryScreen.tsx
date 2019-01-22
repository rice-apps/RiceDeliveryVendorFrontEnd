import * as React from 'react'
import { View, Text } from 'react-native';


export class AccountScreen extends React.Component<any, any> {
  render() {
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center", borderColor: "red", borderWidth: 1}}>
        <Text style={{fontSize: 30}}>
          Account Screen
        </Text>
      </View>
    
      )
  }
}