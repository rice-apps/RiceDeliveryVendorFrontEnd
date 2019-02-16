import * as React from 'react'
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Order from './temporary-mock-order';
import * as css from "./style";
import { observer, inject } from 'mobx-react';

// Using temporary Order object instead of order-store Order object


interface OrderListItemProps {
    order : Order
}

@inject("rootStore")
@observer
class OrderListItem extends React.Component<OrderListItemProps, any> {
    constructor(props) {
        super(props);
        this.singleOrderPress = this.singleOrderPress.bind(this);
    }
    
    componentWillMount() {
        console.log(this.props);
    }
    
    // Define action when pressing entire list item
    singleOrderPress() {
        this.props.navigation.navigate('SingleOrder', {
            // order : this.props.order,
            order : this.props

        }); 
    }

    // Define action when pressing "plus" button
    addOrderPress() {
        console.log("Trying to add order");
    }
    
    render() {
        console.log("This order:", this.props.order);
        // let { }
        // let { firstName, lastName } = this.props.order.user;
        // let location = (this.props.order.location) ? this.props.order.location.name : "";
        // let { location } = this.props.order.location;
        // let { pending, onTheWay, fulfilled } = this.props.order.orderStatus ;


        let  id  = this.props.order.id;

        // Fold all item names and quantities down to single string
        // actually, don't need to display order items, but still keeping this line 
        // cus one-liners are dope.
        // let items = this.props.order.items.reduce((accu, curr) => 
        //     accu + curr.item.itemName + " x" + curr.quantity.toString() + "  ", "");

        return (
            <TouchableHighlight onPress={this.singleOrderPress}>
                <View style={css.orderListItem.row}>
                    <View style={css.orderListItem.row_cell}>
                        <Text style={css.orderListItem.row_name}> {"sth"} </Text>

                        {/* <Text style={css.orderListItem.row_location}> {location} </Text> */}
                        {/* <Text style={css.orderListItem.row_name}> {firstName + ' ' + lastName}</Text> */}
                        {/* <Text style={css.orderListItem.row_time}> {pending}</Text>  */}

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


