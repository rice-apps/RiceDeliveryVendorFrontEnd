import * as React from "react"
import { View, FlatList, StyleSheet, Text, RefreshControl, ActivityIndicator, Alert } from "react-native"
import * as css from "./style"
import { observer, inject } from "mobx-react"
import { RootStore } from "../stores/root-store"
import PrimaryButton from "../components/primary-button"
import * as componentCSS from "..//components/style"
import RefreshListView, { RefreshState } from "react-native-refresh-list-view"
// import { Order } from "../stores/order-store"
// Using temporary Order object instead of order-store Order object
import BatchOrderListItem from "../components/batch-order-item"
import SecondaryButton from "./secondary-button";
interface OrderListProps {
  id: any
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
  orders: any,
}

// const OFlatList = observer(FlatList)
@inject("rootStore")
@observer
export class BatchList extends React.Component<OrderListProps, OrderListState> {
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

  async componentDidMount() {
    let batches = await this.props.rootStore.orders.getBatches(); 
    this.setState({batches: batches});
  }

  removeFromBatch = async (vendorName, orders, batchID) => {
    await this.props.rootStore.orders.removeFromBatch(vendorName, orders, batchID);
    this.props.rootStore.orders.getNewOrders();
    await this.setState({selected: new Map()})
  }
  
  removeAlert = () => {
    Alert.alert(
      "Remove all selected order from this batch?",
      "",
      [
        {
          text: "Cancel",
          onPress: () => console.log("canceled deliver all"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => {
          console.log("removed from batch");
          this.removeFromBatch("East West Tea", this.state.orders, this.props.id);
        } },
      ],
      { cancelable: true },
    )
  }



   // Makes alert box when add to batch is clicked.
   removeFromBatchHandler = async () =>{
    let orders = [];
    for (let key of this.state.selected.keys()) {
      if (this.state.selected.get(key) === true)
        orders.push(key)
    }
    await this.setState({orders: orders});
    this.removeAlert();
  }

  onRefresh = async () => {
    this.setState({ refreshState: RefreshState.HeaderRefreshing, page: 1 })
    await this.props.rootStore.orders.getBatch(this.props.id)
    this.setState({ refreshState: RefreshState.Idle })
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
      <BatchOrderListItem
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
      )
    }

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
      const num = await this.props.rootStore.orders.queryOrders(this.state.page)
      if (num === 0) {
        this.setState({ endReached: true })
      }
      console.log("Setting state")
      this.setState({ refreshState: RefreshState.Idle })
    }
  }

  render() {
    return (
      <View style={css.orderList.flatList}>
        <RefreshListView
          style={css.orderList.flatList}
          extraData={this.state}
          data={this.props.orders}
          keyExtractor={(item, index) => item.id}
          renderItem={this.renderItem}
          onEndReachedThreshold={0.5}
          refreshState={this.state.refreshState}
          onHeaderRefresh={this.onRefresh}
        />
        {
          this.renderIf(Array.from(this.state.selected.values()).filter(value => value === true).length > 0,
            <SecondaryButton
              title ="Remove from Batch"
              onPress={this.removeFromBatchHandler}
            />
          )
        }
      </View>
    )
  }
}