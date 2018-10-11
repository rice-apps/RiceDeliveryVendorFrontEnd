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

import UserStore  from "../../../teststore/userStore" //importing it from userStore, the store I created
import { observer } from 'mobx-react'


const initialState = {
  name: '',
  vip: false
}
@observer
export class ThirdExampleScreen extends React.Component<ThirdExampleScreenProps> {

  state = initialState
  onChangeText(key, value) {
    this.setState({
      [key] : value
    })
  }
  addUser(){
    UserStore.addUser(this.state)
    this.setState(initialState)
  }
  toggleVip(user) {
    user.toggleVip()
  }
  delete(user) {
    UserStore.removeUser(user)
  }


  nextScreen = () => this.props.navigation.navigate("secondExample")
  goBack = () => this.props.navigation.goBack(null)
  
    render() {
        const { names } = UserStore
        return (
            <View style={FULL}>
            <Wallpaper />
            <SafeAreaView style={FULL}>
              <Screen style={CONTAINER} backgroundColor={color.transparent} preset="scrollStack">
                  <Header headerTx="thirdExampleScreen.header"/>
                  <Text style={TITLE} preset="header" tx={"thirdExampleScreen.title"} />



                  <TextInput
                    value = {this.state.name}
                     style={{height: 40, backgroundColor: 'white'}}
                    placeholder="Type here!"
                    onChangeText={value => this.onChangeText('name', value)} //changes everytime text changes
                    />

                    <Button 
                     textStyle={CONTINUE_TEXT}
                    style={{backgroundColor: "#5D2555"}}
                    tx="thirdExampleScreen.submitBtn"
                     onPress={this.addUser.bind(this)}  />
                     {
                      names.map((user, index) => (
                        <View  key ={index}>
                          <Text>Member name: {user.name}</Text>)

                          <Text onPress={() => this.toggleVip(user)} key={index}>
                          Vip: {user.vip ? 'Yes': 'No'}
                          </Text>
                          
                          <Text onPress = {() => this.delete(user)}> Delete </Text>

                        </View>
                      ))
                     }
                  




                  
                </Screen>
                </SafeAreaView>
              
                <SafeAreaView style={FOOTER}>
                <BulletItem text="Borrowed this page from Johnny" />
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
