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
import {material} from 'react-native-typography';
import gql from "graphql-tag";
import { Order } from "../../../../stores/order-store";

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


interface SingelOrderScreenProps {
  // injected props
  rootStore?: RootStore
}

@inject("rootStore")
@observer
export class SingleOrderScreen extends React.Component<SingelOrderScreenProps, any> {
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
    let order = await this.props.navigation.state.params.order
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
  }

  componentDidMount() {
    this.getOrderData();
  }

  componentWillUnmount() {
    console.log("Did unmount")
  }

  createUpdateOrderInput(order) {
    let vendorName = "East West Tea";
    let netID = order.netID;
    let orderID = order.id;
    let data = {"netID": netID, "vendorName": vendorName, "orderID": orderID};
    return data;
  }

  

  fulfillOrder(order) {
    console.log("fulfill order");
    let UpdateOrderInput = this.createUpdateOrderInput(order);
    this.props.rootStore.orders.fulfillOrder(UpdateOrderInput);
  }

  cancelWithoutRefund(order) {
    console.log("cacel order without refund");
    let UpdateOrderInput = this.createUpdateOrderInput(order);
    this.props.rootStore.orders.cancelWithoutRefund(UpdateOrderInput);
  }

  cancelWithRefund(order) {
    console.log("cacel order with refund");
    let UpdateOrderInput = this.createUpdateOrderInput(order);
    this.props.rootStore.orders.cancelWithRefund(UpdateOrderInput);
  }

  buttonLogic(order) {
    if (order.orderStatus.onTheWay === null) {
        return true;
    } else if ((order.orderStatus.fulfilled != null) || (order.orderStatus.refunded != null)) {
      return true;
    } else {
      return false;
    }
  }
 
  renderItems = ({item}) => {
    if (item.quantity) {
      return (
        <View>
          <Text style={material.body2}>
            {`${item.quantity}x ${item.description}`}
          </Text>
          <Text style={material.caption}>
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
    let order = this.props.navigation.state.params.order
    console.log("hereeeee");
    console.log(order);
    let status = this.getStatus();
    let location = order.location.name
    let date = this.getDate(order.created)
    let email = order.email
    let allItems = this.getItems();
    let name = order.customerName.split(" ")[0]
    let clicked = false;
    return (
      <View style={styleLocal.mainView}>
        <View style={styleLocal.header}>
          <Text style={[material.display3, {color: "black", fontSize: 30} ]}>{name}'s Order</Text>
          <Text style={[material.subheading, {color: "black", fontSize: 15}]}>{email + " | " + "Ordered on " + date}</Text>
        </View>
        <Divider />
        <View style={styleLocal.location}>
          <Text style={[material.display1, {paddingBottom: 4, color: "black", fontSize: 20}]}>Location: {location} </Text>
          <Text style={[material.display1, {paddingBottom: 4, color: "black", fontSize: 20}]}>Status: {status}</Text>
        </View>
        <View style={styleLocal.details}>
          
          <Text style={[material.display1, {paddingBottom: 4, color: "black", fontSize: 20}]}>Order Details</Text>
          <View style={styleLocal.listContainer}>
            <FlatList 
              data={this.state.order ? this.state.order.items : []}
              renderItem={this.renderItems}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
        <View style={styleLocal.buttons}>

          <SecondaryButton title = "Fulfill Order"  
            onPress = {() => this.fulfillOrder(order)}
            disabled = {this.buttonLogic(order)}
            />

          <PrimaryButton title = "Cancel Without Refund" 
            onPress = {() => this.cancelWithoutRefund(order)}
            disabled = {this.buttonLogic(order)}
            />

          <PrimaryButton title = "Refund the Order" 
            onPress = {() => this.cancelWithRefund(order)}
            disabled = {this.buttonLogic(order)}
            />

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
    padding: 10,


  }, 
  header: {
    // borderColor: "red",
    // borderWidth: 2,
    width: "100%",
    paddingBottom: 10,
  
    borderBottomColor: "grey",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  location: {
    // borderColor: "black",
    // borderWidth: 2,
    paddingBottom: 6,
    paddingTop: 6,
    width: "100%",
    borderBottomColor: "grey",
    borderBottomWidth: StyleSheet.hairlineWidth

  },
  details: {
    // borderColor: "blue",
    // borderWidth: 2,
    paddingBottom: 10,
    paddingTop: 10,
    width: "100%",
    borderBottomColor: "grey",
    borderBottomWidth: StyleSheet.hairlineWidth
  }, 
  buttons: {
    // borderColor: "green",
    // borderWidth: 2,
    width: "100%"

  },
  headerText: {
    fontSize: 16
  },
  listContainer: {
    width: "100%",
    paddingLeft: 5
  }
})