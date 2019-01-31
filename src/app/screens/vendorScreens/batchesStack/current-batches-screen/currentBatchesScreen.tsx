import * as React from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { inject, observer } from 'mobx-react';
import { RootStore } from '../../../../stores/root-store';
// import { createStackNavigator, createAppContainer } from 'react-navigation';
import SecondaryButton from '../../../../components/secondary-button.js';
import { Batch, mock_batches } from '../../../../components/temporary-mock-order';
// Using mock interfaces from temp file

const style = require("../../../style");

import { vendorQuery, GET_ALL_ORDERS } from '../../../../../graphql/queries/vendorQueries'
import { client } from '../../../../main'
import { BatchList } from '../../../../components/batch-list';
import * as css from "../../../style"

interface CurrentBatchesScreenProps {
  // injected props
  rootStore?: RootStore;
  batches : Batch[],
}

@inject("rootStore")
@observer
export class CurrentBatchesScreen extends React.Component<CurrentBatchesScreenProps, any> {

  constructor(props) {
    super(props) 
    this.state = {
      vendor: "haven't fetched yet",
      batches : mock_batches,
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
      <View style={css.screen.paddedScreen} >

        {/* <Button
          onPress={this.vendorQuery}
          title="Find All Available Vendors (doesn't work)"
          color="#841584"
          /> */}
        {/* <Text>
          {JSON.stringify(this.props.rootStore.vendors)}
        </Text> */}

        <View style={css.flatlist.container}>
          <FlatList
                data={[
                  mock_batches.batch1,
                  mock_batches.batch2,
                ]}
                keyExtractor={(item, index) => item.batchNumber.toString()}
                renderItem={({item}) => 
                    <BatchList batch={item}></BatchList>
                }
              />
          {/* <BatchList batch={mock_batches.batch1}/> */}

        </View>
        <SecondaryButton title="Create Batch"/>

      </View>
    
      )
  }
}

