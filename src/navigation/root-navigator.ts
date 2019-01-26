import { createBottomTabNavigator, createStackNavigator } from "react-navigation"

//import screens
import LoginScreen  from "../app/screens/vendorScreens/login-screen/login-screen";
import { CurrentBatchesScreen } from "../app/screens/vendorScreens/current-batches-screen/"
import { PendingOrdersScreen } from "../app/screens/vendorScreens/pending-orders-screen"
import { SingleOrderScreen } from "../app/screens/vendorScreens/single-order-screen"
import { AccountScreen } from "../app/screens/vendorScreens/transaction-history-screen"
import { VendorInfoScreen } from "../app/screens/vendorScreens/vendor-info-screen";
import { HoursOperationScreen } from "../app/screens/vendorScreens/hours-operation-screen";
import { MenuScreen } from "../app/screens/vendorScreens/menu-screen";

import {currentBatchesIcon, pendingOrdersIcon, accountIcon} from './navigationIcons/icons'

const pendingOrdersStackNavigator = createStackNavigator({
  Orders: { 
    screen: PendingOrdersScreen, 
    navigationOptions: {
      title: 'Pending Orders'
      }
    },
    SingleOrder: { 
      screen: SingleOrderScreen, 
      navigationOptions: {
        title: 'Single Order Screen'
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
  //first page
  Account: { 
    screen: AccountScreen,
    navigationOptions: {
      title: 'Account Settings'
      }
  },
  VendorInfo: { 
    screen: VendorInfoScreen,
    navigationOptions: {
      title: 'Vendor Info'
      }
  },
  HoursOperation: { 
    screen: HoursOperationScreen,
    navigationOptions: {
      title: 'Hours of Operation Info'
      }
  },
  Menu: { 
    screen: MenuScreen,
    navigationOptions: {
      title: 'Menu Info'
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
  },

  //the first screen to go from the login page to is the Batches Screen
  {initialRouteName: 'BatchesStack'}

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
