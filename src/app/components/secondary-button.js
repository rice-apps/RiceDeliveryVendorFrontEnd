import { Button } from 'react-native-elements'
import React from 'react'

export default class SecondaryButton extends React.Component {
    render() {
        const {title, onPress} = this.props;
        return (
            <Button
                title = {title}
                buttonStyle={{
                    borderColor: "rgba(92, 99,216, 0.4)",
                    backgroundColor: "rgba(92, 99,216, 0.4)",
                    borderWidth: 2,
                    borderRadius: 5,
                    margin: 5
                }}
                style={{margin: 2}}
                onPress = {onPress}
            />
        )
    }
}