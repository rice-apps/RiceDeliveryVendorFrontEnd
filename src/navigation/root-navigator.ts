import { createBottomTabNavigator, createMaterialTopTabNavigator } from "react-navigation"
import { CurrentBatchesScreen } from "../views/vendorScreens/current-batches-screen"
import { PendingOrdersScreen } from "../views/vendorScreens/pending-orders-screen"
import { TransactionHistoryScreen } from "../views/vendorScreens/transaction-history-screen"

export const RootNavigator = createBottomTabNavigator(
  {
    // this is an example of having multiple navigators being rendered by a single navigator
    // there are multiple types here: stack and tab navigators; navigate to them just as you would navigate
    // to any other screen 
    currentBatches: { screen: CurrentBatchesScreen },
    pendingOrders: { screen: PendingOrdersScreen},
    transactionHistory: { screen: TransactionHistoryScreen}

  },
)
