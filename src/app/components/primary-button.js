import { Button } from 'react-native-elements'
import React from 'react'

const style = require("./style.ts")
export default class PrimaryButton extends React.Component {
    render() {
        const {title, onPress} = this.props;
        return (
            <Button
                title = {title}
                buttonStyle={style.primaryButton}
                style={{margin: 10}}
                onPress = {onPress}

            />
        )
    }
}