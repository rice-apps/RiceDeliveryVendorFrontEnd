import * as React from "react"
import { Header } from "./header-component"
import { setupRootStore } from "./setup-root-store"
import { RootNavigator } from "../navigation/root-navigator"
import { RootStore } from "./stores/root-store"
import { Provider } from "mobx-react"
import { BackButtonHandler } from "../navigation/back-button-handler"
import { contains } from "ramda"
import SplashScreen from "react-native-splash-screen"
import { YellowBox, View, StyleSheet, StatusBar, Platform } from 'react-native'
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated'])
YellowBox.ignoreWarnings(['Module RCTImageLoader requires',]);
YellowBox.ignoreWarnings(['Class RCTCxxModule']);
interface RootComponentState {
  rootStore?: RootStore
}

/**
 * This is the root component of our app.
 */
export class RootComponent extends React.Component<{}, RootComponentState> {
  /**
   * When the component is mounted. This happens asynchronously and simply
   * re-renders when we're good to go.
   */
  async componentDidMount() {
    SplashScreen.hide()
    this.setState({
      rootStore: await setupRootStore(),
    })
  }

  /**
   * Are we allowed to exit the app?  This is called when the back button
   * is pressed on android.
   *
   * @param routeName The currently active route name.
   */
  canExit(routeName: string) {
    return contains(routeName)
  }

  render() {
    const rootStore = this.state && this.state.rootStore

    // Before we show the app, we have to wait for our state to be ready.
    // In the meantime, don't render anything. This will be the background
    // color set in native by rootView's background color.
    //
    // This step should be completely covered over by the splash screen though.
    //
    // You're welcome to swap in your own component to render if your boot up
    // sequence is too slow though.
    if (!rootStore) {
      return null
    }

    // otherwise, we're ready to render the app

    // --- am: begin list of stores ---
    const otherStores = {}
    // --- am: end list of stores ---
    return (
      <Provider rootStore={rootStore} {...otherStores}>
        <View style={styles.container}>
          <View style={{ height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight }}>
              <StatusBar />
            </View>
            <Header />
            <RootNavigator />        
        </View>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})