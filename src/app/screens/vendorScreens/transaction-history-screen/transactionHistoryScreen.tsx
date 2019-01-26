import * as React from 'react'
import { View, Text, FlatList} from 'react-native';
import { ListItem } from 'react-native-elements'


export class AccountScreen extends React.Component<any, any> {

  list = [
    {
      name: 'Vendor Name',
      subtitle: 'Change vendor information',
      navigateTo: 'VendorInfo'
    },
    {
      name: 'Hours of Operation',
      subtitle: 'Change hours of operation',
      navigateTo: 'HoursOperation'
    },
    {
      name: 'Menu',
      subtitle: 'Change the menu for the night',
      navigateTo: 'Menu'
    },
    {
      name: 'Transaction History',
      subtitle: 'View all past orders'
    },
  ];

  keyExtractor = (item, index) => index

  renderItem = ({ item }) => (
    <ListItem
      title={item.name}
      subtitle={item.subtitle}s
      onPress={() =>  this.props.navigation.navigate(item.navigateTo)}
    />
  )
  render() {

    return (
      <FlatList
        keyExtractor={this.keyExtractor}
        data={this.list}
        renderItem={this.renderItem}
      />
    )
  }
}