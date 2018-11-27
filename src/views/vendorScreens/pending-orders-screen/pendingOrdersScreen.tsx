
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
const UPDATE_ORDER_STATUS = gql`
  mutation updateOrderStatus($orderId: String!) {
    order(orderId: $orderId) {
        setPending {
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
      firstMenuItemInOrder: [],
      fake: []
    }
    this.getMenuItems();
  }
  
  /**
   * Function to get all orders associated with a particular vendor
   */
  async getOrders() {
    const orders : any = await client.watchQuery({
      query: GET_ALL_ORDERS, 
      variables: {vendor_name: "Kessler Ltd"},
      pollInterval: 100
    }).subscribe({
      next: ({data}) => {this.setState({orders: data.vendor[0].orders});
      console.log(data)}
    })
  }

  /**
   * Function to get information about the menuitems in the cart. This could be helpful in the future,
   * but for the proof of concept, after setting the state, it isn't used yet.
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
    console.log("hello")
    console.log(this.state.firstMenuItemInOrder)
  }

  render() {
    {console.log(this.state.fake)}
    {console.log("bye")}
    {console.log(this.state.firstMenuItemInOrder)}
    return (
      <View style={FULL}>
            <FlatList
            data= {this.state.orders}
            renderItem={({item}) => 
            <View style={{flexDirection: 'row'}}>
                <View>
                  <Text style={styles.item}>{item.user.netid +"'s Order"}</Text>
                  <Text style={styles.small}>{"On The Way Status: " + item.status.onTheWay}</Text>
                </View>
              <Button
                onPress= {() => this.changeStatusToOnTheWay(item._id)}
                title="On The Way!"
              />
            </View>}
            />
      </View>
      )
  }

  /**
   * Function that changes the order status of a given order in the backend
   */
  async changeStatusToOnTheWay(orderId: String) {
    await client.mutate({
      mutation: UPDATE_ORDER_STATUS,
      variables: {orderId: orderId}
    })
  }

}

// styles that define how the text is displayed
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
  small: {
    paddingLeft: 10,
    fontSize: 14,
    height: 24,
  }
})
