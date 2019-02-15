import { Button } from 'react-native-elements'
import React from 'react'
import * as css from "./style.ts";

export default class PrimaryButton extends React.Component {
    render() {
        const {title, onPress} = this.props;
        return (
            <Button
                title = {title}
                buttonStyle={css.button.primaryButton}
                style={{margin: 10}}
                onPress = {onPress}

            />
        )
    }
}