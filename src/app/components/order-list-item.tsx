import * as React from 'react'
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native';
// import { ListItem } from 'react-native-elements';
import { color, typography } from '../../theme';
import { withNavigation } from 'react-navigation';

import Order from './temporary-mock-order';
// import { Order } from "../stores/order-store"
// Using temporary Order object instead of order-store Order object

interface OrderListItemProps {
    order : Order
}

class OrderListItem extends React.Component<OrderListItemProps, any> {
    constructor(props) {
        super(props);
        this.onPress = this.onPress.bind(this);
    }

    onPress() {
        this.props.navigation.navigate('SingleOrder'); 
    }
    
    render() {
        var { firstName, lastName } = this.props.order.user;
        var { location } = this.props.order;
        var { pending, onTheWay, fulfilled } = this.props.order.status;

        // Fold all item names and quantities down to single string
        // actually, don't need to display order items, but still keeping this line
        var items = this.props.order.items.reduce((accu, curr) => 
            accu + curr.item.itemName + " x" + curr.quantity.toString() + "  ", "");

        return (
                <View style={styles.row}>
                    <View style={styles.row_cell}>
                        <Text style={styles.row_location}> {location} </Text>
                        <Text style={styles.row_name}> {firstName + ' ' + lastName}</Text>
                        <Text style={styles.row_time}> {pending}</Text>
                    </View>
                    <TouchableHighlight
                        // style={styles.button}
                        onPress={this.onPress}
                        >
                        <Text> Touch Here </Text>
                    </TouchableHighlight>
                </View>
        )
    }
}

// Because this component is not a screen, it is not automatically passed the "navigation" prop,
// thus, we have to use this wrapper "withNavigation"
export default withNavigation(OrderListItem);

const styles = StyleSheet.create({
    row: {
        elevation: 1,
        borderRadius: 2,
        backgroundColor: color.background,
        flex: 1,
        flexDirection: 'row',  // main axis
        justifyContent: 'flex-start', // main axis
        alignItems: 'center', // cross axis
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 18,
        paddingRight: 16,
        marginLeft: 14,
        marginRight: 14,
        marginTop: 7,
        marginBottom: 7,
      },
      row_cell: {
        flex: 1,
        flexDirection: 'column',
      },
      row_location: {
        color: color.storybookTextColor,
        textAlignVertical: 'top',
        includeFontPadding: false,
        flex: 0,
        fontSize: 40,
        fontFamily: typography.primary,
      },
      row_name: {
        color: color.storybookTextColor,
        // textAlignVertical: 'bottom',
        includeFontPadding: false,
        flex: 0,
        fontSize: 20,
        fontFamily: typography.primary,
      },
      row_time: {
        color: color.storybookTextColor,
        textAlignVertical: 'bottom',
        // textAlign:'center',
        includeFontPadding: false,
        flex: 0,
        fontSize: 10,
        fontFamily: typography.primary,
      },
})