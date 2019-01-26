import * as React from 'react'
import { View, Text, Button } from 'react-native';


interface AccountScreenProps {
  // injected props
  rootStore?: RootStore;
}

export class AccountS creen extends React.Component<AccountScreenProps, any> {
  
  render() {
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center", borderColor: "red", borderWidth: 1}}>
        <Text style={{fontSize: 30}}>
          Account Screen
        </Text>

        <Button
          onPress={() => this.props.navigation.navigate('VendorInfo')}
          title="VendorInfo"
          color="#841584"
          />     

        <Button
          onPress={() => this.props.navigation.navigate('HoursOperation')}
          // onPress={this.getOrders}
          title="Hours of Operation"
          color="#841584"
          />    

          <Button
          onPress={() => this.props.navigation.navigate('Menu')}
          // onPress={this.getOrders}
          title="Menu"
          color="#841584"
          />     

      </View>
    
      )
  }
}