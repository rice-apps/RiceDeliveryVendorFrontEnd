import { Button } from 'react-native-elements'
import React from 'react'
export default class PrimaryButton extends React.Component {
    render() {
        const {title, onPress} = this.props;
        return (
            <Button
                title = {title}
                buttonStyle={{
                    backgroundColor: "rgba(92, 99,216, 1)",
                    borderColor: "transparent",
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