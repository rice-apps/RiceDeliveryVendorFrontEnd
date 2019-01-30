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

                <Text style={{fontSize:30}}>
                    LoginScreen 32
                </Text>
                <Text>Email</Text>
                <TextInput 
                    placeholder="Enter email"
                />
                <Text>Password</Text>
                <TextInput 
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