import * as React from 'react'
import { TouchableOpacity, View, Text, Button, StyleSheet, DatePickerIOS } from 'react-native';
import { inject, observer } from 'mobx-react';
import { RootStore } from '../../../../stores/root-store';
import Moment from 'moment';
import PrimaryButton from '../../../../components/primary-button.js'


interface HoursOperationScreenProps {
    // injected props
    rootStore?: RootStore;
  }

@inject("rootStore")
@observer
export class HoursOperationScreen extends React.Component<HoursOperationScreenProps, any> {

  constructor(props) {
    super(props) 
    this.state = {
      vendorInfo: "haven't fetched yet",
      start_date: new Date(),
      end_date: new Date(),
      showStartDatePicker: false,
      showEndDatePicker: false
    }
  }
    updateTimes = () => {
      // some backend call to update times
      // navigation calls go here as well
  }

  render() {
    var showStartDatePicker = this.state.showStartDatePicker ?
    <DatePickerIOS
        style={{ height: 150 }}
        date={this.state.start_date} 
        onDateChange={(date)=>this.setState({start_date: date})}
        minuteInterval={5}
        mode="time"/> : <View />
    
    var showEndDatePicker = this.state.showEndDatePicker ?
    <DatePickerIOS
        style={{ height: 150 }}
        date={this.state.end_date} 
        onDateChange={(date)=>this.setState({end_date: date})}
        minuteInterval={5}
        mode="time"/> : <View />
    
    return (
    <View>
        <Text>
          We are currently open from
        </Text>
        <TouchableOpacity 
            style={{height: 40, width: 300, padding: 4, borderColor: 'gray', borderWidth: 0}}
            onPress={() => this.setState({showStartDatePicker: !this.state.showStartDatePicker})}>
            <Text style={{color:"blue"}}>{Moment(this.state.start_date.toString()).format('hh:mm A')}</Text>
        </TouchableOpacity>
        {showStartDatePicker}
        <Text>
          to:
        </Text>
        <TouchableOpacity 
            style={{height: 40, width: 300, padding: 4, borderColor: 'gray', borderWidth: 0}}
            onPress={() => this.setState({showEndDatePicker: !this.state.showEndDatePicker})}>
            <Text style={{color:"blue"}}>{Moment(this.state.end_date.toString()).format('hh:mm A')}</Text>
        </TouchableOpacity>
        {showEndDatePicker}
        <PrimaryButton
          title ="Confirm Times"
          onPress={this.updateTimes}
        />
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    borderColor: "red", 
    borderWidth: 1
  }
})