// @ts-ignore: until they update @type/react-navigation
import * as React from "react"
import { inject, observer } from "mobx-react"
import { View, Text } from "react-native";

interface orderProps {
  name: string,
  college: string, 
  phoneNumber: string, 
  orderTime: number
  items: item[]
}

interface item {
  itemName: string, 
  quantity: number, 
  other?: any
}

@observer
export class OrderComponent extends React.Component<orderProps, {}> {
  constructor(props: any) {
    super(props);
    this.state = {}
  }

  render() {
    return(
      <View>
        <Text>
          Hello
        </Text>
      </View>
    );
  }
}

