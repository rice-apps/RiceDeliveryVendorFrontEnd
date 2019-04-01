import React from "react"
import { View, Text, Image, AsyncStorage } from "react-native"
import PrimaryButton from "../../../components/primary-button"
import { RootStore } from "../../../stores/root-store"
import { NavigationScreenProps } from "react-navigation"
import AuthModal from "../../../components/auth-modal"
import * as css from "../../style"
import { inject, observer } from "mobx-react"

console.disableYellowBox = true

export interface LoginScreenProps extends NavigationScreenProps<{}> {
  rootStore?: RootStore
}

@inject("rootStore")
@observer
class LoginScreen extends React.Component<
  LoginScreenProps,
  { modalVisible: boolean; rootStore: RootStore }
> {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      rootStore: this.props.rootStore,
    }
  }

  async onSuccess() {
    // Cache data for persistence
    await AsyncStorage.setItem("Authenticated", this.state.rootStore.vendorStore.user.netID)
    if (!this.state.rootStore.vendorStore.hasAccount) {
      // user account does not exist
      // Navigate to screen for account information
      console.log("Has Account " + this.state.rootStore.vendorStore.hasAccount)
      this.props.navigation.replace("Tabs")
    } else {
      // user account exists
      this.setState({ modalVisible: false }, () => this.props.navigation.navigate("Tabs"))
    }
  }

    onFailure() {
        this.setState({ modalVisible: false }, () => {
            // TODO: Change this to screen indicating they don't have permission
            (() => { this.props.navigation.replace("Login") })();
        }
        );
    }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible })
  }

  loginHandler = async () => {
    const authenticated = await AsyncStorage.getItem("Authenticated")
    if (!authenticated) {
      this.setModalVisible(!this.state.modalVisible)
    } else {
      this.props.navigation.navigate("Tabs")
    }
  }

  render() {
    return (
      <View style={[css.screen.defaultScreen, {backgroundColor: "purple"}]}>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <View style={{ width: "50%", height: 200 }} />
          <Text style={[css.text.logo, {color:"white"}]}>
            hedwig.
            <Image source={require("../../../img/hedwig.png")} style={css.image.logo} />
          </Text>
          <PrimaryButton title="Sign In" onPress={this.loginHandler} />
        </View>
        <AuthModal
          visible={this.state.modalVisible}
          setVisible={this.setModalVisible.bind(this)}
          onSuccess={this.onSuccess.bind(this)}
          onFailure={this.onFailure.bind(this)}
        />
      </View>
    )
  }
}

export default LoginScreen
