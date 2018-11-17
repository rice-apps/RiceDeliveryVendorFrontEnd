import { types } from "mobx-state-tree"
import { MenuItem, Location } from './menu-store'
import { User } from './user-store'

export const OrderItem = types.model("OrderItem", {
  item: MenuItem, 
  quantity: types.number
})
export const OrderStatus = types.model("OrderStatus", {
  _id: types.string, 
  pending: types.string, 
  onTheWay: types.string, 
  fulfilled: types.string, 
  unfulfilled: types.boolean,
})

export const Order = types.model("Order", {
  _id: types.string,
  location: Location,
  items: types.array(OrderItem),
  status: OrderStatus,
  user: User
})
