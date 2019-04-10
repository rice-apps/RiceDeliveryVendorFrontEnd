import Icon from "react-native-vector-icons/Ionicons"
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons"
import React from "react"

const pendingOrdersIcon = () => <MaterialIcons name="progress-clock" size = {20}/>
const currentBatchesIcon = () => <MaterialIcons name="truck-delivery" size = {20} />
const accountIcon = () => <Icon name="ios-settings"  size = {20}/>

export { currentBatchesIcon, pendingOrdersIcon, accountIcon }
