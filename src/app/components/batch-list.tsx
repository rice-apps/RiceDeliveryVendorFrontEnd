import * as React from 'react'
import { View, FlatList, StyleSheet, Text } from 'react-native';
import BatchListItem from './batch-list-item';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { color } from '../../theme'
import { inject, observer } from 'mobx-react';
import { Batch } from '../stores/order-store';


// Using temporary Batch object
  
interface BatchListProps {
    batch?: Batch;

}

@inject("rootStore")
@observer
export class BatchList extends React.Component<BatchListProps, any> {
    constructor(props) {
        super(props)
    }
    
    render() {
        let { _id, orders } = this.props.batch;
        return (
            <View style={styles.flatList}>
                <View style={styles.bodyText}>
                    <Text style={styles.bodyText}>
                        Batch {1}
                        <Icon name="navigate-next" size={30} color="black" />
                    </Text>
                </View>
                <FlatList
                style={styles.flatList}
                data= {orders}
                keyExtractor={(item, index) => item.toString()}
                renderItem={({item}) => 
                    <BatchListItem order={item}></BatchListItem>
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
    },
    bodyText: {
        paddingLeft : 0,
        color: color.storybookTextColor,
        textAlignVertical: 'center',
        // textAlign:'center',
        includeFontPadding: false,
        flex: 0,
        fontSize: 30,
        // fontFamily: typography.primary,
    },
  })
  