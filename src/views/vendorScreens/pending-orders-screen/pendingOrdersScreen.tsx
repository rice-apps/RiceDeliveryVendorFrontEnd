
import * as React from 'react'
import { View, Text, FlatList, StyleSheet, Button, ViewStyle, TextStyle, SafeAreaView} from 'react-native';
import { 
  GET_ALL_ORDERS
 } from '../../../graphql/queries/vendorQueries'
 import { client } from '../../../app/main'

import gql from 'graphql-tag'
import { TransactionHistoryScreen } from '../transaction-history-screen';
import ApolloClient from "apollo-boost"
import { color, spacing } from "../../../theme"
import { Wallpaper } from "../../shared/wallpaper"
import { Header } from "../../shared/header"
import { Screen } from "../../shared/screen"



const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[5] - 1,
  paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = {
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const TITLE: TextStyle = {
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
  marginBottom: spacing[5],
}

// query to get a menu item
 const GET_MENU_ITEM = gql`
  query getMenuItem($itemId: String) {
    getMenuItem(itemId: $itemId) {
      name 
      description
    }
  }
`
// Function to send update an order status
// hardcoded string with time stamp for proof of concept 
const UPDATE_ORDER_STATUS = gql`
  mutation updateOrderStatus($orderId: String!) {
    order(orderId: $orderId) {
        setOnTheWay(time: "99999999") {
            _id
        }
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
  // getMenuItem(orders: []) {
  //   const menuItems = []
  //   orders.forEach (async(menuId) => {
  //     const menuItem = await client.query({
  //       query: GET_MENU_ITEM,
  //       variables: {itemId: menuId}
  //     })
  //     menuItems.push(menuItem.data)
  //   })
  //   console.log(menuItems)
  //   return menuItems
  // }

  /**
  //  * Function to get information about the menuitems in the cart.
  //  */
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
    console.log("hello")
    console.log(this.state.firstMenuItemInOrder)
  }

  render() {
    return (
      <View style={FULL}>

            <FlatList
            data= {this.state.orders}
            renderItem={({item}) => 
            <View style={{flexDirection: 'row'}}>
              {console.log("bye")}
              {console.log(this.state.firstMenuItemInOrder)}
                <Text style={styles.item}>{item.user.netid +"'s Order"}</Text>
              <Button
                onPress= {() => this.changeStatusToOnTheWay(item._id)}
                title="On The Way!"
              />
            </View>}
            />
      </View>
      )
  }

  // function that changes the order status of a given order
  async changeStatusToOnTheWay(orderId: String) {
    await client.mutate({
      mutation: UPDATE_ORDER_STATUS,
      variables: {orderId: orderId}
    })
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
