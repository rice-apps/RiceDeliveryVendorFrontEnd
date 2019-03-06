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
// import { Order } from "../stores/order-store"
// Using temporary Order object instead of order-store Order object
  
interface OrderListProps {
    orders : any
    rootStore?: RootStore
}
interface OrderListState {
  refreshing: boolean, 
  bottomRefresh: boolean,
  onEndReachedCalledDuringMomentum: boolean,
  page: any,
  selected: Map<String, Boolean>,
}

// const OFlatList = observer(FlatList)
@inject("rootStore")
@observer
export class OrderList extends React.Component<OrderListProps, OrderListState> {
    constructor(props) {
        super(props)
        this.state = {
            refreshing: false,
            page: 1,
            onEndReachedCalledDuringMomentum: false,
            bottomRefresh: false,
            selected: new Map()
        }
    }
    
    onRefresh = async() => {
      this.setState({refreshing: true, page: 1})
      await this.props.rootStore.orders.queryOrders(this.state.page)
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
      if (!this.state.bottomRefresh) return null;
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
      if (!this.state.onEndReachedCalledDuringMomentum) {
        console.log("load more")
        this.setState({page: this.state.page + 1, bottomRefresh: true})
        console.log("calling query")
        this.props.rootStore.orders.queryOrders(this.state.page)
        console.log("Setting state")
        this.setState({bottomRefresh: false, onEndReachedCalledDuringMomentum: true})
        
      }
    };

    render() {
        return (
            <View style={css.orderList.flatList}>
                <FlatList
                onMomentumScrollBegin={() => {this.setState({onEndReachedCalledDuringMomentum: false})}}
                style={css.orderList.flatList}
                extraData={this.state}
                onRefresh={this.onRefresh}
                refreshing={this.state.refreshing}
                data= {this.props.orders}
                keyExtractor={(item, index) => item.id}
                renderItem={this.renderItem}
                ListFooterComponent={this.renderFooter}
                onEndReached={this.loadMore}
                onEndReachedThreshold={0.5}
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
