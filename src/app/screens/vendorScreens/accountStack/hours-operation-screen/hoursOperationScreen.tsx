import * as React from "react"
import { TouchableOpacity, View, Text, Button, StyleSheet, DatePickerIOS, FlatList } from "react-native"
import { inject, observer } from "mobx-react"
import { RootStore } from "../../../../stores/root-store"
import Moment from "moment"
import PrimaryButton from "../../../../components/primary-button"
import SecondaryButton from "../../../../components/secondary-button"

import * as css from "../../../style"
import { ListItem, Icon } from "react-native-elements";
import { NavigationScreenProp } from "react-navigation";
import { client } from "../../../../main";
import gql from "graphql-tag";

interface HoursOperationScreenProps {
  // injected props
  rootStore?: RootStore,
  navigation: NavigationScreenProp<any, any>
}

const GET_VENDOR_INFO = gql`
  query getHours($vendorName: String) {
    vendor(name: $vendorName) {
      hours
    }
  }
`
@inject("rootStore")
@observer
export class HoursOperationScreen extends React.Component<HoursOperationScreenProps, any> {
  constructor(props) {
    super(props)
    this.state = {
      vendorInfo: "haven't fetched yet",
      days: [
        {day:"Monday", idx: 0}, 
        {day: "Tuesday", idx: 1},
        {day: "Wednesday", idx: 2},
        {day: "Thursday", idx: 3},
        {day: "Friday", idx: 4},
        {day: "Saturday", idx: 5},
        {day: "Sunday", idx: 6}
      ],
      hours: []
    }
  }
  updateTimes = () => {
    // some backend call to update times
    // navigation calls go here as well
  }

  queryVendor = async() => {
    const data = (await client.query({
      query: GET_VENDOR_INFO, 
      variables: {
        "vendorName": "East West Tea"
      }
    })).data.vendor[0].hours
    await this.setState(state => {
      let days = state.days

      for (let i = 0; i < days.length; i++) {
        days[i].hours = data[i];
      }
      return {days: days, hours: data}
    })
  }

  componentWillMount() {
    this.queryVendor();
  }

  renderItem = ({item}) => (
    <ListItem
      title={item.day}
      containerStyle={{height: 70}}
      chevron
      bottomDivider={true}
      onPress={() => this.props.navigation.navigate("SingleDay", {idx: item.idx, day: item.day, hours: this.state.hours} )}
    />
  )  


  keyExtractor = (item, index) => item.day



  render() {
    return (
      <View style={css.screen.defaultScreen}>
          <FlatList
            keyExtractor={this.keyExtractor}
            data={this.state.days}
            style={{width: "100%"}}
            renderItem={this.renderItem}
          />
      </View>
    )
  }
}
