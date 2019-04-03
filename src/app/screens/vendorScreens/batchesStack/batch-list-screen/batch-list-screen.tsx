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
    let batch = this.props.navigation.getParam("batch", "NONE");
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
          this.deliverBatch(batch._id, "East West Tea");
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


  async deliverBatch(batchID, vendorName) {
    let info = await client.mutate({
      mutation: DELIVER_BATCH,
      variables: {
        batchID: batchID,
        vendorName: vendorName
      }
    });
    return info.data.deliveryBatch.orders; //Return batches.
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

  render() {
    const batch = this.props.navigation.getParam("batch", "NONE");
    console.log(batch)
    if (this.state.loading) {
      return <LoadingScreen />
    }
    return (
      <View style={css.screen.paddedScreen}>
        <SecondaryButton
          title = "Deliver All"
          onPress = {() => this.deliverAlert()}
        />
        {
          this.state.displayNetworkError
          // <OverlayScreen queryFunction={this.queryOrders} loading={this.state.reloadPending} />
        }
        {this.renderIf(batch.orders.length > 0,(<View style={{ flex: 1 }}>
          <BatchList orders={batch.orders} />
        </View>) )}

      </View>
    )
  }
}

const DELIVER_BATCH = gql`
mutation deliverBatch($batchID: String!, $vendorName: String!){
	deliverBatch(batchID: $batchID, vendorName: $vendorName) {
    _id
    orders {
      id
      orderStatus {
        pending
        onTheWay
        fulfilled
        unfulfilled
        refunded
      }
    }
  }
}
`