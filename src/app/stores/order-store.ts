import { types, flow } from "mobx-state-tree"
import { Location } from "./location-store"
import gql from 'graphql-tag'
import { client } from '../../app/main'

// Notes: types.maybe allows the type to be nullable and optional.

export const OrderItem = types.model("OrderItem", {
  amount: types.number,
  description: types.string,
  parent: types.maybe(types.string),
  quantity: types.maybe(types.number)
})

export const OrderStatus = types.model("OrderStatus", {
  pending: types.maybe(types.string), //Is a date, may need to convert.
  onTheWay: types.maybe(types.string),
  fulfilled: types.maybe(types.string),
  unfulfilled: types.boolean
})

export const Order = types.model("Order", {
  id: types.string,
  amount: types.number,
  created: types.number,
  customer: types.maybe(types.string),
  email: types.maybe(types.string),
  items: types.array(OrderItem),
  orderStatus: OrderStatus,
  paymentStatus: types.string, 
  location: types.maybe(Location),
})

export const Batch = types.model('Batch', {
  _id: types.string,
  orders: types.array(Order)
})

export const OrderModel = types.model("OrderModel", {
  pending: types.array(Order),
  onTheWay: types.array(Batch), 
})
.actions(self => ({
  queryOrders:  flow(function* queryOrders() {
    const info = (yield client.query({
      query: GET_ORDER_STORE
    })) 
    self.pending = info.data.order;
    return self.pending;
  }) //flow
})) //


// Query info for the orderStore.
const GET_ORDER_STORE = gql`
  query queryOrders {
    order(vendorName: "The Hoot") {
      id
      amount
      created
      customer
      email
      items {
            parent
            amount
            description
            quantity
      }
      orderStatus {
            pending
            onTheWay
            fulfilled
            unfulfilled
        }
      paymentStatus,
          location {
            _id
            name
          }
    }
    
  }

`


