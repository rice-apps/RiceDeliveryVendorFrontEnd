
import * as React from 'react'
import { View, Alert} from 'react-native';
import * as css from "../../../style"
import { OrderList } from "../../../../components/order-list"
import { observer, inject } from 'mobx-react';
import { getSnapshot } from 'mobx-state-tree';
import LoadingScreen from '../../loading-screen';
import { RootStore } from '../../../../stores/root-store';
import { NavigationScreenProp } from 'react-navigation';

// Hide yellow warnings.
console.disableYellowBox = true;
interface pendingOrderProps {
  rootStore: RootStore,
  navigation: NavigationScreenProp<any, any>
}

@inject("rootStore")
@observer
export class PendingOrdersScreen extends React.Component<pendingOrderProps, any> {

  constructor(props) {
    super(props); 
    this.state = {
      loading: true, 
      refreshing: false
    }
  }


  addToBatchHandler = () => {
    this.props.navigation.navigate("AddToBatch")
  }

  async componentWillMount() {
    await this.props.rootStore.orders.queryOrders(1)
    this.setState({
      loading: false 
    })
  }

  render() {
    if (this.state.loading) { return <LoadingScreen /> } 
      return (
        <View style={css.screen.paddedScreen}>
          <View style = {{flex: 1}}>
            <OrderList orders={getSnapshot(this.props.rootStore.orders.pending)}/>
          </View>
        </View>
        )
    

  }
}
