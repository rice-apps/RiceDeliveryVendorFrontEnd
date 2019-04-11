import * as React from "react"
import { View, Text, StyleSheet, FlatList, Alert, ScrollView } from "react-native"
import { inject, observer } from "mobx-react"
import { RootStore } from "../../../../stores/root-store"
import PrimaryButton from "../../../../components/primary-button"
import SecondaryButton from "../../../../components/secondary-button"
import { Divider } from "react-native-elements"
import { client } from "../../../../main"
import LoadingScreen from "../../loading-screen"
import { NavigationScreenProp } from 'react-navigation';
import {material} from 'react-native-typography';
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
interface SingelOrderScreenProps {
  // injected props
  rootStore?: RootStore,
  navigation: NavigationScreenProp<any, any>
}

@inject("rootStore")
@observer
export class SingleOrderScreen extends React.Component<SingelOrderScreenProps, any> {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      refreshing: false,
      order: [],
      status: "",
      fulfillButton: true,
      cancelButton: false,
      fulfillButtonTitle: "Notify customer order has arrived"
    }
  }



  /* ------------------------------- Initialize original states. ---------------------------------- */
  async componentDidMount() {

    let oldOrder = (this.props.navigation.getParam("order", "NO_ID"));
    let order = await this.props.rootStore.orders.querySingleOrder(oldOrder.id);
    if (order.orderStatus.arrived != null) { 
      this.setState({fulfillButtonTitle: "Fulfill Order"});
    }
    this.cancelButtonLogic(order);
    this.fulfillButtonLogic(order);
    this.getStatus(order);
    this.getOrderData();
  }

  componentWillUnmount() {
    console.log("Did unmount")
  }


  /* ---------------------- Used to display order data on the screen. ------------------------------- */
  getDate = dateInSecondsSinceUnixEpoch => {
    let date = new Date(dateInSecondsSinceUnixEpoch * 1000)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
    })
  }

  /**
   * Function to get order sku informaiton
   */
  getOrderData = async() => {
    let order = await this.props.navigation.state.params.order
    let newOrder = this.jsonCopy(order); // make a copy.
    for (let i = 0; i < newOrder.items.length; i++) {
      if (newOrder.items[i].parent &&  newOrder.items[i].parent.split(/_/)[0] == "sku") {
        let attributes = (client.query({
          query: GET_SKU, 
          variables: {
            "sku": newOrder.items[i].parent,
            "vendorName": "East West Tea"
          }
        }))
        newOrder.items[i].attributes = attributes
      }
    }
      for (let i = 0; i < newOrder.items.length; i++) {
        if (newOrder.items[i].parent &&  newOrder.items[i].parent.split(/_/)[0] == "sku") {
          newOrder.items[i].attributes = (await newOrder.items[i].attributes).data.sku.attributes.map(val => val.value)
        }
    }
    await this.setState({order: newOrder, loading: false});
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

  jsonCopy(src) {
    return JSON.parse(JSON.stringify(src));
  }

  getStatus = async (order) => {
    let status = order.orderStatus;
    if (status.refunded != null && status.unfulfilled === false) {
      this.setState({status: "Refunded"});    
    }
    else if (status.unfulfilled != false) {
      this.setState({status: "Canceled"});    
    }
    else if (status.fulfilled != null) {
      this.setState({status: "Fulfilled"});    
    }
    else if (status.arrived != null) {
      this.setState({status: "Arrived"});    
      this.setState({fulfillButtonTitle: "Fulfill Order"});
    }
    else if (status.onTheWay != null) {
      this.setState({status: "On The Way!"});    
    }
    else {
      this.setState({status: "Waiting to be delivered..."});    
    }
  }
  

  /* ------------------------- Functions used for the buttons to change backend.------------------------------- */
  createUpdateOrderInput(order) {
    let vendorName = "East West Tea";
    let netID = order.netID;
    let orderID = order.id;
    let data = {"netID": netID, "vendorName": vendorName, "orderID": orderID};
    return data;
  }

  async fulfillOrder(order) {
    console.log("fulfilling order");
    let UpdateOrderInput = this.createUpdateOrderInput(order);
    let newOrder = await this.props.rootStore.orders.fulfillOrder(UpdateOrderInput);
    await this.fulfillButtonLogic(newOrder);
    await this.getStatus(newOrder);
    Alert.alert("Order fulfilled")
  }

  async cancelWithoutRefund(order) {
    console.log("cacel order without refund");
    let UpdateOrderInput = this.createUpdateOrderInput(order);
    let newOrder = await this.props.rootStore.orders.cancelWithoutRefund(UpdateOrderInput);
    await this.cancelButtonLogic(newOrder);
    await this.getStatus(newOrder);
    Alert.alert("Order canceled without refund")

  }

  async cancelWithRefund(order) {
    console.log("cacel order with refund");
    let UpdateOrderInput = this.createUpdateOrderInput(order);
    let newOrder = await this.props.rootStore.orders.cancelWithRefund(UpdateOrderInput);
    await this.cancelButtonLogic(newOrder);
    await this.getStatus(newOrder);
    Alert.alert("Order canceled with refund")
  }

   async orderArrived(order) {
    console.log("orderArrived");
    let UpdateOrderInput = this.createUpdateOrderInput(order);
    let newOrder = await this.props.rootStore.orders.orderArrived(UpdateOrderInput);
    await this.fulfillButtonLogic(newOrder);
    await this.cancelButtonLogic(newOrder);
    await this.getStatus(newOrder);
    Alert.alert("Notified the user.")
  }

  disableAll = () => {
    this.setState({cancelButton: true});
    this.setState({fulfillButton: true});
  }

  functionAlert = (functype, order) => {
    Alert.alert(
      "Are you sure?",
      "",
      [
        {
          text: "Cancel",
          onPress: () => {
            this.cancelButtonLogic(order);
            this.fulfillButtonLogic(order);
            this.getStatus(order);
            console.log("canceled function")},
          style: "cancel",
        },
        { text: "Yes", onPress: () => {

          if (functype === 'NoRefund') {
            this.cancelWithoutRefund(order);
          } 
          else if (functype === "Refund") {
            this.cancelWithRefund(order);
          } 
          else if (functype === "Arrive") {
            this.orderArrived(order);
          } 
          else if (functype === "Fulfill") {
            this.fulfillOrder(order);
          }
        } },
      ],
      { cancelable: true },
    )
  }

  /* ------------------------ Handles button's reactiveness on the screen. ------------------------------- */
  async arrivedButtonLogic() {
    let oldOrder = (this.props.navigation.getParam("order", "NO_ID"));
    let order = await this.props.rootStore.orders.querySingleOrder(oldOrder.id);
    if (order.orderStatus.arrived != null) { 
      await this.functionAlert("Fulfill", order);
    }
    else {
      await this.functionAlert("Arrive", order);
    }
  }

  async fulfillButtonLogic(order) {
    // let oldOrder = (this.props.navigation.getParam("order", "NO_ID"));
    // let order = await this.props.rootStore.orders.querySingleOrder(oldOrder.id);
    if (order.orderStatus.onTheWay === null) {
        this.setState({fulfillButton: true});
        return true;
    } 
    else if ((order.orderStatus.fulfilled != null) || (order.orderStatus.refunded != null)) {
      this.setState({fulfillButton: true});
      return true;
    } 
    else {
      this.setState({fulfillButton: false});
      return false;
    }
  }

  async cancelButtonLogic(order) {
    // let oldOrder = (this.props.navigation.getParam("order", "NO_ID"));
    // let order = await this.props.rootStore.orders.querySingleOrder(oldOrder.id);
    if ((order.orderStatus.fulfilled != null) || (order.orderStatus.refunded != null)) {
      this.setState({cancelButton: true});
      return true;
    } 
    else {
      this.setState({cancelButton: false});
      return false;
    }
  }


   /* ------------------------------------ Render the screen. --------------------------------------------- */
  render() {
    if (this.state.loading) return <LoadingScreen />
    let order = (this.props.navigation.getParam("order", "NO_ID"));
    let detail = order.items[0].detail;
    let location = order.location.name
    let date = this.getDate(order.created)
    let email = order.email
    let name = order.customerName.split(" ")[0]
    return (
      <ScrollView contentContainerStyle={styleLocal.mainView}>
        <View style={styleLocal.header}>
          <Text style={[material.display3, {color: "black", fontSize: 20} ]}>{name}'s Order</Text>
          <Text style={[material.subheading, {color: "black", fontSize: 15}]}>{email + " | " + "Ordered on " + date}</Text>
        </View>
        <Divider />
        <View style={styleLocal.location}>
          <Text style={[material.display1, {flex: 1,  color: "black", fontSize: 20}]}>Location: {location} </Text>
          <Text style={[material.display1, {flex: 1, color: "black", fontSize: 20}]}>Status: {this.state.status}</Text>
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
          <Text style={[material.caption]}> {detail} </Text>
        </View>
        
  

        <View style={styleLocal.buttons}>


          <SecondaryButton 
            title = {this.state.fulfillButtonTitle}
            onPress = {async() => {
              this.disableAll();
              await this.arrivedButtonLogic();
            }}
            disabled = {this.state.fulfillButton}
            />

          <PrimaryButton title = "Cancel Without Refund" 
              onPress = {async() => {
                this.disableAll();
                await this.functionAlert('NoRefund', order)}
              } 
              disabled = {this.state.cancelButton}
            />

          <PrimaryButton title = "Refund the Order" 
            onPress = {async() => {
            this.disableAll();
            await this.functionAlert('Refund', order)}
            } 
            disabled = {this.state.cancelButton}
            />

        </View>
      </ScrollView>
    )
  }
}

const styleLocal = StyleSheet.create({
  mainView: {
    // justifyContent: "flex-start",
    // alignItems: "center",
    // flex: 1,
    padding: 10,
  }, 
  header: {
    // borderColor: "red",
    // borderWidth: 2,
    width: "100%",
    // paddingBottom: 10,
    flex: 1,
    borderBottomColor: "grey",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  location: {
    // borderColor: "black",
    // borderWidth: 2,
    // paddingBottom: 6,
    // paddingTop: 6,
    flex: 1,
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
    width: "50%",
    paddingLeft: 5,
    flex: 1
  }
})