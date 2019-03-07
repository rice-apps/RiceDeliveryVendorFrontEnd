import * as React from 'react'
import { View, FlatList, StyleSheet, Text, RefreshControl, ActivityIndicator} from 'react-native';
import OrderListItem from './order-list-item';
import Order from './temporary-mock-order'
import * as css from "./style";
import { observer, inject } from 'mobx-react';
import { RootStore } from '../stores/root-store';
import { client } from '../main';
import gql from 'graphql-tag';
import { string } from 'prop-types';
import PrimaryButton from '../components/primary-button'
import SecondaryButton from '../components/secondary-button'
import * as componentCSS from '..//components/style'
import RefreshListView, {RefreshState} from "react-native-refresh-list-view"
// import { Order } from "../stores/order-store"
// Using temporary Order object instead of order-store Order object
  
interface OrderListProps {
    orders : any
    rootStore?: RootStore
}
interface OrderListState {
  refreshState: any,
  page: any,
  endReached: boolean,
  selected: Map<String, Boolean>,
}

// const OFlatList = observer(FlatList)
@inject("rootStore")
@observer
export class OrderList extends React.Component<OrderListProps, OrderListState> {
    constructor(props) {
        super(props)
        this.state = {
            refreshState: RefreshState.Idle,
            page: 1,
            endReached: false,
            selected: new Map()
        }
    }
    
    onRefresh = async() => {
      this.setState({refreshState: RefreshState.HeaderRefreshing, page: 1})
      await this.props.rootStore.orders.queryOrders(this.state.page)
      this.setState({refreshState: RefreshState.Idle})
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

    renderItem = ({item}) => {
      return (<OrderListItem 
        order={item}
        onPressItem={this.onPressItem}
        selected={!!this.state.selected.get(item.id)}
      />)
    }

    renderIf = (condition, item) => {
      if (condition) {
        return item
      } else {
        return null  
      }
    }

    renderFooter = () => {
      if (this.state.refreshState === RefreshState.Idle) return null;
      if (this.state.endReached) {
        return (
          <View
          style={{
            paddingVertical: 10,
            borderTopWidth: 1,
            borderColor: "#CED0CE"
          }}
        >
          <Text>End</Text>
        </View>
        )
      }

      return (
        <View
          style={{
            paddingVertical: 10,
            borderTopWidth: 1,
            borderColor: "#CED0CE"
          }}
        >
          <ActivityIndicator animating size="large" />
        </View>
      );
    };
    
    loadMore = async() => {
      //make request to add things.
        console.log("load more")
        if (!this.state.endReached) {
          this.setState({page: this.state.page + 1, refreshState: RefreshState.FooterRefreshing})
          console.log("calling query")
          const num = await this.props.rootStore.orders.queryOrders(this.state.page)
          if (num === 0) {
            this.setState({endReached: true})
          }
          console.log("Setting state")
          this.setState({refreshState: RefreshState.Idle})
  
        }

    };

    render() {
        return (
            <View style={css.orderList.flatList}>
                <RefreshListView
                style={css.orderList.flatList}
                extraData={this.state}
                data= {this.props.orders}
                keyExtractor={(item, index) => item.id}
                renderItem={this.renderItem}
                ListFooterComponent={this.renderFooter}
                onEndReachedThreshold={0.5}
                refreshState={this.state.refreshState}
                onFooterRefresh={this.loadMore}
                onHeaderRefresh={this.onRefresh}

              />
            {
              this.renderIf(Array.from(this.state.selected.values()).filter(value => value === true).length > 0,
              <View style={componentCSS.containers.batchContainer}>
                <PrimaryButton
                  title ="Add to Batch"
                  onPress={this.addToBatch}
                />
              <SecondaryButton
                title ="Create Batch"
              />
            </View>
              )
            }
            </View>
            )
    }
}
