import * as React from 'react'
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { inject, observer } from 'mobx-react';
import { RootStore } from '../../../../stores/root-store';
import PrimaryButton from '../../../../components/primary-button.js'
import SecondaryButton from '../../../../components/secondary-button.js'
import { color } from '../../../../../theme';
import { Divider } from 'react-native-elements';
import * as css from "../../../style"
import { client } from '../../../../main';
import LoadingScreen from '../../loading-screen';

const style = require("../../../style");

// interface SingleOrderScreenProps {
//     // injected props
//     rootStore?: RootStore;
//   }

@inject("rootStore")
@observer
export class SingleOrderScreen extends React.Component<any, any> {

  constructor(props) {
    super(props); 
    this.state = {
      loading: true, 
      refreshing: false,
    }
  }

  getDate = (dateInSecondsSinceUnixEpoch) => {
    let date = new Date(dateInSecondsSinceUnixEpoch * 1000)
    return date.toLocaleDateString("en-US", 
        {weekday: "short", hour: "numeric", minute: "numeric"})
}

  render() {
    console.log("singleorder")
    console.log(this.props.navigation.state.params.order);
    let order  = this.props.navigation.state.params.order;
    let id  = order.id;
    let date = this.getDate(order.created);
    let email = order.email;
    let food1 = order.items[0].description;

    return (
      <View style={css.screen.defaultScreen}>
    
      <View style={css.view.display}>
    
        <Text style={css.text.headerText}>
          Order ID: #{id}
        </Text>}

        <Text style={css.text.smallText}>
          {'Placed at : ' + date}
        </Text> 

        <Text style={css.text.bodyText}>
          {'Contact info : ' + email}
        </Text>
        
        <Divider style={css.screen.divider} />

        <Text style={css.text.bigBodyText}>
          Order Details
        </Text>

        <Divider style={css.screen.divider} />

        <Text style={css.text.bodyText}>
          {'Food: ' + food1}
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

