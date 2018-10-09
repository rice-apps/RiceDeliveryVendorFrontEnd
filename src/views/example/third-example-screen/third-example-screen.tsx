import * as React from "react"
import { NavigationScreenProps } from "react-navigation"
import { View, TextInput, TouchableHighlight, ViewStyle, TextStyle, SafeAreaView } from "react-native"
import { Header } from "../../shared/header"
import { Screen } from "../../shared/screen"
import { Text } from "../../shared/text"
import { Button } from "../../shared/button"
import { Wallpaper } from "../../shared/wallpaper"
import { color, spacing } from "../../../theme"
import { BulletItem } from "../bullet-item"

import { Api } from "../../../services/api/api"

const TEXT: TextStyle = { 
  color: color.palette.white,
  fontFamily: "Montserrat",
}
const BOLD: TextStyle = { fontWeight: "bold" }
const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
    backgroundColor: color.transparent,
    paddingHorizontal: spacing[4],
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
  const TITLE: TextStyle = {
    ...BOLD,
    fontSize: 28,
    lineHeight: 38,
    textAlign: "center",
    marginBottom: spacing[5],
  }
const FOOTER: ViewStyle = { backgroundColor: "#20162D" }
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4], 
  paddingHorizontal: spacing[4],
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

const darkSkyKey = "62b37bb38c07e1acdff739f253676d11"
  

export interface ThirdExampleScreenProps extends NavigationScreenProps<{}> {}

export class ThirdExampleScreen extends React.Component<ThirdExampleScreenProps, {text: string, weather: string}> {

  constructor(props) {
    super(props)
    this.state = {
      text: '',
      weather: ''
    };
  }

  nextScreen = () => this.props.navigation.navigate("secondExample")

  goBack = () => this.props.navigation.goBack(null)

  onSubmitEdit = () => {
    this.setState({weather: this.state.text})
  }

    render() {
        return (
            <View style={FULL}>
            <Wallpaper />
            <SafeAreaView style={FULL}>
              <Screen style={CONTAINER} backgroundColor={color.transparent} preset="scrollStack">
                  <Header
                  // headerTx="secondExampleScreen.howTo"
                  headerTx="thirdExampleScreen.header"
                  leftIcon="back"
                  onLeftPress={this.goBack}
                  style={HEADER}
                  titleStyle={HEADER_TITLE}
                  />
                  <Text style={TITLE} preset="header" tx={"thirdExampleScreen.title"} />
                  <BulletItem text="This is the APIsauce demo" />
                  <TextInput
                    style={{height: 40, backgroundColor: 'white'}}
                    placeholder="Type here!"
                    onChangeText={(input) => this.setState({text: input})}
                    // value={this.state.text}
                    // onChangeText={(text) => this.setState({text})},
                    // returnKeyType='My Custom button'
                    // onSubmitEditing={(event) => this.updateText(event.nativeEvent.text)}
                    />

                    <Button 
                    textStyle={CONTINUE_TEXT}
                    style={{backgroundColor: "#5D2555"}}
                    tx="thirdExampleScreen.submitBtn"
                    onPress={this.onSubmitEdit}
                    />

                  <Text >
                    {"\n"}{this.state.weather}
                  </Text>
        

  
                </Screen>
                </SafeAreaView>

                // Button
                <SafeAreaView style={FOOTER}>
                    <View style={FOOTER_CONTENT}>
                      <Button
                        style={CONTINUE}
                        textStyle={CONTINUE_TEXT}
                        tx="thirdExampleScreen.nextBtn"
                        onPress={this.nextScreen}
                        />
                    </View>
                  </SafeAreaView>

              </View>
        )
    }
}