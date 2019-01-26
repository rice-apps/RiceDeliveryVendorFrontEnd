import { Button } from 'react-native-elements'
import React from 'react'
<<<<<<< HEAD

=======
>>>>>>> 222d2c5bdd146ccdf069963a5c6d42b940ab6c35
export default class PrimaryButton extends React.Component {
    render() {
        const {title } = this.props;
        return (
            <Button
                title = {title}
                buttonStyle={{
                    backgroundColor: "rgba(92, 99,216, 1)",
                    borderColor: "transparent",
                    borderWidth: 2,
                    borderRadius: 5
                }}
            />
        )
    }
}