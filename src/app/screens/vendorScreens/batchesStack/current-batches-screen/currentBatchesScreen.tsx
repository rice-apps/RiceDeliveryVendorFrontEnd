import * as React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native';
import { inject, observer } from 'mobx-react';
import { RootStore } from '../../../../stores/root-store';
// import { createStackNavigator, createAppContainer } from 'react-navigation';
import SecondaryButton from '../../../../components/secondary-button.js'

const style = require("../../../style");

import { 
  vendorQuery,
  GET_ALL_ORDERS
 } from '../../../../../graphql/queries/vendorQueries'
import { client } from '../../../../main'
interface CurrentBatchesScreenProps {
  // injected props
  rootStore?: RootStore;
}

@inject("rootStore")
@observer
export class CurrentBatchesScreen extends React.Component<CurrentBatchesScreenProps, any> {

  constructor(props) {
    super(props) 
    this.state = {
      vendor: "haven't fetched yet"
    }
  }

  vendorQuery: any = async (name) => {
    const response = await client.watchQuery({
      query: vendorQuery, 
      pollInterval: 100
    }).subscribe({
      next: ({data}: any) => {
        for (let i = 0; i < data.vendor.length; i++) {
          this.props.rootStore.addVendor(data.vendor[i])
        }
      } 
    })
  }

  // function to get all orders
  async getOrders() {
    const orders = await client.query({
      query: GET_ALL_ORDERS, 
      variables: {vendor_name: "Nicolas LLC"}
    })
    console.log(orders)
  }
  
  
  render() {
    return (
      <View style={style.defaultScreen} >
        <SecondaryButton
          title ="Create Batch"
        />
        <Button
          onPress={this.vendorQuery}
          title="Find All Available Vendors (doesn't work)"
          color="#841584"
          />
        <Text>
          {JSON.stringify(this.props.rootStore.vendors)}
        </Text>

        <Button
          
          onPress={() => this.props.navigation.navigate('OrderStack')}
          // onPress={this.getOrders}
          title="Find All Orders"
          color="#841584"
          />


        <Text>
          Existing orders
        </Text>
      </View>
    
      )
  }
}
