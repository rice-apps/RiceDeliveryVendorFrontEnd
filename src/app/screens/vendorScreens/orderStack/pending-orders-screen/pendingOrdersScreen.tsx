
import * as React from 'react'
import { View, ScrollView, StyleSheet, Button, TextStyle, Alert, Text, RefreshControl} from 'react-native';
import { client } from '../../../../../app/main'

import gql from 'graphql-tag'
import * as css from "../../../style"
import * as componentCSS from "../../../../components/style"
import { OrderList } from "../../../../components/order-list"
import PrimaryButton from '../../../../components/primary-button.js'
import SecondaryButton from '../../../../components/secondary-button.js'
import { toJS } from 'mobx';

import { observer, inject } from 'mobx-react';
import { getSnapshot } from 'mobx-state-tree';

import LoadingScreen from '../../loading-screen';
import { RootStore } from '../../../../stores/root-store';
import { NavigationScreenProp } from 'react-navigation';
// import { observable, action } from 'mobx';


// Hide yellow warnings.
console.disableYellowBox = true;
interface pendingOrderProps {
  rootStore: RootStore,
  navigation: NavigationScreenProp<any, any>
}

const GET_ORDER_STORE = gql`
  query queryOrders {
    order(vendorName: "The Hoot") {
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
      location {
        _id
        name
      }
    }
    
  }

`
@inject("rootStore")
@observer
export class PendingOrdersScreen extends React.Component<pendingOrderProps, any> {

  constructor(props) {
    super(props); 
    this.state = {
      loading: true, 
      refreshing: false
    }
  }


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
    await this.props.rootStore.orders.queryOrders()
    this.setState({
      loading: false 
    })
  }

  render() {
    if (this.state.loading) {
      return <LoadingScreen /> 
    } else {
      console.log("render")
      // console.log(pendingOrde/rs.toJS().length)
      return (
        <View style={css.screen.paddedScreen}>
          <View>
            <OrderList orders={getSnapshot(this.props.rootStore.orders.pending)}/>
          </View>
          <View style={componentCSS.containers.batchContainer}>
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
}
