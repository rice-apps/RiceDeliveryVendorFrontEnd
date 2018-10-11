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
import { ApiConfig } from "../../../services/api/api-config"

import {create} from 'apisauce'

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

// key for the dark sky api
const darkSkyKey = "62b37bb38c07e1acdff739f253676d11"

// demo api
const demoAPI = create({
  baseURL: 'https://jsonplaceholder.typicode.com',
})

// create the api
const api = create({
  baseURL: 'https://api.github.com',
  headers: {'Accept': 'application/vnd.github.v3+json'}
})

const testAPI = new Api({
  url :  'https://api.github.com',
  timeout : 300
})


export interface ThirdExampleScreenProps extends NavigationScreenProps<{}> {}

export class ThirdExampleScreen extends React.Component<ThirdExampleScreenProps, {owner: string, repo: string, demo: string}> {

  constructor(props) {
    super(props)
    this.state = {
      owner: '',
      repo: '',
      demo: ''
    };
  }

  nextScreen = () => this.props.navigation.navigate("secondExample")

  goBack = () => this.props.navigation.goBack(null)

  onSubmitEdit = () => {
  
    api
    .get('/repos/' + this.state.owner + '/' + this.state.repo + '/commits')
    .then(resp => this.setState({demo: resp.data[0].commit.message}))


    // make the get call
    // testAPI.getDemo(this.state.owner, this.state.repo)
    //   .then(response => {
    //     this.setState({demo: response.data[0].commit.message})
    //   })

  }

    render() {
        return (
            <View style={FULL}>
            <Wallpaper />
            <SafeAreaView style={FULL}>
              <Screen style={CONTAINER} backgroundColor={color.transparent} preset="scrollStack">
                  <Header
                  headerTx="thirdExampleScreen.header"
                  leftIcon="back"
                  onLeftPress={this.goBack}
                  style={HEADER}
                  titleStyle={HEADER_TITLE}
                  />
                  <Text style={TITLE} preset="header" tx={"thirdExampleScreen.title"} />
                  <Text style={{paddingBottom: 10}} text="Enter in your Github repository info" />

                  <TextInput
                    style={{height: 40, backgroundColor: 'white', paddingLeft: 10}}
                    placeholder="Owner"
                    onChangeText={(input) => this.setState({owner: input})}
                  />

                  <TextInput
                    style={{height: 40, backgroundColor: 'white', paddingLeft: 10}}
                    placeholder="Repository"
                    onChangeText={(input) => this.setState({repo: input})}
                  />

                  <Button 
                    textStyle={CONTINUE_TEXT}
                    style={{backgroundColor: "#5D2555"}}
                    tx="thirdExampleScreen.submitBtn"
                    onPress={this.onSubmitEdit}
                  />

                  <Text style={{paddingTop: 10,paddingBottom: 10}} text="Latest commit message:" />

                  <Text >
                    {"\n"}{this.state.demo}
                  </Text>
        

  
                </Screen>
                </SafeAreaView>


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