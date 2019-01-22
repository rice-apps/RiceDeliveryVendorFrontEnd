import { createBottomTabNavigator, createStackNavigator } from "react-navigation"
import { CurrentBatchesScreen } from "../app/screens/vendorScreens/current-batches-screen/"
import { PendingOrdersScreen } from "../app/screens/vendorScreens/pending-orders-screen"
import { AccountScreen } from "../app/screens/vendorScreens/transaction-history-screen"
import {currentBatchesIcon, pendingOrdersIcon, accountIcon} from './navigationIcons/icons'
import LoginScreen from "../app/screens/vendorScreens/login-screen/login-screen";


const pendingOrdersStackNavigator = createStackNavigator({
  Orders: { 
    screen: PendingOrdersScreen, 
    navigationOptions: {
      title: 'Pending Orders'
      }
    }
  }
)

const batchStackNavigator = createStackNavigator({
    Batches: { 
      screen: CurrentBatchesScreen,
      navigationOptions: {
        title: 'Current Batch'
        }
    }
  }
)
const accountStackNavigator = createStackNavigator({
  Account: { 
    screen: AccountScreen,
    navigationOptions: {
      title: 'Account Settings'
      }
  }
})

export const TabNavigator = createBottomTabNavigator(
  {
    OrderStack: {
      screen: pendingOrdersStackNavigator,
      navigationOptions: {
        tabBarIcon: pendingOrdersIcon, 
      }
    }, 
    BatchesStack: {
      screen: batchStackNavigator,
      navigationOptions: {
        tabBarIcon: currentBatchesIcon, 
        title: 'Current Batch'
      }
    }, 
    AccountStack: {
      screen: accountStackNavigator,
      navigationOptions: {
        tabBarIcon: accountIcon
      }
    }
  }
)

export const RootNavigator = createStackNavigator(
  {
    Login: {
      screen: LoginScreen
    }, 
    Tabs: {
      screen: TabNavigator, 
    }, 
  }, 
  {
    mode: 'modal', 
    initialRouteName: 'Login', 
    headerMode: 'none'
  }
)
