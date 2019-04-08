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
import { TransactionOrderList } from "../../../../components/transaction-order-list";
import { ButtonGroup } from "react-native-elements";
import { TransactionRefundedList } from "../../../../components/transaction-refunded-list";

interface TransactionHistScreenProps {
  // injected props
  rootStore?: RootStore
}

interface TransactionHistScreenState {
  // injected props
  transaction: string,
  loading: boolean,
  reloadPending: boolean,
  selectedIndex: number,
  displayNetworkError: boolean
}

@inject("rootStore")
@observer
export class TransactionHistScreen extends React.Component<TransactionHistScreenProps, TransactionHistScreenState> {
  constructor(props) {
    super(props)
    this.state = {
      transaction: "haven't fetched yet",
      loading: true,
      reloadPending: true,
      displayNetworkError: false,
      selectedIndex: 0
    }
  } 

  queryAllOrders = async () => {
    try {
      // If the modal is open, set the loading icon on the button to true.
      this.state.displayNetworkError && this.setState({ reloadPending: true })
      await this.props.rootStore.orders.queryAllOrders(1, "fulfilled")
      await this.props.rootStore.orders.queryRefundedOrders(1, "canceled")

      this.setState({
        loading: false,
        displayNetworkError: false,
      })
    } catch (error){
      console.log("Caught error" + error)
      this.setState({
        loading: false,
        displayNetworkError: true,
        reloadPending: false,
      })
    }
  }
  async componentWillMount() {
    await this.queryAllOrders()
  }

  updateIndex = (selectedIndex) => {
    this.setState({selectedIndex})
  }
  
  render() {
    if (this.state.loading) {
      return <LoadingScreen />
    }
    return (
      <View style={css.screen.paddedScreen}>
          <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={this.state.selectedIndex}
          buttons={["Fulfilled/Cancelled", "Refunded"]}
          containerStyle={{height: 40}}
        />

        {
          this.state.selectedIndex === 0 &&
          <View style={{ flex: 1 }}>
          <TransactionOrderList 
          orders={getSnapshot(this.props.rootStore.orders.allTransaction)}
          orderStatus={"fulfilled"}
          renderIcon={false}
           />
        </View>
        }
        {
          this.state.selectedIndex === 1 &&
          <View style={{ flex: 1 }}>
          <TransactionRefundedList
            orders={getSnapshot(this.props.rootStore.orders.refunded)}
            orderStatus={"canceled"}
            renderIcon={false}
           />
        </View>
        }
      </View>
    )
    
  }
}
