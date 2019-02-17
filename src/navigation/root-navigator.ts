import { createBottomTabNavigator, createStackNavigator } from "react-navigation"
import {currentBatchesIcon, pendingOrdersIcon, accountIcon} from './navigationIcons/icons'
//First Screen
import LoginScreen  from "../app/screens/vendorScreens/login-screen/login-screen";
//BatchesStack
import { CurrentBatchesScreen } from "../app/screens/vendorScreens/batchesStack/current-batches-screen/"

//OrderStack
import { PendingOrdersScreen } from "../app/screens/vendorScreens/orderStack/pending-orders-screen"
import { SingleOrderScreen } from "../app/screens/vendorScreens/orderStack/single-order-screen"

//AccountStack
import { AccountScreen } from "../app/screens/vendorScreens/accountStack/account-setting-screen"
import { VendorInfoScreen } from "../app/screens/vendorScreens/accountStack/vendor-info-screen";
import { HoursOperationScreen } from "../app/screens/vendorScreens/accountStack/hours-operation-screen";
import { MenuScreen } from "../app/screens/vendorScreens/accountStack/menu-screen";
import { TransactionHistScreen } from "../app/screens/vendorScreens/accountStack/transaction-hist-screen"

//orderStack
const OrdersStackNavigator = createStackNavigator({
  Order: { 
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

//accountStack
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
    screen: OrdersStackNavigator,
    navigationOptions: {
      tabBarIcon: pendingOrdersIcon, 
      title: "Pending Orders"
    }
  }, 
  BatchesStack: {
    screen: batchStackNavigator,
    navigationOptions: {
      tabBarIcon: currentBatchesIcon, 
      title: 'Current Batches'
    }
  }, 
  AccountStack: {
    screen: accountStackNavigator,
    navigationOptions: {
      tabBarIcon: accountIcon,
      title: "Account"
    }
  },
},
  {initialRouteName: 'BatchesStack'}
)


export const RootNavigator = createStackNavigator({
    Login: {
      screen: LoginScreen
    }, 
    Tabs: {
      screen: TabNavigator, 
      navigationOptions: {
        gesturesEnabled: false
      }
    }
  }, 
  {
    mode: 'modal', 
    initialRouteName: 'Login', 
    headerMode: 'none'
})
