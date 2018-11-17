
import * as React from 'react'
import { View, Text } from 'react-native';
import { 
  GET_ALL_ORDERS
 } from '../../../graphql/queries/vendorQueries'
  // function to get all orders
  async getOrders() {
    const orders = await client.query({
      query: GET_ALL_ORDERS, 
      variables: {vendor_name: "Nicolas LLC"}
    })
    console.log(orders)
  }
  

export class PendingOrdersScreen extends React.Component<any, any> {
  render() {
    return (
      <View>
        <Text>
          Pending orders Screen
        </Text>
      </View>
    
      )
  }
}