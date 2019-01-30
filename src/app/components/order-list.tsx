import * as React from 'react'
import { View, FlatList, StyleSheet } from 'react-native';
import OrderListItem from './order-list-item';

import Order from './temporary-mock-order'
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
        return (
            <View style={styles.flatList}>
                <FlatList
                style={styles.flatList}
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
const styles = StyleSheet.create({
    container: {
     flex: 1,
     justifyContent: "center", 
     alignItems: "center"
    },
    flatList: {
      width: "100%"
    }
  })
  