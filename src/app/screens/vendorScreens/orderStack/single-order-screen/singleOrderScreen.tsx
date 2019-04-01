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
import { NavigationEvents } from 'react-navigation';
import gql from "graphql-tag";

const GET_SKU = gql`
query skus($sku:String!, $vendorName: String!) {
  sku(sku:$sku, vendorName:$vendorName) {
    id
    image
    attributes {
      key
      value
    }
    active
    
  }
}
`
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
      order: []
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
  }

  jsonCopy(src) {
    return JSON.parse(JSON.stringify(src));
  }
  /**
   * Function to get order sku informaiton
   */
  getOrderData = async() => {
    let order = this.props.navigation.state.params.order
    let newOrder = this.jsonCopy(order); // make a copy.
    for (let i = 0; i < newOrder.items.length; i++) {
      if (newOrder.items[i].parent &&  newOrder.items[i].parent.split(/_/)[0] == "sku") {
        let attributes = (await client.query({
          query: GET_SKU, 
          variables: {
            "sku": newOrder.items[i].parent,
            "vendorName": "East West Tea"
          }
        })).data.sku.attributes.map(val => val.value);
        newOrder.items[i].attributes = attributes
      }
    }
    await this.setState({order: newOrder, loading: false});
    console.log("FINISHED")
  }

  componentDidMount() {
    console.log("Did mount")
    this.getOrderData();
  }

  componentWillUnmount() {
    console.log("Did unmount")
  }

  renderItems = ({item}) => {
    if (item.quantity) {
      return (
        <View>
          <Text>
            {`${item.quantity}x ${item.description}`}
          </Text>
          <Text>
            {item.attributes.join(" ")}
          </Text>
        </View>

      )
    } else {
      return null
    }
  }

  render() {
    if (this.state.loading) return <LoadingScreen />
    console.log("render")
    let order = this.props.navigation.state.params.order
    let status = this.getStatus()
    let location = order.location.name
    let date = this.getDate(order.created)
    let email = order.email
    let allItems = this.getItems();
    let name = order.customerName.split(" ")[0]
    return (
      <View style={styleLocal.mainView}>
        <View style={styleLocal.header}>
          <Text style={css.text.headerText}>{name}'s Order</Text>
          <Text style={css.text.bodyText}>{" " + email}</Text>
          <Text style={css.text.smallText}>{" Ordered on " + date}</Text>
        </View>
        <View style={styleLocal.location}>
          <Text style={css.text.bigBodyText}>Location: {location} </Text>
          <Text style={css.text.bigBodyText}>Status: {status}</Text>

        </View>
        <View style={styleLocal.details}>
        <Text style={css.text.bigBodyText}>Order Details</Text>
        <FlatList 
          data={this.state.order ? this.state.order.items : []}
          renderItem={this.renderItems}
          keyExtractor={(item, index) => index.toString()}
        />
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