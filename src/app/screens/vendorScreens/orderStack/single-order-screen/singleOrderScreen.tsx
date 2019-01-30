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
      <View style={styles.container}>
        <Text>
          Order ID: {/*replace this with some number*/}#98{"\n"}
          Placed at: {/*replace this with some date and time*/}1/12/19 10:30PM{"\n"}
        </Text>
         {/*This view below creates the horizontal line that separates things*/}
        <View style={{borderBottomColor: 'gray', borderBottomWidth: StyleSheet.hairlineWidth, width:"80%"}}/>
        <Text>
          Justin{/*replace this with someone's name*/}'s Order{"\n"}
          Location: {/*replace this with some location*/} Martel{"\n"}
          Status: {/*we need a custom status text component here*/} pending
        </Text>
        <View style={{borderBottomColor: 'gray', borderBottomWidth: StyleSheet.hairlineWidth, width:"80%"}}/>
        <Text>
          Order Details:{/*replace this with someone's name*/}{"\n"}
        </Text>
        <View style={{backgroundColor: "lightgray", width: "100%"}}>
          <Text>
            {/*replace this with acutal order info*/}
            1x Pizza, pepperoni, half{"\n"}
            1x Pizza, pepperoni, half{"\n"}
            1x Pizza, pepperoni, half{"\n"}
            1x Pizza, pepperoni, half{"\n"}
          </Text>
        </View>
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
    alignItems: "stretch", 
  }
})