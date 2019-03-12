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
      name: "Vendor Name",
      subtitle: "Change vendor information",
      navigateTo: "VendorInfo",
    },
    {
      name: "Hours of Operation",
      subtitle: "Change hours of operation",
      navigateTo: "HoursOperation",
    },
    {
      name: "Menu",
      subtitle: "Change the menu for the night",
      navigateTo: "Menu",
    },
    {
      name: "Transaction History",
      subtitle: "View all past orders",
      navigateTo: "TransactionHist",
    },
  ]

  keyExtractor = (item, index) => index

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
        <ScrollView>
          <FlatList
            keyExtractor={this.keyExtractor}
            data={this.list}
            renderItem={this.renderItem}
          />
        </ScrollView>
        <View>
          <SecondaryButton
            title="Logout"
            onPress={() => {
              CookieManager.get(
                "https://idp.rice.edu/idp/profile/cas/login?service=https://riceapps.org",
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
