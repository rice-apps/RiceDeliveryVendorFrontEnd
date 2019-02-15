import * as React from 'react'
import { View, FlatList, StyleSheet } from 'react-native';
import OrderListItem from './order-list-item';
import Order from './temporary-mock-order'
import * as css from "./style";
// import { Order } from "../stores/order-store"
// Using temporary Order object instead of order-store Order object
  
interface OrderListProps {
    orders : [Order]
}

export class OrderList extends React.Component<OrderListProps, any> {
    constructor(props) {
        super(props)
    }
    
    render() {
        // console.log("Orders: \n");
        // console.log( this.props.orders)
        return (
            <View style={css.orderList.flatList}>
                <FlatList
                style={css.orderList.flatList}
                data= {this.props.orders}
                keyExtractor={(item, index) => item.id.toString()}
                renderItem={({item}) => 
                    <OrderListItem order={item}></OrderListItem>
                }
              />
            </View>
            )
    }
}
