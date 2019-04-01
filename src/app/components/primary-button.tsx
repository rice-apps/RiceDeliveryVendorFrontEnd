import { Button } from "react-native-elements"
import React from "react"
import * as css from "./style"

export default class PrimaryButton extends React.Component<any, any> {
  render() {
    const { title, onPress, loading } = this.props
    return (
      <Button
        title={title}
        buttonStyle={css.button.primaryButton}
        style={{ margin: 10 }}
        onPress={onPress}
        loading={loading}
      />
    )
  }
}
