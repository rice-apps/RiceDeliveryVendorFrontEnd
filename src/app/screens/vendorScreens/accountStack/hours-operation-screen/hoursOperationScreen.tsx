import * as React from 'react'
import { TouchableOpacity, View, Text, Button, StyleSheet, DatePickerIOS } from 'react-native';
import { inject, observer } from 'mobx-react';
import { RootStore } from '../../../../stores/root-store';
import Moment from 'moment';
import PrimaryButton from '../../../../components/primary-button'
import SecondaryButton from '../../../../components/secondary-button'

import * as css from "../../../style"

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
        style={css.datepickerios.timescroller}
        date={this.state.start_date} 
        onDateChange={(date)=>this.setState({start_date: date})}
        minuteInterval={5}
        mode="time"/> : <View />
    
    var showEndDatePicker = this.state.showEndDatePicker ?
    <DatePickerIOS
        style={css.datepickerios.timescroller}
        date={this.state.end_date} 
        onDateChange={(date)=>this.setState({end_date: date})}
        minuteInterval={5}
        mode="time"/> : <View />
    
    return (
    <View style = {css.screen.paddedScreen}>
        <View style = {css.screen.paddedScreen}>
          <Text style = {css.text.bigBodyText}>
            We are currently open from
          </Text>

          <TouchableOpacity 
              style={css.touchableopacity.timescroller}
              onPress={() => this.setState({showStartDatePicker: !this.state.showStartDatePicker})}>
              <Text style={css.text.bodyText}>{Moment(this.state.start_date.toString()).format('hh:mm A')}</Text>
          </TouchableOpacity>
          {showStartDatePicker}

          <Text style = {css.text.bodyText}>
            to:
          </Text>

          <TouchableOpacity 
              style={css.touchableopacity.timescroller}
              onPress={() => this.setState({showEndDatePicker: !this.state.showEndDatePicker})}>

              <Text style={css.text.bodyText}>{Moment(this.state.end_date.toString()).format('hh:mm A')}</Text>
          </TouchableOpacity>

          {showEndDatePicker}
        </View>

        <View style = {{paddingTop: 50}}>
          <PrimaryButton
            title ="Confirm Times"
            onPress={this.updateTimes}
          />
        
        </View>


    </View>

    );
  }
}

