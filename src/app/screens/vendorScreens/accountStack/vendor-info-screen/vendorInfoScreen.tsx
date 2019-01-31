import * as React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native';
import { inject, observer } from 'mobx-react';
import { RootStore } from '../../../stores/root-store';
import * as css from "../../../style"

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

  render() {
    return (
      <View style={css.screen.defaultScreen} >
        <Text>
          THIS IS THE VENDOR INFO SCREEN.
        </Text>
      </View>
    
      )
  }
}


