import * as React from "react"
import { View, ViewStyle, TextStyle, ImageStyle, SafeAreaView, StatusBar } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { Text } from "../../shared/text"
import { Button } from "../../shared/button"
import { Screen } from "../../shared/screen"
import { Wallpaper } from "../../shared/wallpaper"
import { Header } from "../../shared/header"
import { color, spacing } from "../../../theme"

import { BatchComponent } from "../../../app/component/batch-component"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = { 
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const TEXT: TextStyle = { 
  color: color.palette.white,
  fontFamily: "Montserrat",
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = { 
  ...TEXT,
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const TITLE_WRAPPER: TextStyle = { 
  ...TEXT,
  textAlign: "center",
  paddingBottom: 20,
}
const TITLE: TextStyle = { 
  ...TEXT, 
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
}
const BOWSER: ImageStyle = {
  alignSelf: "center",
  marginVertical: spacing[5],
  maxWidth: "100%",
}
const CONTENT: TextStyle = {
  ...TEXT,  
  color: "#BAB6C8",  
  fontSize: 15,
  lineHeight: 22,
  marginBottom: spacing[5],
}
const CONTINUE: ViewStyle = { 
  paddingVertical: spacing[4], 
  paddingHorizontal: spacing[4],
  backgroundColor: "#5D2555",
}
const CONTINUE_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}
const FOOTER: ViewStyle = { backgroundColor: "#20162D" }
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4], 
  paddingHorizontal: spacing[4], 
}



// Some sample test data

// Items
const apple = {
  itemName: "Apple",
  quantity: 4,
}
const orange = {
  itemName: "Apple",
  quantity: 4,
}
const bananas = {
  itemName: "Apple",
  quantity: 4,
}

// Orders
const johnnyOrder = {
  name: "Johnny",
  college: "Jones",
  phoneNumber: "hit me up",
  orderTime: 14200,
  items: [apple, orange, bananas],
}
const amyOrder = {
  name: "Amy",
  college: "Brown",
  phoneNumber: "hehe",
  orderTime: 233111,
  items: [apple, orange, bananas],
}
const justinOrder = {
  name: "Justin",
  college: "Martel",
  phoneNumber: "idk",
  orderTime: 7345125,
  items: [apple, orange, bananas],
}

// Batch
const batch = {
  orders: [johnnyOrder, amyOrder, justinOrder],
  status: "On the way",
}


export interface FirstExampleScreenProps extends NavigationScreenProps<{}> {}

export class FirstExampleScreen extends React.Component<FirstExampleScreenProps, {}> {
  nextScreen = () => this.props.navigation.navigate("secondExample")

  render() {
    return (
      <View style={FULL}>
        <StatusBar barStyle="light-content" />      
        <Wallpaper />
        <SafeAreaView style={FULL}>

          <Screen style={CONTAINER} backgroundColor={color.transparent} preset="scrollStack">
            <Header
              headerTx="firstExampleScreen.poweredBy"
              style={HEADER}
              titleStyle={HEADER_TITLE}
            />
            <Text style={TITLE_WRAPPER}> 
              <Text style={TITLE} text="Current Batches" />
            </Text>

            <BatchComponent batches={batch} ></BatchComponent>

          </Screen>
          
        </SafeAreaView>
        <SafeAreaView style={FOOTER}>
          <View style={FOOTER_CONTENT}>
            <Button
              style={CONTINUE}
              textStyle={CONTINUE_TEXT}
              tx="firstExampleScreen.continue"
              onPress={this.nextScreen}
              />
          </View>
        </SafeAreaView>
      </View>
    )
  }
}
