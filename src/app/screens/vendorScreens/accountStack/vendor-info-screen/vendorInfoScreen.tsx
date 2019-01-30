import * as React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native';
import { inject, observer } from 'mobx-react';
import { RootStore } from '../../../stores/root-store';


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
      <View style={styles.container} >
        <Text>
          THIS IS THE VENDOR INFO SCREEN.
        </Text>
      </View>
    
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
  }
})