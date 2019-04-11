import { Button } from "react-native-elements"
import React from "react"
import * as css from "./style"

export default class PrimaryButton extends React.Component<any, any> {
  render() {
    const { title, onPress, loading, disabled } = this.props
    return (
      <Button
        title={title}
        buttonStyle={css.button.primaryButton}
        style={{ marginTop: 2, marginBottom: 2 }}
        onPress={onPress}
        loading={loading}
        disabled={disabled}
      />
    )
  }
}
