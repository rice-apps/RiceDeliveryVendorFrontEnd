import * as React from "react"
import { ScrollView, View, AsyncStorage, FlatList } from "react-native"
import { ListItem } from "react-native-elements"
import SecondaryButton from "../../../../components/secondary-button"
import * as css from "../../../style"
import { NavigationScreenProps, NavigationScreenProp } from "react-navigation"
import CookieManager from "react-native-cookies"

interface accountScreenProps {
  navigation: NavigationScreenProp<any, any>
}

export class AccountScreen extends React.Component<accountScreenProps, any> {
  list = [
    {
      name: "Hours of Operation",
      subtitle: "Change hours of operation",
      navigateTo: "HoursOperation",
    },
    {
      name: "Transaction History",
      subtitle: "View all past orders",
      navigateTo: "TransactionHist",
    },
  ]

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <ListItem
      titleStyle={css.text.bodyText}
      title={item.name}
      subtitle={item.subtitle}
      onPress={() => this.props.navigation.navigate(item.navigateTo)}
    />
  )

  logoutHandler = () => {
    this.props.navigation.navigate("Login")
  }
  render() {
    return (
      <View style={css.screen.paddedScreen}>
        <View>
          <FlatList
            keyExtractor={this.keyExtractor}
            data={this.list}
            renderItem={this.renderItem}
            scrollEnabled={false}
          />
        </View>
        <View>
          <SecondaryButton
            title="Logout"
            onPress={() => {
              CookieManager.get(
                "https://idp.rice.edu/idp/profile/cas/login?service=https://www.gizmodo.com",
              ).then(res => {
                console.log("CookieManager.get =>", res)
              })
              CookieManager.clearAll().then(res => console.log("CookieManager.clearAll =>", res))
              AsyncStorage.removeItem("Authenticated")
              this.props.navigation.reset({
                index: 0,
                actions: [this.props.navigation.navigate("Login")],
              })
            }}
          />
        </View>
      </View>
    )
  }
}
