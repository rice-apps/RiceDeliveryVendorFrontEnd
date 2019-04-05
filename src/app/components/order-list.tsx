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
  

  
  addToBatch = async(vendorName, orders, batchID, index, batchName) => {
    console.log(`ADDING to batchID ${batchID}`);
    console.log(`ADDING orders ${orders}`);
    console.log(`ADDING to vendor ${vendorName}`);
    await this.setState((state) => {
      let arr = state.addingToBatchesButtonLoad.map(item => item)
      arr[index] = true;
      return {addingToBatchesButtonLoad: arr };
    })
    await this.props.rootStore.orders.addToBatch(vendorName, orders, batchID);
    await this.onRefresh();
    await this.setState((state) => {
      let arr = state.addingToBatchesButtonLoad.map(item => false)
      return {addingToBatchesButtonLoad: arr, overlayVisible: false};
    })
    Alert.alert(`Successfully added to ${batchName}'s Batch`)
  }

   // Makes alert box when add to batch is clicked.
   addToBatchHandler = async () => {
    let orders = [];
    for (let key of this.state.selected.keys()) {
      if (this.state.selected.get(key) === true)
        orders.push(key)
    }
    await this.setState({orders: orders, batchOverlayButtonLoad: true});
    // get the latest batches:
    let batch = toJS(await this.props.rootStore.orders.getBatches()).map(item => false);
    await this.setState({overlayVisible: true, batchOverlayButtonLoad: false, addingToBatchesButtonLoad: batch})
    // await this.setState({alertOptions: this.createAlertOptions(batches)});
    // Alert.alert(
    //   'Add to Batch: ',
    //   '',
    //   this.state.alertOptions, 
    //   {cancelable: true},
    // );
  }

  onRefresh = async () => {
    console.log("REFRESHING");
    await this.setState({ refreshState: RefreshState.HeaderRefreshing, page: 1 })
    await this.props.rootStore.orders.queryOrders(this.state.page)
    await this.setState({ refreshState: RefreshState.Idle })
  }

  // timer
  // async componentWillMount() {
  //   this.timer = setInterval(() => this.onRefresh(), 1000);
  // }

  // async componentWillUnmount() {
  //   this.timer = null;
  // }
  
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
      <Observer>
      {() =>       
        <OrderListItem
          order={item}
          onPressItem={this.onPressItem}
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

  renderOverlay = ({item, index}) => {
    return (
      <SecondaryButton 
        title={`${item.batchName}'s Batch`}
        onPress={() => this.addToBatch("East West Tea", this.state.orders, item._id, index, item.batchName)}
        loading={this.state.addingToBatchesButtonLoad[index]}
        disabled={this.state.addingToBatchesButtonLoad[index]}
      />
    )
  }
  render() {
    console.log("rerender");
    let orders = getSnapshot(this.props.rootStore.orders.pending);
    console.log("LENGTH OF ARRAY:" + toJS(orders).length);
    return (
      <View style={css.orderList.flatList}>
        
        <Overlay 
        isVisible={this.state.overlayVisible}
        onBackdropPress={() =>this.setState({overlayVisible: false})}
        >
          <View style={style.overlayContainer}>
            <Text style={material.headline}>Which Batch would you like to add to?</Text>
            <FlatList
              extraData={this.state}
              data={getSnapshot(this.props.rootStore.orders.onTheWay)}
              renderItem={this.renderOverlay}
              keyExtractor={(item, index)=> item._id}
             />
          </View>
        </Overlay>

        <RefreshListView
          style={css.orderList.flatList}
          extraData={this.state}
          data={this.props.orders}
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
            <PrimaryButton
              title ="Add to Batch"
              onPress={this.addToBatchHandler}
              loading={this.state.batchOverlayButtonLoad}
              disabled={this.state.batchOverlayButtonLoad}
            />
          )
        }
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
    borderColor: "red",
    borderWidth: 2,
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