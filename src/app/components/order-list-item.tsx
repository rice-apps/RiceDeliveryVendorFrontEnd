import * as React from "react"
import { Text, View, StyleSheet, TouchableHighlight } from "react-native"
import { withNavigation } from "react-navigation"
import {Icon, Badge} from "react-native-elements"
import * as css from "./style"
import { observer, inject } from "mobx-react"
import { Order } from "../stores/order-store"
// Using temporary Order object instead of order-store Order object

@inject("rootStore")
@observer
class OrderListItem extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.singleOrderPress = this.singleOrderPress.bind(this)
  }

  componentWillMount() {}
  // Define action when pressing entire list item
  singleOrderPress = () => {
    this.props.navigation.navigate("SingleOrder", {
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
    let pending = this.props.order.orderStatus.pending; 
    let unfulfilled = this.props.order.orderStatus.unfulfilled; 
    if (unfulfilled != false) {
      return {badge: "error", text: "Unfulfilled"}
    }
    else if (fulfilled != null) {
      return {badge: "primary", text: "Fulfilled"}  
    }
    else if (onTheWay != null) {
      return {badge: "success", text: "On The Way!"}    
    }
    else {
      return {badge: "warning", text: "Waiting to be delivered..."}    
    }
  }

  renderIf = (cond, elem) => cond ? elem : null

  render() {
    return (
      <TouchableHighlight onPress={this.singleOrderPress}>
        <View style={[css.orderListItem.row, this.props.selected && css.orderListItem.activeItem]}>

        <View style={css.orderListItem.badge_cell}> 
          <Badge status = {this.badgeHandler().badge}>  </Badge>
          <Text style= {css.orderListItem.badge_text}> {this.badgeHandler().text} </Text>

        </View>

          <View style={css.orderListItem.row_cell}>
            <Text style={css.orderListItem.row_location}> {this.props.order.location.name} </Text>
            <Text style={css.orderListItem.row_name}> {this.props.order.customerName} </Text>
            <Text style={css.orderListItem.row_time}>
              {" "}
              Ordered at: {this.getDate(this.props.order.created)}
            </Text>
          </View>
          {
            this.renderIf(this.props.renderIcon,
              <Icon
              name={this.props.selected ? "remove" : "add"}
              type="material"
              size={this.props.selected ? 20 : 20}
              color="grey"
            reverse={false}
              raised={true}
              onPress={this.addOrderPress}
            />)
          }

        </View>
      </TouchableHighlight>
    )
  }
}

// Because this component is not a screen, it is not automatically passed the
// "navigation" prop, thus, we have to use this wrapper "withNavigation"
export default withNavigation(OrderListItem)
