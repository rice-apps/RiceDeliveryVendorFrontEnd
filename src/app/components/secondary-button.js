import { Button } from 'react-native-elements'
import React from 'react'

export default class SecondaryButton extends React.Component {
    render() {
        const {title } = this.props;
        return (
            <Button
                title = {title}
                buttonStyle={{
                    borderColor: "rgba(92, 99,216, 1)",
                    color: "black",
                    backgroundColor: "transparent",
                    borderWidth: 2,
                    borderRadius: 5
                }}
            />
        )
    }
}