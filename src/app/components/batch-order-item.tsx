import * as React from "react"
import { Text, View, TouchableOpacity, StyleSheet } from "react-native"
import { withNavigation } from "react-navigation"
import {Icon , Badge, withBadge } from "react-native-elements"
import * as css from "./style"
import { observer, inject } from "mobx-react"
import { color } from "../../theme";

// Using temporary Order object instead of order-store Order object

@inject("rootStore")
@observer
class BatchOrderListItem extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.singleOrderPress = this.singleOrderPress.bind(this)
  }

  componentDidMount() {
    console.log("mounting");
  }
  componentWillMount() {
    console.log("refresh again");
  }

  componentWillUnmount() {
    console.log("comp umounted");
  }
  // Define action when pressing entire list item
  singleOrderPress = () => {
    this.props.navigation.navigate("SingleBatchOrder", {
      // order : this.props.order,
      order: this.props.order,
    })
  }

  getDate = dateInSecondsSinceUnixEpoch => {
    let date = new Date(dateInSecondsSinceUnixEpoch * 1000)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
    })
  }


  // Define action when pressing "plus" button
  addOrderPress = () => {
    this.props.onPressItem(this.props.order.id)
  }

  badgeHandler =  () => {
    let fulfilled = this.props.order.orderStatus.fulfilled;
    let onTheWay = this.props.order.orderStatus.onTheWay;
    let unfulfilled = this.props.order.orderStatus.unfulfilled;
    let refunded = this.props.order.orderStatus.refunded;
    let arrived = this.props.order.orderStatus.arrived;
 
    if (refunded !== null && unfulfilled === false) {
      return {color: "red", text: "Refunded"}
    }
    else if (unfulfilled !== false) {
      return {color: "red", text: "Canceled"}
    }
    else if (fulfilled !== null) {
      return {color: "gray", text: "Fulfilled"}  
    }
    else if (arrived !== null) {
      return {color: "lightblue", text: "Arrived"}
    }
    else if (onTheWay !== null) {
      return {color: "green", text: "On The Way!"}    
    }
    else {
      return {color: "orange", text: "Waiting to be delivered..."}    
    }
    
  }

  itemOnTheWay =  () => {
    let fulfilled = this.props.order.orderStatus.fulfilled;
    let onTheWay = this.props.order.orderStatus.onTheWay;
    let unfulfilled = this.props.order.orderStatus.unfulfilled;
    let refunded = this.props.order.orderStatus.refunded;
    let arrived = this.props.order.orderStatus.arrived;

    if (refunded === null && unfulfilled === false && fulfilled === null && arrived === null && onTheWay !== null
        || (refunded === null && unfulfilled === false && fulfilled === null && arrived !== null)) {
        return true
    } 
    return false
  }

  render() {
    let itemOnTheWay = this.itemOnTheWay()
    return (
      <TouchableOpacity onPress={this.singleOrderPress}>
      
        <View style={[styleLocal.row, this.props.selected && css.orderListItem.activeItem]}>
          <View style={css.orderListItem.badge_cell}> 

            <Badge badgeStyle = {{backgroundColor: this.badgeHandler().color}}>  </Badge>
            <Text style= {css.orderListItem.badge_text}> {this.badgeHandler().text} </Text>

          </View>
          <View style={[css.orderListItem.row_cell]}>
            <Text style={css.orderListItem.row_location}> {this.props.order.location.name} </Text>
            <Text style={css.orderListItem.row_name}> {this.props.order.customerName} </Text>
            <Text style={css.orderListItem.row_time}>
              {" "}
              Ordered at: {this.getDate(this.props.order.created)}
            </Text>
          </View>
        {
          !itemOnTheWay && 
            <Icon
            name={this.props.selected ? "remove" : "add"}
            type="material"
            size={this.props.selected ? 28 : 28}
            color="grey"
          reverse={false}
            raised={true}
            onPress={this.addOrderPress}
          />
        }
        {
          itemOnTheWay && <View style={{paddingRight: 80}}></View>
        }
        </View>
      </TouchableOpacity>
    )
  }
}

// Because this component is not a screen, it is not automatically passed the
// "navigation" prop, thus, we have to use this wrapper "withNavigation"
export default withNavigation(BatchOrderListItem)

const styleLocal = StyleSheet.create({
  row: {
    elevation: 1,
    backgroundColor: color.background,
    flex: 1,
    flexDirection: "row", // main axis
    justifyContent: "flex-start", // main axis
    alignItems: "center", // cross axis
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 5,
    borderWidth: 1,
    height: 80,
    borderColor: "#fff",
  },
})