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
import { OverlayScreen } from "../overlayScreen"
import LoadingScreen from "../../loading-screen"
import { RootStore } from "../../../../stores/root-store"
import { NavigationScreenProp } from "react-navigation"
// import { observable, action } from 'mobx';

// Hide yellow warnings.
console.disableYellowBox = true
interface pendingOrderProps {
  rootStore: RootStore
  navigation: NavigationScreenProp<any, any>
}

interface pendingOrderState {
  loading: boolean
  reloadPending: boolean
  displayNetworkError: boolean
}

@inject("rootStore")
@observer
export class PendingOrdersScreen extends React.Component<pendingOrderProps, pendingOrderState> {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,          // true if waiting for data to arrive.
      reloadPending: false, // true if user actively reloading from overlay.
      displayNetworkError: true, // true if overlay is showing.
    }
  }

  addToBatchHandler = () => {
    this.props.navigation.navigate("AddToBatch")
  }

  queryOrders = async () => {
    try {
      // If the modal is open, set the loading icon on the button to true.
      this.state.displayNetworkError && this.setState({ reloadPending: true })
      await this.props.rootStore.orders.getNewOrders();
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

  render() {
    if (this.state.loading) {
      return <LoadingScreen />
    }
    return (
      <View style={css.screen.paddedScreen}>
        {
          this.state.displayNetworkError && 
          <OverlayScreen queryFunction={this.queryOrders} loading={this.state.reloadPending} />
        }
        <View style={{ flex: 1 }}>
          <OrderList 
            orders={getSnapshot(this.props.rootStore.orders.pending)} 
            renderIcon={true}
            />
        </View>
      </View>
    )
  }
}
