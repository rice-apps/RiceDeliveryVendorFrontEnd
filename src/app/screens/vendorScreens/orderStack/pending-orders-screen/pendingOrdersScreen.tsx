
import * as React from 'react'
import { View, ScrollView, StyleSheet, Button, TextStyle, Alert, Text} from 'react-native';
import { client } from '../../../../../app/main'

import gql from 'graphql-tag'
import * as css from "../../../style"
import { OrderList } from "../../../../components/order-list"
import PrimaryButton from '../../../../components/primary-button.js'
import SecondaryButton from '../../../../components/secondary-button.js'

import { observer, inject } from 'mobx-react';
// import { observable, action } from 'mobx';

// Query info for the orderStore.
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


// Hide yellow warnings.
console.disableYellowBox = true;

@inject("rootStore")
@observer
export class PendingOrdersScreen extends React.Component<any, any> {

  constructor(props) {
    super(props); 
    this.state = {
      orders: []
    }
  }

  // async getOrders() {
  //   const orders : any = await client.query({
  //     query: GET_ORDER_STORE, 
  //   })

  //   // Sets this page's state.
  //   this.setState({orders: orders.data.vendor[0].orders});
  // }


  addToBatchHandler = () => {
    this.props.navigation.navigate("AddToBatch")
  }

  // Makes alert box when add to batch is clicked.
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

async componentWillMount() {
    this.setState({
      orders: await this.props.rootStore.orders.queryOrders()
    })
 }

  render() {
    return (
      <View style={css.screen.paddedScreen}>

        <ScrollView>
          <Text>
            {this.props.rootStore.orders.pending.length > 0 ?
              this.props.rootStore.orders.pending.length : 0 }
          </Text>
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


}
