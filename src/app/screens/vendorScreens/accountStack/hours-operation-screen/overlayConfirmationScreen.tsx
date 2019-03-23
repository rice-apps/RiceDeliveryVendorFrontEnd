import React from "react"
import { Overlay } from "react-native-elements"
import { View, Text } from "react-native"
import * as css from "../../../style"
import PrimaryButton from "../../../../components/primary-button";

export class OverlayConfirmationScreen extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }


  render() {
    const { queryFunction, loadPending, openingTime, closingTime } = this.props

    return (
      <Overlay isVisible animationType="fade">
        <View style={[css.screen.paddedScreen, css.screen.centerContent]}>
          <Text>Please confirm changes</Text>
          <Text>New Opening Time: {openingTime.toUpperCase()} </Text>
          <Text>New Closing Time: {closingTime.toUpperCase()} </Text>
          <PrimaryButton 
            title="Confirm Changes" 
              onPress={queryFunction} 
              loading={loadPending} />
        </View>
      </Overlay>
    )
  }
}
