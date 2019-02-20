import * as React from 'react'
import { View, FlatList, StyleSheet, Text} from 'react-native';
import OrderListItem from './order-list-item';
import Order from './temporary-mock-order'
import * as css from "./style";
import { observer, inject } from 'mobx-react';
import { RootStore } from '../stores/root-store';

// import { Order } from "../stores/order-store"
// Using temporary Order object instead of order-store Order object
  
interface OrderListProps {
    orders : [Order]
    rootStore?: RootStore
}

// const OFlatList = observer(FlatList)

@inject("rootStore")
@observer
export class OrderList extends React.Component<OrderListProps, {orders: Array<any>}> {
    constructor(props) {
        super(props)
        this.state = {
            orders: []
        }
    }

    componentWillMount() {
        this.setState({ orders: this.props.orders });
    }

    componentWillReceiveProps(props) {
        this.setState({ orders: props.orders });
    }
    
    render() {
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
