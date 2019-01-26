import * as React from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Order , OrderListItem} from "./order-list-item"
// import { Order } from "../stores/order-store"

// Again, not using Order model from order store, using mock interface
  
interface OrderListProps {
    orders : [Order]
}

export class OrderList extends React.Component<OrderListProps, any> {
    
    constructor(props) {
        super(props)
    }
    
    render() {
        return (
            <View style={styles.flatList}>
                <FlatList
                style={styles.flatList}
                data= {this.props.orders}
                renderItem={({item}) => 
                    < OrderListItem order={item}></OrderListItem>
                }
              />
            </View>
            )
      
    }
}
const styles = StyleSheet.create({
    container: {
     flex: 1,
     justifyContent: "center", 
     alignItems: "center"
    },
    flatList: {
      width: "100%"
    }
  })
  