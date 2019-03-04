import * as React from 'react'
import { View, FlatList, StyleSheet, Text, RefreshControl} from 'react-native';
import OrderListItem from './order-list-item';
import Order from './temporary-mock-order'
import * as css from "./style";
import { observer, inject } from 'mobx-react';
import { RootStore } from '../stores/root-store';
import { client } from '../main';
import gql from 'graphql-tag';
import { string } from 'prop-types';

// import { Order } from "../stores/order-store"
// Using temporary Order object instead of order-store Order object
  
interface OrderListProps {
    orders : any
    rootStore?: RootStore
}

// const OFlatList = observer(FlatList)
@inject("rootStore")
@observer
export class OrderList extends React.Component<OrderListProps, any> {
    constructor(props) {
        super(props)
        this.state = {
            refreshing: false,
            selected: new Map()
        }
    }
    
    onRefresh = async() => {
      this.setState({refreshing: true})
      await this.props.rootStore.orders.queryOrders()
      this.setState({refreshing: false})
    }
    onPressItem = (id) => {
      // updater functions are preferred for transactional updates
      this.setState((state) => {
        // copy the map rather than modifying state.
        const selected = new Map(state.selected);
        selected.set(id, !selected.get(id)); // toggle
        return {selected};
      });
    }

    renderItem = ({item}) => 
      (<OrderListItem 
        order={item}
        onPressItem={this.onPressItem}
        selected={!!this.state.selected.get(item.id)}
      />)

    render() {
        return (
            <View style={css.orderList.flatList}>
                <FlatList
                style={css.orderList.flatList}
                extraData={this.state}
                onRefresh={this.onRefresh}
                refreshing={this.state.refreshing}
                data= {this.props.orders}
                keyExtractor={(item, index) => item.id}
                renderItem={this.renderItem}
              />
            </View>
            )
    }
}
