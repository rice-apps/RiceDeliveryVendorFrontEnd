import * as React from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { inject, observer } from 'mobx-react';
import { RootStore } from '../../../../stores/root-store';
// import { createStackNavigator, createAppContainer } from 'react-navigation';
import SecondaryButton from '../../../../components/secondary-button';
import { Batch, mock_batches } from '../../../../components/temporary-mock-order';
// Using mock interfaces from temp file

const style = require("../../../style");

import { vendorQuery, GET_ALL_ORDERS } from '../../../../../graphql/queries/vendorQueries'
import { client } from '../../../../main'
import { BatchList } from '../../../../components/batch-list';
import * as css from "../../../style"
import LoadingScreen from '../../loading-screen';

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
      isLoading: true
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

  async componentWillMount() {
    await this.props.rootStore.orders.getBatches()
    this.setState({isLoading: false})
  }
  
  render() {
    if (this.state.isLoading) {
      return <LoadingScreen />
    } else {
      return (
        <View style={css.screen.paddedScreen} >
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
}

