import * as React from 'react'
import { View, Text, Button } from 'react-native';
import { inject, observer } from 'mobx-react';
import { RootStore } from '../../../app/root-store';
import {   vendorQuery } from '../../../graphql/queries/vendorQueries'
import { client } from '../../../app/main'
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

  render() {
    return (
      <View>
        <Text>
        <Button
        onPress={this.vendorQuery}
        title="Find All Available Vendors"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
        />
          {JSON.stringify(this.props.rootStore.vendors)}
        </Text>

                <Text>
        <Button
        onPress={() => console.log('pressed')}
        title="Find All Orders"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
        />
        Existing orders
        </Text>
      </View>
    
      )
  }
}