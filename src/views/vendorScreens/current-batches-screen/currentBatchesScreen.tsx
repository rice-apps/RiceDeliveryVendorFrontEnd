import * as React from 'react'
import { View, Text, Button } from 'react-native';
import { inject, observer } from 'mobx-react';
import { RootStore } from '../../../app/root-store';
import { vendorQuery } from '../../../graphql/queries'
import { GRAPHQL_API } from '../../../services/api';

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
    const response: any = await GRAPHQL_API.post(
      '',
      vendorQuery
    )
    const vendors = response.data.data.vendor
    console.log("response", vendors)
    for (let i = 0; i < vendors.length; i++) {
      this.props.rootStore.addVendor(vendors[i].name)
    }
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
      </View>
    
      )
  }
}