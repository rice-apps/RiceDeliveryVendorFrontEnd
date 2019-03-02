import React, {Component} from 'react';
import {Modal, Text, TouchableHighlight, View, Alert} from 'react-native';
import AuthenticationComponent from './authentication'
import PrimaryButton from './primary-button.js'

export interface AuthModalProps {
        visible?: boolean;
        setVisible?: Function;
        onSuccess?: Function;
        onFailure?: Function;
}

export class AuthModal extends React.Component<AuthModalProps, {}> {
        
        render() {
                return (
                        <View style={{marginTop: 22}}>
                        <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.props.visible}
                        onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        }}>
                        <AuthenticationComponent onSuccess = {this.props.onSuccess} onFailure={this.props.onFailure}>
                        </AuthenticationComponent>
                        <PrimaryButton
                                title ="Cancel"
                                onPress={() => {
                                        this.props.setVisible(!this.props.visible);
                                        }}>                       
                        </PrimaryButton>
                        </Modal>
                        </View>
                );
        }       
}

export default AuthModal
