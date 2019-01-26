import * as React from 'react'
import { Text, FlatList, StyleSheet, Button, ViewStyle, TextStyle, SafeAreaView} from 'react-native';
import { ListItem } from 'react-native-elements';
// import { Order } from "../stores/order-store"

// Not using above Order model, but using below
// Mock interface for orders
export interface Order {
    id : number
    user : {
        firstName : string,
        lastName : string,
    },
    status : {
        pending : string,
        onTheWay: string, 
        fulfilled: string, 
        unfulfilled: boolean,
    }, 
    location : string,
    items : [
        OrderItem
    ],
}

export interface OrderItem {
    item : {
        itemName : string,
    },
    quantity : number
}

interface OrderListItemProps {
    order : Order
}

export class OrderListItem extends React.Component<OrderListItemProps, any> {
    
    constructor(props) {
        super(props)
    }
    
    render() {
        var { firstName, lastName } = this.props.order.user
        var { location } = this.props.order
        // Reduce all item names and quantities down to single string
        var items = this.props.order.items.reduce((accu, curr) => 
            accu + curr.item.itemName + " x" + curr.quantity.toString() + "  ", "")
        
        return (
                <ListItem
                    key={this.props.order.id}
                    title={firstName + ' ' + lastName}
                    rightTitle={location}
                    subtitle={items} 
                    containerStyle={styles.itemContainer}
                />
        )
    }
}
const styles = StyleSheet.create({
    itemContainer: {
        // height: "10%",
    },
})