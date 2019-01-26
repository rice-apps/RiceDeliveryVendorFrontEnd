import { Button } from 'react-native-elements'

export default class PrimaryButton extends React.Component {
    render() {
        const {title } = this.props;
        return (
            <Button
                title = {title}
                buttonStyle={{
                    backgroundColor: "rgba(92, 99,216, 1)",
                    width: 300,
                    height: 45,
                    borderColor: "transparent",
                    borderWidth: 0,
                    borderRadius: 5
                }}
            />
        )
    }
}