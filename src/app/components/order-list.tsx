import * as React from "react"
import { View, FlatList, StyleSheet, Text, RefreshControl, ActivityIndicator, Alert } from "react-native"
import OrderListItem from "./order-list-item"
import Order from "./temporary-mock-order"
import * as css from "./style"
import { observer, inject } from "mobx-react"
import { RootStore } from "../stores/root-store"
import { client } from "../main"
import gql from "graphql-tag"
import { string } from "prop-types"
import PrimaryButton from "../components/primary-button"
import SecondaryButton from "../components/secondary-button"
import * as componentCSS from "..//components/style"
import RefreshListView, { RefreshState } from "react-native-refresh-list-view"
// import { Order } from "../stores/order-store"
// Using temporary Order object instead of order-store Order object

interface OrderListProps {
  orders: any
  rootStore?: RootStore
}
interface OrderListState {
  refreshState: any,
  page: any,
  endReached: boolean,
  selected: Map<String, Boolean>,
  language: string,
  batches: any,
  alertOptions: any,
  orders: any
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
            selected: new Map(),
            language: "",
            batches: [],
            alertOptions: [],
            orders: []
        }
    }
    
  onRefresh = async() => {
      this.setState({refreshState: RefreshState.HeaderRefreshing, page: 1})
      await this.props.rootStore.orders.queryOrders(this.state.page)
      this.setState({refreshState: RefreshState.Idle})
  }
  

  onPressItem = id => {
    // updater functions are preferred for transactional updates
    this.setState(state => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected)
      selected.set(id, !selected.get(id)) // toggle
      return { selected }
    })
  }

  renderItem = ({ item }) => {
    return (
      <OrderListItem
        order={item}
        onPressItem={this.onPressItem}
        selected={!!this.state.selected.get(item.id)}
      />
    )
  }

  renderIf = (condition, item) => {
    if (condition) {
      return item
    } else {
      return null
    }
  }

  renderFooter = () => {
    if (this.state.refreshState === RefreshState.Idle) return null
    if (this.state.endReached) {
      return (
        <View
          style={{
            paddingVertical: 10,
            borderTopWidth: 1,
            borderColor: "#CED0CE",
          }}
        >
          <Text>End</Text>
        </View>
      );
    };
  }
        
  loadMore = async () => {
    //make request to add things.
    console.log("load more")
    if (!this.state.endReached) {
      this.setState({ page: this.state.page + 1, refreshState: RefreshState.FooterRefreshing })
      console.log("calling query")
      const num = await this.props.rootStore.orders.queryOrders(this.state.page)
      if (num === 0) {
        this.setState({ endReached: true })
      }
      console.log("Setting state")
      this.setState({ refreshState: RefreshState.Idle })
    }
  }

    async componentDidMount() {
      let batches = await this.props.rootStore.orders.getBatches(); 
      this.setState({batches: batches});
    }

    createAlertOptions(batches) {
      let alertOptions = [];
      for (let i = 0; i < batches.length; i++) {
        let text = 'Batch ' + (i+1);
        let addBatchInput = {vendorName: "East West Tea", batchID: batches[i]._id, orders: this.state.orders};
        alertOptions.push({text: text, onPress: () => {this.addToBatch(addBatchInput.vendorName, addBatchInput.orders, addBatchInput.batchID), console.log("added to Batch")}});
      }
      alertOptions.push({text: 'Cancel', onPress: () => console.log('cancel pressed'), style: 'cancel'});
      return alertOptions;
    }
    
    addToBatch = async (vendorName, orders, batchID) => {
      console.log(orders);
      await this.props.rootStore.orders.addToBatch(vendorName, orders, batchID);
    }

     // Makes alert box when add to batch is clicked.
     addToBatchHandler = async () =>{
      let orders = [];
      for (let key of this.state.selected.keys()) {
        if (this.state.selected.get(key) === true)
          orders.push(key)
      }
      await this.setState({orders: orders});
      await this.setState({alertOptions: this.createAlertOptions(this.state.batches)});
      Alert.alert(
        'Add to Batch: ',
        '',
        this.state.alertOptions, 
        {cancelable: true},
      );
    }

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
                  onPress={this.addToBatchHandler}
                />
            </View>
              )
            }
            </View>
            )
    }
}
