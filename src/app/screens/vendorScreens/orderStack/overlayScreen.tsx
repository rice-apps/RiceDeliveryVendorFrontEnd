import React from 'react'
import { Overlay } from 'react-native-elements';
import { View, Text } from 'react-native';
import PrimaryButton from '../../../components/primary-button';
import * as css from "../../style"

export class OverlayScreen extends React.Component<any, any> {
    constructor(props) {
        super(props)
    }

    render() {
        const {queryFunction, loading} = this.props
        return (
            <Overlay 
            isVisible
            animationType="fade"
            >
            <View style={[css.screen.paddedScreen, css.screen.centerContent]}>
                <Text>Uh Oh!</Text>
                <Text>There seems to be a network error.</Text>
              <PrimaryButton 
                title="Retry"
                onPress={queryFunction}
                loading={loading}
              />
            </View>
          </Overlay>

        )
    }

}