import * as React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { inject, observer } from 'mobx-react';
import { RootStore } from '../../../../stores/root-store';
import PrimaryButton from '../../../../components/primary-button.js'
import SecondaryButton from '../../../../components/secondary-button.js'


interface SingleOrderScreenProps {
    // injected props
    rootStore?: RootStore;
  }

@inject("rootStore")
@observer
export class SingleOrderScreen extends React.Component<SingleOrderScreenProps, any> {

  constructor(props) {
    super(props) 
    this.state = {
      order: "haven't fetched yet"
    }
  }

  render() {
    return (
      <View style={styles.container} >

    
        <Text>
          THIS IS THE SINGLE ORDER SCREEN.
        </Text>
        <PrimaryButton
            title ="Cancel Order"
          />
        <SecondaryButton
          title ="Fulfill Order"
        />
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