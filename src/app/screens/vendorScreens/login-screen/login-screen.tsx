import React from 'react'
import {View, Text, Button, TextInput} from 'react-native'

class LoginScreen extends React.Component {

    loginHandler = () => {
        this.props.navigation.navigate("Tabs")
    }

    render() {
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Text style={{fontSize:30}}>
                    LoginScreen
                </Text>
                <Text>Email</Text>
                <TextInput 
                    placeholder="Enter email"
                />
                <Text>Password</Text>
                <TextInput 
                    placeholder="Enter password"
                />                
                <Button 
                    title="Login"
                    onPress={this.loginHandler}
                />
            </View>
        )
    }
}

export default LoginScreen