import * as React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native';
import { inject, observer } from 'mobx-react';
import { RootStore } from '../../../../stores/root-store';


interface TransactionHistScreenProps {
    // injected props
    rootStore?: RootStore;
  }

@inject("rootStore")
@observer
export class TransactionHistScreen extends React.Component<TransactionHistScreenProps, any> {

  constructor(props) {
    super(props) 
    this.state = {
      transaction: "haven't fetched yet"
    }
  }

  render() {
    return (
      <View style={styles.container} >
        <Text>
          THIS IS THE TransactionHistScreen
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