import * as React from "react"
import {
  View,
  ScrollView,
  StyleSheet,
  Button,
  TextStyle,
  Alert,
  Text,
  RefreshControl,
} from "react-native"
import { client } from "../../../../../app/main"

import gql from "graphql-tag"
import * as css from "../../../style"
import { OrderList } from "../../../../components/order-list"
import PrimaryButton from "../../../../components/primary-button"
import SecondaryButton from "../../../../components/secondary-button"
import { toJS } from "mobx"
import { Overlay } from "react-native-elements"
import { observer, inject } from "mobx-react"
import { getSnapshot } from "mobx-state-tree"
import { OverlayScreen } from "../../orderStack/overlayScreen"
import LoadingScreen from "../../loading-screen"
import { RootStore } from "../../../../stores/root-store"
import { NavigationScreenProp } from "react-navigation"
import { BatchList } from "../../../../components/batch-list";
import { material } from "react-native-typography";
// import { observable, action } from 'mobx';

// Hide yellow warnings.
console.disableYellowBox = true
interface pendingOrderProps {
  rootStore: RootStore
  navigation: NavigationScreenProp<any, any>
}

interface pendingOrderState {
  loading: boolean
  refreshing: boolean
  reloadPending: boolean
  displayNetworkError: boolean
}

@inject("rootStore")
@observer
export class BatchListScreen extends React.Component<pendingOrderProps, pendingOrderState> {
  constructor(props) {
    super(props)
    this.state = {
      loading: true, // true if waiting for data to arrive.
      refreshing: false, // true if pulling to refresh
      reloadPending: false, // true if user actively reloading from overlay.
      displayNetworkError: true, // true if overlay is showing.
    }
  }

  

  // Makes alert box when add to batch is clicked.
  deliverAlert = () => {
    console.log("DELIVERYALERT")
    let batchID = this.props.navigation.getParam("batchID", "NONE");
    console.log(batchID)
    Alert.alert(
      "Deliver all order in this batch?",
      "",
      [
        {
          text: "Cancel",
          onPress: () => console.log("canceled deliver all"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => {
          this.deliverBatch(batchID, "East West Tea");
          console.log("all Order in batch delivered");
        } },
      ],
      { cancelable: true },
    )
  }

  queryOrders = async () => {
    try {
      // If the modal is open, set the loading icon on the button to true.
      this.state.displayNetworkError && this.setState({ reloadPending: true })
      await this.props.rootStore.orders.queryOrders(1)
      this.setState({
        loading: false,
        displayNetworkError: false,
      })
    } catch {
      console.log("Caught error")
      this.setState({
        loading: false,
        displayNetworkError: true,
        reloadPending: false,
    })
    }
  }

  async componentWillMount() {
    await this.queryOrders()
  }


   deliverBatch = async (batchID, vendorName) => {
    await this.props.rootStore.orders.deliverBatch(batchID, "East West Tea"); 
  }

  deleteBatch =  async() => {
    let batchID = this.props.navigation.getParam("batchID", "NONE");
    let deletedBatch = await this.props.rootStore.orders.deleteBatch(batchID, "East West Tea");
    await this.props.navigation.popToTop();
    console.log("Deleted");
    Alert.alert(`${deletedBatch.batchName}'s batch deleted`)
  }


  renderIf = (condition, element) => {
    if (condition) {
      return element
    } else {
      return (
        <Text style={material.headline}>This batch is empty</Text>
      )
    }
  }

  componentWillUnmount() {
    console.log("unmounting");

  }

  render() {
    console.log("rendering");
    const batchID = this.props.navigation.getParam("batchID", "NONE");
    console.log("getting batch");
    const batch = toJS(this.props.rootStore.orders.onTheWay).find(batch => batch._id === batchID)
    console.log("batch:")
    console.log(batch);

    if (this.state.loading || batch === undefined) {
      return <LoadingScreen />
    }
    return (
      <View style={css.screen.paddedScreen}>

        <PrimaryButton 
          title="Delete Batch"
          onPress = {() => this.deleteBatch()}
          />

        <SecondaryButton
          title = "Deliver All"
          onPress = {() => this.deliverAlert()}
        />
        {
          this.state.displayNetworkError
          // <OverlayScreen queryFunction={this.queryOrders} loading={this.state.reloadPending} />
        }
        {this.renderIf(batch !== undefined && batch.orders.length > 0,(<View style={{ flex: 1 }}>
          <BatchList orders={batch.orders} id = {batchID} />
        </View>) )}

      </View>
    )
  }
}

