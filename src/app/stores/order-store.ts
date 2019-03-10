import { types, flow, getSnapshot } from "mobx-state-tree"
import {toJS } from "mobx"
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
  netID: types.maybe(types.string), 
  location: types.maybe(types.string)
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
  location: Location,
  netID: types.string,
  customerName: types.string
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
  queryOrders: flow(function* queryOrders(pageNum) {
    let variables = {
      vendorName: "East West Tea"
    }
    if (pageNum > 1) { variables.starting_after = self.pending[self.pending.toJS().length - 1].id }
    const info = (yield client.query({
      query: GET_ORDER_STORE, 
      variables
    })) 
    if (info.data.order.length === 0) {return 0}
    self.pending = pageNum === 1 ? info.data.order : self.pending.toJS().concat(info.data.order);
    console.log("pageNum: " + pageNum)
    console.log(info.data.order)
    console.log(self.pending.toJS())


    return self.pending;
  }),
  getBatches: flow(function* getBatches() {
    //TODO: batch resolvers.
    const info = (yield client.query({
      query: GET_BATCHES,
      variables: {
        vendorName: "The Hoot"
      }
    })) 
    // self.onTheWay = info.data.batch;
    // return self.pending.length;
  }),
})).views(self => ({
  numPending() {
    return self.pending.length
  }
})) //

const GET_BATCHES = gql`
  query batches($vendorName: String!) {
    batch(vendorName: $vendorName) {
      _id
    }
  }
`
// Query info for the orderStore.
const GET_ORDER_STORE = gql`
  query queryOrders($vendorName: String!, $starting_after: String ) {
    order(vendorName: $vendorName, starting_after: $starting_after) {
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
      location {
        _id
        name
      }
      netID
      customerName
    }
    
  }
`


