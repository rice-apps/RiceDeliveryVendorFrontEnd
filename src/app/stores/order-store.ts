import {toJS } from "mobx"
import { types, flow, getSnapshot } from "mobx-state-tree"
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
      vendorName: "The Hoot"
    }
    if (pageNum > 1) { variables.starting_after = self.pending[self.pending.toJS().length - 1].id }
    const info = (yield client.query({
      query: GET_ORDER_STORE, 
      variables
    })) 
    if (info.data.order.length === 0) {return 0}
    self.pending = pageNum === 1 ? info.data.order : self.pending.toJS().concat(info.data.order);
    return self.pending;
  }),
  getBatches: flow(function* getBatches() {
    //TODO: batch resolvers.
    const info = (yield client.query({
      query: GET_BATCHES,
      variables: {
        vendorName: "East West Tea"  //Hardcoding East West Tea for now.
      }
    })) 
    return info.data.batch; //Return batches.

  }),
  async createBatch(vendorName, orders) {
    let info = await client.mutate({
      mutation: CREATE_BATCH,
      variables: {
        vendorName: vendorName,  
        orders: orders
      }
    });
    return info.data.batch; //Return batches.
  },
})).views(self => ({
  numPending() {
    return self.pending.length
  }
})) 

export type Batch = typeof Batch.Type;


const GET_BATCHES = gql`
  query queryBatch($batchID: String, $vendorName: String!) {
    batch(batchID: $batchID, vendorName: $vendorName) {
      _id
      orders {
        id
        amount
        charge
        created
        customer
      }
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

// Create a new batch.
const CREATE_BATCH = gql`
  mutation createBatch($orders: [String], $vendorName: String) {
    createBatch(orders: $orders, vendorName: $vendorName) {
      _id
      orders {
        id
        amount
        charge
        created
        customer
      }
    }
  }
`

