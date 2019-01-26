import * as React from 'react'
import { View, Text, FlatList} from 'react-native';
import { ListItem } from 'react-native-elements'
<<<<<<< HEAD
=======
import { CurrentBatchesScreen } from '../current-batches-screen';
>>>>>>> 9335b4f4f925460a4352c2187fecafd41fe29591


export class AccountScreen extends React.Component<any, any> {

  list = [
    {
      name: 'Vendor Name',
<<<<<<< HEAD
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
=======
      subtitle: 'Change vendor information'
    },
    {
      name: 'Hours of Operation',
      subtitle: 'Change hours of operation'
    },
    {
      name: 'Menu',
      subtitle: 'Change the menu for the night'
>>>>>>> 9335b4f4f925460a4352c2187fecafd41fe29591
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
<<<<<<< HEAD
      subtitle={item.subtitle}s
      onPress={() =>  this.props.navigation.navigate(item.navigateTo)}
=======
      subtitle={item.subtitle}
      // Add your screen to the root navigator and then navigate to each of them. We may need another element in the list
      // above to define which screen each button navigates to. Otherwise, if we just defined the navigate here, clicking
      // every item on this list will redirect to the same screen
      //onPress={() =>  this.props.navigation.navigate('')}
>>>>>>> 9335b4f4f925460a4352c2187fecafd41fe29591
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