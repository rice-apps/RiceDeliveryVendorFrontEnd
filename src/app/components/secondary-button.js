import { Button } from 'react-native-elements'
import React from 'react'
import * as css from "./style.ts";

export default class SecondaryButton extends React.Component {
    render() {
        const {title, onPress} = this.props;
        return (
            <Button
                title = {title}
                buttonStyle={css.button.secondaryButton}
                style={{margin: 2}}
                onPress = {onPress}
            />
        )
    }
}