import * as React from 'react'
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { inject, observer } from 'mobx-react';
import { RootStore } from '../../../../stores/root-store';
import PrimaryButton from '../../../../components/primary-button.js'
import SecondaryButton from '../../../../components/secondary-button.js'
import { color } from '../../../../../theme';
import { Divider } from 'react-native-elements';
import * as css from "../../../style"

const style = require("../../../style");

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
    var order = this.props.navigation.getParam('order', 'no_order_retrieved');

    if (order == 'no_order_retrieved') {
      console.log("Didn't find passed in order prop!");
    }

    var { firstName, lastName } = order.user;
    var { location, id } = order;
    var { pending, onTheWay, fulfilled } = order.status;

    // Fold all item names and quantities down to single string
    var items = order.items.reduce((accu, curr) => 
        accu + curr.item.itemName + " x" + curr.quantity.toString() + "  ", "");

    return (
      <View style={css.screen.defaultScreen}>
    
      <View style={styles.display}>
        <Text style={css.text.headerText}>
          Order ID: #{id}
        </Text>
        <Text style={css.text.smallText}>
          {'Placed at : ' + pending}
        </Text>

        <Divider style={css.screen.divider} />

        <Text style={css.text.bodyText}>
          {firstName + ' ' + lastName + '\'s order'}
        </Text>
        <Text style={css.text.bodyText}>
          {'Location : ' + location}
        </Text>
        <Text style={css.text.bodyText}>
          {'Status : ' + 'pending'}
        </Text>

        <Divider style={css.screen.divider} />

        <Text style={css.text.bigBodyText}>
          Order Details
        </Text>

        <View>
          <FlatList
                // style={}
                data= {order.items}
                keyExtractor={(item, index) => item.item.id.toString()}
                renderItem={({item}) => 
                    <Text style={styles.itemText}> 
                      {item.quantity.toString() + 'x ' + item.item.itemName}
                    </Text>
                }
              />
        </View>
      </View>

        <PrimaryButton
            title ="Cancel Order"
            onPress={this.loginHandler}
          />

          <SecondaryButton
            title ="Fulfill Order"
          />
      </View>
    
      )
  }
}

//We need to centralize these to be reusible/importable
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    // borderColor: "red", 
    // borderWidth: 1
  },
  display : {
    width : "100%",
    textAlign : "left",
    color: color.background,
    flex : 1,
    paddingTop : 20,
    paddingBottom : 20,
    paddingLeft : 10,
    paddingRight : 10,
  },
  headerText: {
    color: color.storybookTextColor,
    fontWeight: '800',
    fontSize: 40,
    paddingTop: 10,
  },
  bodyText: {
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 20,
    color: color.storybookTextColor,
  },
  bigBodyText: {
    paddingTop: 10,
    fontSize: 30,
    color: color.storybookTextColor,
  },
  divider : {
    backgroundColor : color.storybookDarkBg,
    height : 1,
  },
  itemText : {
    marginLeft : 10,
    fontSize: 15,
    paddingTop : 5,
    paddingBottom : 5,
  },
  smallText : {
    fontSize : 15,
    paddingBottom : 10,
  },
  itemView : { 
    // marginTop : 10,
    // backgroundColor : color.background,
  }
})
