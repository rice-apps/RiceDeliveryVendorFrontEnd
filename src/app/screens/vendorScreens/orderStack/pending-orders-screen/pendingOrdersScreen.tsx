
import * as React from 'react'
import { View, ScrollView, Text, FlatList, StyleSheet, Button, ViewStyle, TextStyle, SafeAreaView} from 'react-native';
import { 
  GET_ALL_ORDERS
 } from '../../../../../graphql/queries/vendorQueries'
 import { client } from '../../../../../app/main'

import gql from 'graphql-tag'

import { OrderList } from "../../../../components/order-list"
import PrimaryButton from '../../../../components/primary-button.js'
import SecondaryButton from '../../../../components/secondary-button.js'


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

    // Mock orders state
    this.state = {orders:[
      this.mock_order,
      this.mock_order,
      this.mock_order,
      this.mock_order,
      this.mock_order,
      this.mock_order,
      this.mock_order,
      this.mock_order,
    ]}
  }

  mock_order = {
    id : 696969,
    user : {
      firstName : "Jonathan",
      lastName : "Cai",
    },
    status : {
      pending : "yep",
      onTheWay: "nope", 
      fulfilled: "nah", 
      unfulfilled: false,
    }, 
    location : "Jones",
    items : [
      { item : {
        "itemName" : "fuck",
        },
        quantity : 2,
      },
      { item : {
        "itemName" : "shit",
        },
        quantity : 4,
      },
      { item : {
        "itemName" : "goddamn",
        },
        quantity : 1,
      },
    ],
  }
  
  /**
   * Function to get all orders associated with a particular vendor
   */
  async getOrders() {
    const orders : any = await client.watchQuery({
      query: GET_ALL_ORDERS, 
      variables: {vendor_name: "Nicolas LLC"},
      pollInterval: 100
    }).subscribe({
      next: ({data}) => {this.setState({orders: data.vendor[0].orders});
     }
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
    this.setState({firstMenuItemInOrder: menuItems})
  }

  render() {
    console.log(this.state.orders)
    return (
      <View style={{flex:1}}>
        <ScrollView>
          <Button
            onPress={() => this.props.navigation.navigate('SingleOrder')}
            // onPress={this.getOrders}
            title="Order 1"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
            />   
        <OrderList orders={this.state.orders}/>
        </ScrollView>
        <View>
          <PrimaryButton
            title ="Add to Batch"
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

// styles that define how the text is displayed
// const styles = StyleSheet.create({
//   container: {
//    flex: 1,
//    justifyContent: "center", 
//    alignItems: "center"
//   },
//   item: {
//     padding: 10,
//     fontSize: 18,
//     height: 44,
//   },
//   small: {
//     paddingLeft: 10,
//     fontSize: 14,
//     height: 24,
//   }, 
//   flatList: {
//     width: "100%"
//   }
// })

// OLD RETURN VALUE IN RENDER FUNC:
      // <View style={styles.container}>
      //   <FlatList
      //   style={styles.flatList}
      //   data= {this.state.orders}
      //   renderItem={({item}) => 
      //   <View style={{flexDirection: 'row'}}>
      //       {/* <View>
      //         <Text style={styles.item}>{item.user.firstName + " " + item.user.lastName +"'s Order"}</Text>
      //         <Text style={styles.small}>{"On The Way Status: " + item.status.pending}</Text>
      //       </View>
      //       <Button
      //         onPress= {() => this.changeStatusToOnTheWay(item._id)}
      //         title="On The Way!"
      //       /> */}
      //   </View>
      // }
      //   />
      // </View>
      // )
