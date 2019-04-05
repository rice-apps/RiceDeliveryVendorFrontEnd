import * as React from 'react'
import { View, FlatList, Text} from 'react-native';
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
import { Overlay, Input } from 'react-native-elements';
import { material } from 'react-native-typography';

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
  batchName: string
  displayOverlay: boolean
  buttonLoading: boolean
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
      refreshState: RefreshState.Idle,
      batchName: "",
      displayOverlay: false,
      buttonLoading: false
    }
  }

  getBatches = () => {
    return this.props.rootStore.orders.getBatches();
  } 

  createBatchHandler = async() => {
    await this.setState({displayOverlay: true})
  }
  async createBatch(vendorName, orders, batchName) {
    await this.setState({buttonLoading: true})
    await this.props.rootStore.orders.createBatch(vendorName, orders, batchName);
    await this.setState({buttonLoading: false, batchName: ""})
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
          name ={item.batchName}>
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
        <Overlay
          isVisible={this.state.displayOverlay}
          onBackdropPress={() => this.setState({displayOverlay: false})}
        >
          <View style={css.screen.defaultScreen}>
            <Text style={material.display1}>
              Name your batch
            </Text>
            <Input 
              placeholder="Name"
              onChangeText={event => {this.setState({batchName: event})}}
            />
            <PrimaryButton 
              loading={this.state.buttonLoading}
              disabled={this.state.batchName.length === 0}
              title="Create Batch"
              onPress={() => this.createBatch("East West Tea", [], this.state.batchName)}
            />
          </View>
        </Overlay>
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
              onPress = {this.createBatchHandler}
              />
          </View>
        </View>
      )
    }
  }
}
