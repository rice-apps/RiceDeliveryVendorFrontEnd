import * as React from "react"
import { View, ViewStyle, TextStyle, ImageStyle, SafeAreaView } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { Screen } from "../../shared/screen"
import { Button } from "../../shared/button"
import { Wallpaper } from "../../shared/wallpaper"
import { Header } from "../../shared/header"
import { color, spacing } from "../../../theme"

import { OrderComponent } from "../../../app/component/order-component"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const DEMO: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: "#5D2555",
}
const BOLD: TextStyle = { fontWeight: "bold" }
const DEMO_TEXT: TextStyle = {
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[5] - 1,
  paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = {
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}

export interface LoginTestScreenProps extends NavigationScreenProps<{}> {}

export class LoginTestScreen extends React.Component<LoginTestScreenProps, {}> {
  goBack = () => this.props.navigation.goBack(null)
  login = () => this.props.navigation.navigate("exampleTab")

  static navigationOptions = ({ navigation }) => ({
    drawerLabel: 'loginExample',
  })

  render() {
    return (
      <View style={FULL}>
        <Wallpaper />
        <SafeAreaView style={FULL}>
          <Screen style={CONTAINER} backgroundColor={color.transparent} preset="scrollStack">
            <Header
              headerTx="loginTestScreen.loginTest"
              leftIcon="back"
              onLeftPress={this.goBack}
              style={HEADER}
              titleStyle={HEADER_TITLE}
            />

            <View>
              <Button
                style={DEMO}
                textStyle={DEMO_TEXT}
                tx="loginTestScreen.login"
                onPress={this.login}
              />
            </View>

            <OrderComponent name="Amy" college="Brown" phoneNumber="12345678" orderTime={221} items={[]}>

            </OrderComponent>
            
          </Screen>
        </SafeAreaView>
      </View>
    )
  }
}
