import * as React from 'react'
import { View, Text, Button, StyleSheet, Modal, TouchableHighlight, Alert } from 'react-native';
import { inject, observer } from 'mobx-react';
import { RootStore } from '../../../stores/root-store';


interface AddToBatchScreenProps {
    // injected props
    rootStore?: RootStore;
  }


@inject("rootStore")
@observer
export class AddToBatchScreen extends React.Component<AddToBatchScreenProps, any> {

//   constructor(props) {
//     super(props) 
//     this.state = {
//       vendorInfo: "haven't fetched yet"
//     }
//   }

  render() {
      
    return (
        <View style={styles.container} >
          <Text>
            THIS IS THE Add to Batch Screen
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
    borderColor: "red", 
    borderWidth: 1
  }
})