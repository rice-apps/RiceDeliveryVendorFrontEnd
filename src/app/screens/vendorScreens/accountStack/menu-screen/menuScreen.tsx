import * as React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native';
import { inject, observer } from 'mobx-react';
import { RootStore } from "../../../../stores/root-store";
import PrimaryButton from '../../../../components/primary-button.js'


interface MenuScreenProps {
    // injected props
    rootStore?: RootStore;
  }

@inject("rootStore")
@observer
export class MenuScreen extends React.Component<MenuScreenProps, any> {

  constructor(props) {
    super(props) 
    this.state = {
      menu: "haven't fetched yet"
    }
  }
  
  // replace this with real menu from stripe
  render() {
    return (
      <View style={styles.container} >
        <Text>
          Make changes to your menu on your Stripe dashboard
        </Text>
        <PrimaryButton
          title ="Launch Stripe"
        />
        <Text>
        Current Menu:{"\n"}   Pizza{"\n"}   Banh Mi{"\n"}   Snacks{"\n"}   Drinks
        </Text>
      </View>
    
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: "flex-start", 
    alignItems: "center", 
  },
})