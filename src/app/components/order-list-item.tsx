import * as React from 'react'
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as css from "./style";
import { observer, inject } from 'mobx-react';
import { Order } from '../stores/order-store';
// Using temporary Order object instead of order-store Order object


@inject("rootStore")
@observer
class OrderListItem extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.singleOrderPress = this.singleOrderPress.bind(this);
    }
    
    componentWillMount() {
    }
    
    // Define action when pressing entire list item
    singleOrderPress = () => {
        this.props.navigation.navigate('SingleOrder', {
            // order : this.props.order,
            order : this.props
        }); 
    }

    getDate = (dateInSecondsSinceUnixEpoch) => {
        // let date = new Date(dateInSecondsSinceUnixEpoch)
        let date = new Date(dateInSecondsSinceUnixEpoch * 1000)
        return date.toLocaleDateString("en-US", {weekday: "short", hour: "numeric", minute: "numeric"})
    }

    // Define action when pressing "plus" button
    addOrderPress() {
        // console.log("Trying to add order");
    }
    
    render() {
        
        return (
            <TouchableHighlight onPress={this.singleOrderPress}>
                <View style={css.orderListItem.row}>
                    <View style={css.orderListItem.row_cell}>
                        <Text style={css.orderListItem.row_location}> {this.props.order.location} </Text>
                        <Text style={css.orderListItem.row_name}> {this.props.order.id}</Text>
                        <Text style={css.orderListItem.row_time}> {this.getDate(this.props.order.created)}</Text> 
                    </View>
                    <TouchableHighlight onPress={this.addOrderPress}>
                        <Icon name="add" size={50} color="black" />
                    </TouchableHighlight>
                    
                </View>
            </TouchableHighlight>
        )
    }
}

// Because this component is not a screen, it is not automatically passed the 
// "navigation" prop, thus, we have to use this wrapper "withNavigation"
export default withNavigation(OrderListItem);


