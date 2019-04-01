import React from "react"
import * as css from "../style"
import { View, ActivityIndicator } from "react-native"

class LoadingScreen extends React.Component<any, any> {
  render() {
    return (
      <View style={css.screen.defaultScreen}>
        <ActivityIndicator animating={true} size="large" color="purple" />
      </View>
    )
  }
}

export default LoadingScreen
