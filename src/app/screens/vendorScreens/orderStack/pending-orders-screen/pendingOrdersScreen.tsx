
import * as React from 'react'
import { View, ScrollView, StyleSheet, Button, TextStyle, Alert, Text, RefreshControl} from 'react-native';
import { client } from '../../../../../app/main'

import gql from 'graphql-tag'
import * as css from "../../../style"
import * as componentCSS from "../../../../components/style"
import { OrderList } from "../../../../components/order-list"
import PrimaryButton from '../../../../components/primary-button.js'
import SecondaryButton from '../../../../components/secondary-button.js'

import { observer, inject } from 'mobx-react';
import LoadingScreen from '../../loading-screen';
// import { observable, action } from 'mobx';


// Hide yellow warnings.
console.disableYellowBox = true;

const Oview = observer(View)
const OScrollView = observer(ScrollView)

@inject("rootStore")
@observer
export class PendingOrdersScreen extends React.Component<any, any> {

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

  onRefresh = async() => {
    this.setState({refreshing: true})
    await this.props.rootStore.orders.queryOrders()
    this.setState({refreshing: false})

  }

  render() {
    console.log("DATA");
    console.log(this.props.rootStore.orders.pending);
    if (this.state.loading) {
      return <LoadingScreen /> 
    } else {
      return (
        <View style={css.screen.paddedScreen}>
          <ScrollView
            refreshControl={
              <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
                />
            }
          >
            <OrderList orders={this.props.rootStore.orders.pending}/>
          </ScrollView>
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
