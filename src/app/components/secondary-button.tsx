import { Button } from "react-native-elements"
import React from "react"
import * as css from "./style"

export default class SecondaryButton extends React.Component<any, any> {
  render() {
    const { title, onPress, loading, disabled} = this.props
    return (
      <Button
        title={title}
        buttonStyle={css.button.secondaryButton}
        style={{ margin: 2 }}
        onPress={onPress}
        loading={loading}
        disabled={disabled}
      />
    )
  }
}
