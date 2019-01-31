import { Button } from 'react-native-elements'
import React from 'react'

const style = require("./style.ts")

export default class SecondaryButton extends React.Component {
    render() {
        const {title, onPress} = this.props;
        return (
            <Button
                title = {title}
                buttonStyle={style.secondaryButton}
                style={{margin: 2}}
                onPress = {onPress}
            />
        )
    }
}