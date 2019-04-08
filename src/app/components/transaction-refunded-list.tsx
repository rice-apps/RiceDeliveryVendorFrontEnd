import * as React from "react"
import { View, FlatList, StyleSheet, Text, RefreshControl, ActivityIndicator, Alert } from "react-native"
import OrderListItem from "./order-list-item"
import Order from "./temporary-mock-order"
import * as css from "./style"
import { observer, inject, Observer } from "mobx-react"
import { RootStore } from "../stores/root-store"
import { client } from "../main"
import gql from "graphql-tag"
import { string } from "prop-types"
import PrimaryButton from "../components/primary-button"
import SecondaryButton from "../components/secondary-button"
import * as componentCSS from "..//components/style"
import { Overlay } from "react-native-elements";
import { getSnapshot } from "mobx-state-tree";
import { toJS } from "mobx";
import { material } from "react-native-typography";
import RefreshListView, {RefreshState}from "../components/RefreshListView";
// import { Order } from "../stores/order-store"
// Using temporary Order object instead of order-store Order object


interface OrderListProps {
  orders: any
  rootStore?: RootStore
  renderIcon: boolean
  orderStatus: string
}
interface OrderListState {
  refreshState: any,
  page: any,
  endReached: boolean,
  selected: Map<String, Boolean>,
  language: string,
  batches: any,
  alertOptions: any,
  orders: any,
  overlayVisible: boolean,
  batchOverlayButtonLoad: boolean,
  addingToBatchesButtonLoad: Array<boolean>
}

// const OFlatList = observer(FlatList)
@inject("rootStore")
@observer
export class TransactionRefundedList extends React.Component<OrderListProps, OrderListState> {
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
            orders: [],
            overlayVisible: false,
            batchOverlayButtonLoad: false,
            addingToBatchesButtonLoad: []
        }
    }

  async componentDidMount() {
    let batches = await this.props.rootStore.orders.getBatches(); 
    this.setState({batches: batches});
  }

  onRefresh = async () => {
    console.log("REFRESHING");
    await this.setState({ refreshState: RefreshState.HeaderRefreshing, page: 1, endReached: false })
    await this.props.rootStore.orders.queryRefundedOrders(1, this.props.orderStatus);
    await this.setState({ refreshState: RefreshState.Idle })
  }


  renderItem = ({ item }) => {
    return (
      <Observer>
      {() =>       
        <OrderListItem
          order={item}
          selected={!!this.state.selected.get(item.id)}
          renderIcon={this.props.renderIcon}
        />}
      </Observer>

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
    return (
      <View
        style={{
          paddingVertical: 10,
          borderTopWidth: 1,
          borderColor: "#CED0CE",
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    )
  }

  loadMore = async () => {
    //make request to add things.
    console.log("load more")
    if (!this.state.endReached) {
      this.setState({ page: this.state.page + 1, refreshState: RefreshState.FooterRefreshing })
      console.log("calling query")
      const pendingList = await this.props.rootStore.orders.queryRefundedOrders(this.state.page, this.props.orderStatus);
      if (pendingList.length === 0) {
        console.log("no more data")
        this.setState({ endReached: false, refreshState: RefreshState.NoMoreData})
      }
      console.log("Setting state")
      this.setState({ refreshState: RefreshState.Idle })
    }
  }

  renderNoMoreData = () => (
        <View
          style={{
            paddingVertical: 10,
            borderTopWidth: 1,
            borderColor: "#CED0CE",
          }}
        >
          <Text>End</Text>
        </View>
  )

  render() {
    return (
      <View style={css.orderList.flatList}>
        <RefreshListView
          style={css.orderList.flatList}
          extraData={this.state}
          data={this.props.orders}
          keyExtractor={(item, index) => item.id}
          renderItem={this.renderItem}
          ListFooterComponent={this.renderFooter}
          refreshState={this.state.refreshState}
          onFooterRefresh={this.loadMore}
          footerNoMoreDataComponent={this.renderNoMoreData}
          onHeaderRefresh={this.onRefresh}
        />
      </View>
    )
  }
}


const style = StyleSheet.create({
  overlayContainer: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    height: "100%",
  },
  
})

  // createAlertOptions(batches) {
  //   let alertOptions = [];
  //   for (let i = 0; i < batches.length; i++) {
  //     let text = 'Batch ' + (i+1);
  //     let addBatchInput = {vendorName: "East West Tea", batchID: batches[i]._id, orders: this.state.orders};
  //     alertOptions.push(
  //       {text: text, 
  //         onPress: () => {
  //           this.addToBatch(addBatchInput.vendorName, addBatchInput.orders, addBatchInput.batchID)
  //         }});
  //   }
  //   alertOptions.push({text: 'Cancel', onPress: () => console.log('cancel pressed'), style: 'cancel'});
  //   return alertOptions;
  // }