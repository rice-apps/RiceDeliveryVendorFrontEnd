import React from 'react'
import {View, Text, Button, TextInput} from 'react-native'
import PrimaryButton from '../../../components/primary-button.js'
import SecondaryButton from '../../../components/secondary-button.js'

console.disableYellowBox = true;

const style = require("../../style");

class LoginScreen extends React.Component {

    loginHandler = () => {
        this.props.navigation.navigate("Tabs")
    }

    render() {
        return (
            <View style={style.defaultScreen}>

                <Text style={style.headerText}>
                    hedwig.
                </Text>

                <Text style={style.regularText}>
                Email
                </Text>

                <TextInput 
                    style = {style.textInput}
                    placeholder = "Enter email"
                    selectionColor = "#CCCCCC"
           
                />

                
                
               
                <Text style={style.regularText}>
                Password
                </Text>
                
        
                <TextInput 
                    style = {style.textInput}
                    placeholder="Enter password"
                />        
    

                <PrimaryButton
                    title ="Sign In"
                    onPress={this.loginHandler}
                />

                <SecondaryButton
                    title ="Create Account"
                />

            </View>
        )
    }
}

export default LoginScreen