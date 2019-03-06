
import * as React from 'react'
import { View, ScrollView, StyleSheet, Button, TextStyle, Alert, Text, RefreshControl} from 'react-native';
import { client } from '../../../../../app/main'

import gql from 'graphql-tag'
import * as css from "../../../style"
import * as componentCSS from "../../../../components/style"
import { OrderList } from "../../../../components/order-list"
import PrimaryButton from '../../../../components/primary-button'
import SecondaryButton from '../../../../components/secondary-button'
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
    await this.props.rootStore.orders.queryOrders(1)
    this.setState({
      loading: false 
    })
  }

  render() {
    if (this.state.loading) { return <LoadingScreen /> } 
      return (
        <View style={css.screen.paddedScreen}>
          <View style = {{flex: 1}}>
            <OrderList orders={getSnapshot(this.props.rootStore.orders.pending)}/>
          </View>
        </View>
        )
    

  }
}
