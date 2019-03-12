import * as React from "react"
import { View, Text, Button, StyleSheet, FlatList } from "react-native"
import { inject, observer } from "mobx-react"
import { RootStore } from "../../../../stores/root-store"
import PrimaryButton from "../../../../components/primary-button"
import SecondaryButton from "../../../../components/secondary-button"
import { color } from "../../../../../theme"
import { Divider } from "react-native-elements"
import * as css from "../../../style"
import { client } from "../../../../main"
import LoadingScreen from "../../loading-screen"

const style = require("../../../style")

// interface SingleOrderScreenProps {
//     // injected props
//     rootStore?: RootStore;
//   }

@inject("rootStore")
@observer
export class SingleOrderScreen extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      refreshing: false,
    }
  }

  getDate = dateInSecondsSinceUnixEpoch => {
    let date = new Date(dateInSecondsSinceUnixEpoch * 1000)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
    })
  }

  getStatus = () => {
    let status = this.props.navigation.state.params.order.orderStatus
    if (status.unfulfilled) {
      return "Unfulfilled"
    } else if (status.fulfilled != null) {
      return "Fulfilled"
    } else if (status.onTheWay != null) {
      return "On The Way"
    } else {
      return "Pending"
    }
  }

  getItems = () => {
    let products = this.props.navigation.state.params.order.items

    // var item = products.reduce((c, {description ,amount}) => {
    //     c[description] = c[description] || {description, amount: 0};
    //     c[description]. amount +=  amount;
    //     return c;
    //   }, {})
  
    // var result = Object.values(item);
    // console.log(result)
  }

  render() {
    let order = this.props.navigation.state.params.order
    let status = this.getStatus()
    let location = order.location.name
    let date = this.getDate(order.created)
    let email = order.email
    let products = order.items
    let allItems = this.getItems()
    let name = order.customerName.split(" ")[0]
    // console.log(name)
    return (
      <View style={styleLocal.mainView}>
        <View style={styleLocal.header}>
          <Text style={css.text.headerText}>{name}'s Order</Text>
          <Text style={css.text.bodyText}>{"Email: " + email}</Text>
          <Text style={css.text.smallText}>{"Placed at : " + date}</Text>
        </View>
        <View style={styleLocal.location}>
          <Text style={css.text.bigBodyText}>Location: {location} </Text>
          <Text style={css.text.bigBodyText}>Status: {status}</Text>

        </View>
        <View style={styleLocal.details}>
        <Text style={css.text.bigBodyText}>Order Details</Text>
          {allItems}
        </View>
        <View style={styleLocal.buttons}>
          <PrimaryButton title="Cancel Order" />

          <SecondaryButton title="Fulfill Order" />
        </View>
      </View>
    )
  }
}

const styleLocal = StyleSheet.create({
  mainView: {
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10
  }, 
  header: {
    borderColor: "red",
    borderWidth: 2,
    width: "100%"
  },
  location: {
    borderColor: "black",
    borderWidth: 2,
    width: "100%"

  },
  details: {
    borderColor: "blue",
    borderWidth: 2,
    width: "100%"
  }, 
  buttons: {
    borderColor: "green",
    borderWidth: 2,
    width: "100%"

  },
  headerText: {
    fontSize: 30
  }
})