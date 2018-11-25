
import * as React from 'react'
import { View, Text, FlatList, StyleSheet, Button} from 'react-native';
import { 
  GET_ALL_ORDERS
 } from '../../../graphql/queries/vendorQueries'
 import { client } from '../../../app/main'

import gql from 'graphql-tag'
import { TransactionHistoryScreen } from '../transaction-history-screen';


 const GET_MENU_ITEM = gql`
  query getMenuItem($itemId: String) {
    getMenuItem(itemId: $itemId) {
      name 
      description
    }
  }
`
export class PendingOrdersScreen extends React.Component<any, any> {

  constructor(props) {
    super(props); 

    this.state={
      orders: [],
      firstMenuItemInOrder: []
    }
    this.getMenuItems();
  }
  
  /**
   * Function to get all orders associated with a particular vendor
   */
  async getOrders() {
    const orders : any = await client.query({
      query: GET_ALL_ORDERS, 
      variables: {vendor_name: "Kessler Ltd"}
    })
    console.log(orders.data.vendor[0].orders)
    this.setState({orders: orders.data.vendor[0].orders})
  }

  //  /**
  //  * Function that, when given a menuId, returns the menuItem associated with that id
  //  */
  // getMenuItem(menuId: String) {
  //   const menuItems = []
  //   async (menuId) => {
  //     const menuItem = await client.query({
  //       query: GET_MENU_ITEM,
  //       variables: {itemId: menuId}
  //     })
  //     menuItems.push(menuItem.data)
  //   }
  //   return menuItems[0]
  // }

  /**
   * Function to get information about the menuitems in the cart.
   */
  async getMenuItems() {
    await this.getOrders();
    const menuItems = []
    this.state.orders.forEach(async (order) => {
      const menuItem = await client.query({
        query: GET_MENU_ITEM,
        // just getting first item in the order for proof of concept
        variables: {itemId: order.items[0].item.id}
      })
      menuItems.push(menuItem.data)
    })
    console.log(menuItems)
    this.setState({firstMenuItemInOrder: menuItems})
  }


  render() {
    return (
      <View>
        <FlatList
        data= {this.state.firstMenuItemInOrder}
        renderItem={({item}) => 
        <View>
          <Text style={styles.item}>{item.getMenuItem.name}</Text>
          <Button
            onPress= {this.changeStatusToOnTheWay}
            title="On The Way!"
           />
        </View>}
        />
      </View>
    
      )
  }

  // function that changes the order status of a given order
  changeStatusToOnTheWay() {
    
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
