
import * as React from 'react'
import { View, Text, FlatList, StyleSheet, Button} from 'react-native';

export class PendingOrdersScreen extends React.Component<any, any> {
  render() {
    return (
      <View>
        <FlatList
        data={[
          {key: 'Devin'},
          {key: 'Jackson'},
          {key: 'James'},
          {key: 'Joel'},
          {key: 'John'},
          {key: 'Jillian'},
          {key: 'Jimmy'},
          {key: 'Julie'},
        ]}
        renderItem={({item}) => 
        <View>
          <Text style={styles.item}>{item.key}</Text>
          <Button
            onPress= {this.changeOrderStatus}
            title="Change Order Status"
           />
        </View>}
        />
      </View>
    
      )
  }

  changeOrderStatus() {

  }
}
const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})
