import * as React from 'react'
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { inject, observer } from 'mobx-react';
import { RootStore } from '../../../../stores/root-store';
import PrimaryButton from '../../../../components/primary-button.js'
import SecondaryButton from '../../../../components/secondary-button.js'

import * as css from "../../../style"

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
      <View style={css.screen.defaultScreen} >
        <ScrollView>
          <Text>
            View all previous orders!
          </Text>
        </ScrollView>
        <View style={{flexDirection: "row"}}>
          <PrimaryButton
            title ="Load More"
            style={{justifyContent: 'flex-start',}}
          />
          <SecondaryButton
            title ="Filter By"
            style={{justifyContent: 'flex-end',}}
          />
        </View>
        
      </View>
    
      )
  }
}


