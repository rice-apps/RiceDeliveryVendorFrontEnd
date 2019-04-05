import * as React from 'react'
import { View, FlatList} from 'react-native';
import { inject, observer, Observer } from 'mobx-react';
import { RootStore } from '../../../../stores/root-store';
import SecondaryButton from '../../../../components/secondary-button';
import PrimaryButton from '../../../../components/primary-button';
import { BatchList } from '../../../../components/batch-list';
import * as css from "../../../style"
import LoadingScreen from '../../loading-screen';
import { Batch } from '../../../../stores/order-store'
import BatchListItem from '../../../../components/batch-list-item';
import RefreshListView, {RefreshState} from 'react-native-refresh-list-view';
import { getSnapshot } from 'mobx-state-tree';

interface CurrentBatchesScreenProps {
  // injected props
  rootStore?: RootStore
  batches: Batch[]
}
interface CurrentBatchesScreenState {
  vendor: string
  batches: any
  isLoading: boolean  
  refreshState: any
}

@inject("rootStore")
@observer
export class CurrentBatchesScreen extends React.Component<CurrentBatchesScreenProps, CurrentBatchesScreenState> {
  constructor(props) {
    super(props)
    this.state = {
      vendor: "East West Tea",
      batches : [],
      isLoading: true,
      refreshState: RefreshState.Idle
    }
  }

  getBatches = () => {
    return this.props.rootStore.orders.getBatches();
  } 

  async createBatch(vendorName, orders) {
    await this.props.rootStore.orders.createBatch(vendorName, orders);
  }

  async componentWillMount() {
    await this.getBatches();      
    this.setState({isLoading: false})
  }

  onRefresh = async() => {
    await this.setState({ refreshState: RefreshState.HeaderRefreshing})
    await this.props.rootStore.orders.getBatches();
    await this.setState({ refreshState: RefreshState.Idle })
  }

  renderItem = ({item, index}) => (
    <Observer>
      {() => (
        <BatchListItem 
          batch={item} 
          index ={index}>
        </BatchListItem>
      )}
    </Observer>

    )
  
  render() {
    if (this.state.isLoading) {
      return <LoadingScreen />
    } else {
      return (
        <View style={css.screen.paddedScreen}>
          <View style={css.flatlist.container}>
            <RefreshListView
                  data={getSnapshot(this.props.rootStore.orders.onTheWay)}
                  refreshState={this.state.refreshState}
                  onHeaderRefresh={this.onRefresh}
                  keyExtractor={(item, index) => item._id.toString()}
                  renderItem={this.renderItem}/>
          </View>
          <View> 
              <SecondaryButton 
              title="Create Batch"
              onPress = {() => this.createBatch("East West Tea", [])}
              />
          </View>
        </View>
      )
    }
  }
}
