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
  pending: types.maybe(types.number),
  onTheWay: types.maybe(types.number),
  fulfilled: types.maybe(types.number),
  unfulfilled: types.boolean
})

export const metaData = types.model("metaData", {
  netID: types.string, 
  location: types.string
})

export const Order = types.model("Order", {
  id: types.string,
  amount: types.number,
  created: types.Date,
  customer: types.maybe(types.string),
  email: types.maybe(types.string),
  items: types.array(OrderItem),
  orderStatus: OrderStatus,
  paymentStatus: types.string, 
  metadata: types.maybe(metaData),
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
  addOrders(orders) {
    self.pending = orders
    return self.pending
  },
  queryOrders: flow(function* queryOrders() {
    const info = (yield client.query({
      query: GET_ORDER_STORE
    })) 
    self.pending = info.data.order;
    return self.pending.length;
  }),
  addToBatch: flow(function* addToBatch(orders, batchId) {
    //TODO: batch resolvers.
  }),
})).views(self => ({
  numPending() {
    return self.pending.length
  }
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
      paymentStatus
      metadata {
        netID
        location
      }
    }
    
  }
`


