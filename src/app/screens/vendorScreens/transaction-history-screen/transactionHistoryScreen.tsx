import * as React from 'react'
import { View, Text, FlatList} from 'react-native';
import { ListItem } from 'react-native-elements'


export class AccountScreen extends React.Component<any, any> {

  list = [
    {
      name: 'Vendor Name',
      subtitle: 'Change vendor information'
    },
    {
      name: 'Hours of Operation',
      subtitle: 'Change hours of operation'
    },
    {
      name: 'Menu',
      subtitle: 'Change the menu for the night'
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
      subtitle={item.subtitle}
      // Add your screen to the root navigator and then navigate to each of them. We may need another element in the list
      // above to define which screen each button navigates to. Otherwise, if we just defined the navigate here, clicking
      // every item on this list will redirect to the same screen
      //onPress={() =>  this.props.navigation.navigate('')}
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