import * as React from 'react'
import { View, Text, Button, StyleSheet, Modal, TouchableHighlight, Alert } from 'react-native';
import { inject, observer } from 'mobx-react';
import { RootStore } from '../../../stores/root-store';

const style = require("../../../style");

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
        <View style = {style.defaultScreen}>
          <Text>
            THIS IS THE Add to Batch Screen
          </Text>
        </View>
        )
    }
}

