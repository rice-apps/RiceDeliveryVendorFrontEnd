import * as React from "react"
import { inject, observer } from "mobx-react"
// @ts-ignore: until they update @type/react-navigation
import { getNavigation, NavigationScreenProp, NavigationState } from "react-navigation"
import { View, Text } from "react-native"


interface orderProps {
  name: string,
  college: string, 
  phoneNumber: string, 
  orderTime: number
  items: item[]
}

interface item {
  itemName: string, 
  quantity: number, 
  other?: any
}

interface batchProps {
  batches: batch
}
interface batch {
  status: string
  orders: orderProps[]
}



@observer
export class BatchComponent extends React.Component<batchProps, {}> {
  render() {
    return (
          <View style={{flex: 1, flexDirection: "column"}}>

            {this.props.batches.orders.map(
              (value, index) => (
                <Text key={index} style={{width: "100%", height: 100, backgroundColor: "white"}}> 
                {"Order number:  " + (index + 1)} {"\n"}
                {"Name:  " + value.name} {"\n"}
                {"College:  " + value.college} {"\n"}
                {"Phone Number:  " + value.phoneNumber} {"\n"}
                {"Order Time:  " + value.orderTime} {"\n"}
                </Text>
              ),
            )
            }

            {/* Will's code: */}
              {/* {
              names.map((user, index) => (
                <View  key ={index}>
                  <Text>Member name: {user.name}</Text>)

                  <Text onPress={() => this.toggleVip(user)} key={index}>
                  Vip: {user.vip ? 'Yes': 'No'}
                  </Text>
                  
                  <Text onPress = {() => this.delete(user)}> Delete </Text>

                </View>
              ))
              } */}

          </ View>
        )
    }
}
