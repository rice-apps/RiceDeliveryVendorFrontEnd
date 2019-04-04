import * as React from "react"
import { ScrollView, View, Text, StyleSheet } from "react-native"
import { inject, observer } from "mobx-react"
import { RootStore } from "../../../../stores/root-store"
import PrimaryButton from "../../../../components/primary-button"
import SecondaryButton from "../../../../components/secondary-button"
import LoadingScreen from "../../loading-screen"
import { getSnapshot } from "mobx-state-tree"
import { OrderList } from "../../../../components/order-list"
 
import * as css from "../../../style"

interface TransactionHistScreenProps {
  // injected props
  rootStore?: RootStore
}

@inject("rootStore")
@observer
export class TransactionHistScreen extends React.Component<TransactionHistScreenProps, any> {
  constructor(props) {
    super(props)
    this.state = {
      transaction: "haven't fetched yet",
    }
  } 

  queryOrders = async () => {
    try {
      // If the modal is open, set the loading icon on the button to true.
      this.state.displayNetworkError && this.setState({ reloadPending: true })
      await this.props.rootStore.orders.queryAllOrders(1)
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
          this.state.displayNetworkError
        }
        <View style={{ flex: 1 }}>
          <OrderList orders={getSnapshot(this.props.rootStore.orders.allTransaction)} />
        </View>
      </View>
    )
    
  }
}
