import { createBottomTabNavigator, createMaterialTopTabNavigator, createStackNavigator } from "react-navigation"
import { CurrentBatchesScreen } from "../app/screens/vendorScreens/current-batches-screen/"
import { PendingOrdersScreen } from "../app/screens/vendorScreens/pending-orders-screen"
import { TransactionHistoryScreen } from "../app/screens/vendorScreens/transaction-history-screen"
import {currentBatchesIcon, pendingOrdersIcon, transactionHistoryIcon} from './navigationIcons/icons'
import LoginScreen from "../app/screens/vendorScreens/login-screen/login-screen";

export const TabNavigator = createBottomTabNavigator(
  {
    // this is an example of having multiple navigators being rendered by a single navigator
    // there are multiple types here: stack and tab navigators; navigate to them just as you would navigate
    // to any other screen 
    currentBatches: { 
      screen: CurrentBatchesScreen, 
      navigationOptions: {
        tabBarIcon: currentBatchesIcon
      }
     },
    pendingOrders: { 
      screen: PendingOrdersScreen,
      navigationOptions: {
        tabBarIcon: pendingOrdersIcon
      }
    },
    transactionHistory: { 
      screen: TransactionHistoryScreen, 
      navigationOptions: {
        tabBarIcon: transactionHistoryIcon
      }
    }

  },
)

export const RootNavigator = createStackNavigator({
  Login: {
    screen: LoginScreen
  }, 
  Tabs: {
    screen: TabNavigator
  }
})
