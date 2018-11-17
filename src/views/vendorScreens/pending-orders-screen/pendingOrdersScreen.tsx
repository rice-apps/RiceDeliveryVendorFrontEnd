
import * as React from 'react'
import { View, Text, FlatList, StyleSheet, Button} from 'react-native';
import { 
  GET_ALL_ORDERS
 } from '../../../graphql/queries/vendorQueries'
 import { client } from '../../../app/main'

  

export class PendingOrdersScreen extends React.Component<any, any> {
    // function to get all orders
    async getOrders() {
      const orders = await client.query({
        query: GET_ALL_ORDERS, 
        variables: {vendor_name: "Nicolas LLC"}
      })
      console.log(orders);
      return orders
    }

  render() {
    return (
      <View>
        <FlatList
        data={[
          {key: 'Devin'},
          {key: 'Jackson'},
          {key: 'James'},
          {key: 'Joel'},
          {key: 'John'},
          {key: 'Jillian'},
          {key: 'Jimmy'},
          {key: 'Julie'},
        ]}
        renderItem={({item}) => 
        <View>
          <Text style={styles.item}>{item.key}</Text>
          <Button
            onPress= {this.changeOrderStatus}
            title="Change Order Status"
           />
        </View>}
        />
      </View>
    
      )
  }

  changeOrderStatus() {

  }
}
const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})
