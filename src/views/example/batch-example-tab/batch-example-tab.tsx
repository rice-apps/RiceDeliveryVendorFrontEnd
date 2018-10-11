import * as React from "react"
import {
  View,
  Text,
  StyleSheet,
  TextStyle,
} from 'react-native'
import { Header } from "../../shared/header"
import { spacing } from "../../../theme"
import { NavigationScreenProps } from "react-navigation"

// this is just the style that I borrowed from the ignite boilerplate code from the other screens
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[5] - 1,
  paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = {
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}

// in order to have access to the props passed from the root navigator, we need to create a custom interface
export interface BatchExampleTabProps extends NavigationScreenProps<{}> {}

// this is just some boilerplate code borrowed from the internet, but the important thing to note is that we
// must export the class BatchTab in order to be able to import it into our navigator

// we must have the custom interface as part of React.Component in order to navigate back in the stack
export class BatchTab extends React.Component<BatchExampleTabProps, {}> {
  goBack = () => this.props.navigation.goBack(null)

  // the Header has a leftIcon that is just the back button; onLeftPress tells it what to do when the the back
  // is pressed. Right now, it calls the goBack method, which navigates us back in the stack defined by rootNavigator
  render () {
    return (
      <View style={styles.container}>
      <Header
            leftIcon="back"
            onLeftPress={this.goBack}
            style={HEADER}
            titleStyle={HEADER_TITLE}
            />
        <Text style={styles.text}>I'm the BatchTab</Text>
      </View>
      )
  }
}

// the code below merely controls the text that I currently have displayed
export default BatchTab
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c0392b',
    padding: 20,
  },
  text: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  }
})