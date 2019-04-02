import * as React from "react"
import { Text, View, StyleSheet, TouchableHighlight } from "react-native"
import { withNavigation } from "react-navigation"
import {Icon} from "react-native-elements"
import * as css from "./style"
import { observer, inject } from "mobx-react"
import { Order } from "../stores/order-store"
// Using temporary Order object instead of order-store Order object

@inject("rootStore")
@observer
class BatchOrderListItem extends React.Component<any, any> {
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

  render() {
    console.log(this.props.order)
    return (
      <TouchableHighlight onPress={this.singleOrderPress}>
        <View style={[css.orderListItem.row, this.props.selected && css.orderListItem.activeItem]}>
          <View style={css.orderListItem.row_cell}>
            <Text style={css.orderListItem.row_location}> {this.props.order.location.name} </Text>
            <Text style={css.orderListItem.row_name}> {this.props.order.customerName} </Text>
            <Text style={css.orderListItem.row_time}>
              {" "}
              Ordered at: {this.getDate(this.props.order.created)}
            </Text>
          </View>
          <Icon
            name={this.props.selected ? "remove" : "add"}
            type="material"
            size={this.props.selected ? 20 : 20}
            color="grey"
          reverse={false}
            raised={true}
            onPress={this.addOrderPress}
          />
        </View>
      </TouchableHighlight>
    )
  }
}

// Because this component is not a screen, it is not automatically passed the
// "navigation" prop, thus, we have to use this wrapper "withNavigation"
export default withNavigation(BatchOrderListItem)