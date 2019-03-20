import * as React from 'react'
import { View, FlatList} from 'react-native';
import { inject, observer } from 'mobx-react';
import { RootStore } from '../../../../stores/root-store';
import SecondaryButton from '../../../../components/secondary-button';
import { BatchList } from '../../../../components/batch-list';
import * as css from "../../../style"
import LoadingScreen from '../../loading-screen';
import { Batch } from '../../../../stores/order-store'
import BatchListItem from '../../../../components/batch-list-item';

interface CurrentBatchesScreenProps {
  // injected props
  rootStore?: RootStore;
  batches : Batch[],
}

@inject("rootStore")
@observer
export class CurrentBatchesScreen extends React.Component<CurrentBatchesScreenProps, any> {

  constructor(props) {
    super(props) 
    this.state = {
      vendor: "East West Tea",
      batches : [],
      isLoading: true
    }
  }

  getBatches = () => {
    return this.props.rootStore.orders.getBatches();
  } 

  createBatch(vendorName, orders) {
    this.props.rootStore.orders.createBatch(vendorName, orders);
  }
  
  async componentWillMount() {
    let batches = await this.getBatches();      
    this.setState({isLoading: false, batches: batches})
  }
  
  render() {
    if (this.state.isLoading) {
      return <LoadingScreen />
    } else {
      return (
        <View style={css.screen.paddedScreen} >
          <View style={css.flatlist.container}>
            <FlatList
                  data={
                    this.state.batches
                  }
                  keyExtractor={(item, index) => item._id.toString()}
                  renderItem={({item, index}) => 
                      <BatchListItem batch={item}></BatchListItem>
                  }
                />
  
          </View>

          
          <SecondaryButton 
          title="Create Batch"
          onPress = {() => this.createBatch("East West Tea", [])}
          />

          </View>
      
        )
    }
  }
}

