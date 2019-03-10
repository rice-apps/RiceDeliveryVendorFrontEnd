import * as React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native';
import { Input } from "react-native-elements"
import { inject, observer } from 'mobx-react';
import * as css from "../../../style"
import PrimaryButton from '../../../../components/primary-button';

interface VendorInfoScreenProps {
    // injected props
    rootStore?: RootStore;
  }

@inject("rootStore")
@observer
export class VendorInfoScreen extends React.Component<VendorInfoScreenProps, any> {

  constructor(props) {
    super(props) 
    this.state = {
      vendorInfo: "haven't fetched yet"
    }
  }

  saveHandler = () => {
    
  }
  render() {
    return (
      <View style={[css.screen.defaultScreen, css.screen.padding]} >
        <Input
          placeholder="Vendor Name"
        />
        <Input
          placeholder="Vendor Name"
          
        />

        <PrimaryButton 
          title="Save Changes"
          onPress={this.saveHandler}
        />
      </View>

      )
  }
}


