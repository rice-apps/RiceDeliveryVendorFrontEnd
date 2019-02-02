
import * as React from 'react'
import { View, ScrollView, StyleSheet, Button, TextStyle, Alert } from 'react-native';
import { GET_ALL_ORDERS } from '../../../../../graphql/queries/vendorQueries'
import { client } from '../../../../../app/main'

import gql from 'graphql-tag'
import * as css from "../../../style"
import { OrderList } from "../../../../components/order-list"
import PrimaryButton from '../../../../components/primary-button.js'
import SecondaryButton from '../../../../components/secondary-button.js'

import { mock_orders } from '../../../../components/temporary-mock-order'


// Using one mock order from temp file

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

//new query to get info for the orderStore
const GET_ORDER_STORE = gql`
  query orderStore {
    vendor (name: "The Hoot") {
      orders {
        id
        amount
        created
        customer
        email
        items {
          parent
          amount
          description
          quantity
        }
        orderStatus {
          pending
          onTheWay
          fulfilled
          unfulfilled
        }
        paymentStatus,
        location {
          _id
          name
        }
      }
    }
  }
`


// Hide yellow warnings
console.disableYellowBox = true;

export class PendingOrdersScreen extends React.Component<any, any> {

  constructor(props) {
    super(props); 
    this.state = {
      orders: []
    }
 
    // Populate orders with all mock orders
    // this.state = {
    //   orders:[
    //     // mock_orders.order1,
    //     // mock_orders.order2,
    //     // mock_orders.order3,
    //     // mock_orders.order1,
    //     // mock_orders.order1,
    // ]}
  }

  async getOrders() {
    const orders : any = await client.query({
      query: GET_ORDER_STORE, 
    })
    // console.log(orders.data.vendor[0]);
    this.setState({orders: orders.data.vendor[0].orders});
    // console.log("State")
    // console.log(this.state)
  }
  
  /**
   * Function to get all orders associated with a particular vendor
   */
  // async getOrders() {
  //   const orders : any = await client.watchQuery({
  //     query: GET_ALL_ORDERS, 
  //     variables: {vendor_name: "Nicolas LLC"},
  //     pollInterval: 100
  //   }).subscribe({
  //     next: ({data}) => {this.setState({orders: data.vendor[0].orders});
  //    }
  //   })
  // }

  /**
   * Function to get information about the menuitems in the cart. This could be helpful in the future,
   * but for the proof of concept, after setting the state, it isn't used yet.
   */
  // async getMenuItems() {
  //   await this.getOrders();
  //   const menuItems = []
  //   this.state.orders.forEach(async (order) => {
  //     const menuItem = await client.query({
  //       query: GET_MENU_ITEM,
  //       // just getting first item in the order for proof of concept
  //       variables: {itemId: order.items[0].item.id}
  //     })
  //     menuItems.push(menuItem.data)
  //   })
  //   this.setState({firstMenuItemInOrder: menuItems})
  // }

  addToBatchHandler = () => {
    this.props.navigation.navigate("AddToBatch")
  }

  addToBatch = () =>{
    Alert.alert(
      'Add all the selected to batch?',
      '',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },

        {text: 'OK', onPress: () => console.log('OK Pressed')},

      ],

      {cancelable: true},
    );
 }

 componentDidMount() {
    this.getOrders();
    console.log("mountinggg");
 }
 
  render() {
    // console.log("The state");
    // console.log(this.state.orders);
    return (
      <View style={css.screen.paddedScreen}>
      
        <ScrollView>
      
        <OrderList orders={this.state.orders}/>
        </ScrollView>


        <View>
          <PrimaryButton
            title ="Add to Batch"
            onPress={this.addToBatch}
          />
          <SecondaryButton
            title ="Create Batch"
          />
        </View>

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
