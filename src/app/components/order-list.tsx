import * as React from 'react'
import { View, FlatList, StyleSheet, Text, RefreshControl} from 'react-native';
import OrderListItem from './order-list-item';
import Order from './temporary-mock-order'
import * as css from "./style";
import { observer, inject } from 'mobx-react';
import { RootStore } from '../stores/root-store';
import { client } from '../main';
import gql from 'graphql-tag';

// import { Order } from "../stores/order-store"
// Using temporary Order object instead of order-store Order object
  
interface OrderListProps {
    orders : any
    rootStore?: RootStore
}

// const OFlatList = observer(FlatList)

// Query info for the orderStore.
const GET_ORDER_STORE = gql`
  query queryOrders {
    order(vendorName: "The Hoot") {
      id
      amount
      created
      customer
      email
      items {
            parent
            amount
            description
            quantity
      }
      orderStatus {
            pending
            onTheWay
            fulfilled
            unfulfilled
        }
      paymentStatus,
          location {
            _id
            name
          }
      location {
        _id
        name
      }
    }
    
  }

`
@inject("rootStore")
@observer
export class OrderList extends React.Component<OrderListProps, any> {
    constructor(props) {
        super(props)
        this.state = {
            refreshing: false
        }
    }

    componentWillMount() {
        // this.setState({ orders: this.props.orders });
    }

    componentWillReceiveProps(props) {
        // this.setState({ orders: props.orders });
    }
    

    onRefresh = async() => {
      console.log("refreshing")
      this.setState({refreshing: true})
      const length = await this.props.rootStore.orders.queryOrders()
      const info = (await client.query({
        query: GET_ORDER_STORE
      })) 
      console.log(info.data.order.length)
      console.log(length)
      this.setState({refreshing: false})
      }
    render() {
        return (
            <View style={css.orderList.flatList}>
                <FlatList
                style={css.orderList.flatList}
                onRefresh={this.onRefresh}
                refreshing={this.state.refreshing}
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
