import { createBottomTabNavigator, createStackNavigator } from "react-navigation"
import LoginScreen  from "../app/screens/vendorScreens/login-screen/login-screen";
import { CurrentBatchesScreen } from "../app/screens/vendorScreens/batchesStack/current-batches-screen/"
import { PendingOrdersScreen } from "../app/screens/vendorScreens/orderStack/pending-orders-screen"
import { SingleOrderScreen } from "../app/screens/vendorScreens/orderStack/single-order-screen"
import { AccountScreen } from "../app/screens/vendorScreens/accountStack/account-setting-screen"
import { VendorInfoScreen } from "../app/screens/vendorScreens/accountStack/vendor-info-screen";
import { HoursOperationScreen } from "../app/screens/vendorScreens/accountStack/hours-operation-screen";
import { MenuScreen } from "../app/screens/vendorScreens/accountStack/menu-screen";
import { TransactionHistScreen } from "../app/screens/vendorScreens/accountStack/transaction-hist-screen"

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
})

const batchStackNavigator = createStackNavigator({
  Batches: { 
    screen: CurrentBatchesScreen,
    navigationOptions: {
      title: 'Current Batch'
      }
  }
})
const accountStackNavigator = createStackNavigator({
  Account: { 
    screen: AccountScreen,
    navigationOptions: {
      title: 'Account Settings'
      }
  }
  ,
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
      title: 'Menu'
      }
  },
  TransactionHist: { 
    screen: TransactionHistScreen,
    navigationOptions: {
      title: 'TransactionHist'
      }
  }
})

export const TabNavigator = createBottomTabNavigator({
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
  },
},
{initialRouteName: 'BatchesStack'})

export const RootNavigator = createStackNavigator({
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
})
