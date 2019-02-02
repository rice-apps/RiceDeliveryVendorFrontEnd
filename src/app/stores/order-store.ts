import { types } from "mobx-state-tree"
import { Location } from "./location-store"

export const OrderItem = types.model("OrderItem", {
  amount: types.number,
  description: types.string,
  parent: types.string,
  quantity: types.number
})

export const Order = types.model("Order", {
  _id: types.string,
  amount: types.number,
  created: types.number,
  customer: types.string,
  email: types.string,
  items: types.array(OrderItem),
  orderStatus: types.Date, //Might not convert int to date.
  paymentStatus: types.string, 
  location: Location
})

export const Batch = types.model('Location', {
  _id: types.string,
  orders: types.array(Order)
})

export const OrderModel = types.model("OrderModel", {
  pending: types.array(Order),
  onTheWay: types.array(Batch), 
})

