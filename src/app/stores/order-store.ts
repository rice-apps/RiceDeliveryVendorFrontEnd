import { types, flow, getSnapshot } from "mobx-state-tree"
import { toJS } from "mobx"
import { Location } from "./location-store"
import gql from "graphql-tag"
import { client } from "../../app/main"

// Notes: types.maybe allows the type to be nullable and optional.

export const OrderItem = types.model("OrderItem", {
  amount: types.number,
  description: types.string,
  parent: types.maybe(types.string),
  quantity: types.maybe(types.number),
})

export const OrderStatus = types.model("OrderStatus", {
  pending: types.maybe(types.number),
  onTheWay: types.maybe(types.number),
  fulfilled: types.maybe(types.number),
  unfulfilled: types.boolean,
})

export const metaData = types.model("metaData", {
  netID: types.maybe(types.string),
  location: types.maybe(types.string),
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
  inBatch: types.maybe(types.boolean),
  customerName: types.string,
})

export const Batch = types.model("Batch", {
  _id: types.string,
  orders: types.array(Order),
  outForDelivery: types.boolean,
  batchName: types.string
})

export const OrderModel = types
  .model("OrderModel", {
    pending: types.array(Order),
    allTransaction: types.array(Order),
    onTheWay: types.array(Batch),
  })
  .views(self => ({
    getBatchByID(batchID) {
      console.log("GET BACTCH BY ID: " + batchID)
      return toJS(self.onTheWay.find(batch => batch._id === batchID))
    }
  }))
  .actions(self => ({
    addOrders(orders) {
      self.pending = orders
      return self.pending
    },
    queryOrders: flow(function* queryOrders(pageNum) {
      let variables = { vendorName: "East West Tea", status: "paid" } // SHOULD BE PAID. NOT CREATED.
      // if page number is greater than 1, then start pagination!
      if (pageNum > 1) variables.starting_after = self.pending[self.pending.toJS().length - 1].id 
      const info = yield client.query({
        query: GET_ORDER_STORE,
        variables,
      })
      if (info.data.order.length === 0) return 0
      self.pending = pageNum === 1 ? info.data.order : self.pending.toJS().concat(info.data.order)
      // filter out orders that are already in a batch.
      self.pending = self.pending.filter(order => {
        if (order.inBatch === true || order.orderStatus.onTheWay != null) {
          return false;
        } else {
          return true;
        }
      })
      return getSnapshot(self.pending)
    }),
    queryAllOrders: flow(function* queryOrders(pageNum) {
      let variables = { vendorName: "East West Tea", status: "" } 
      // if page number is greater than 1, then start pagination!
      if (pageNum > 1) variables.starting_after = self.allTransaction[self.allTransaction.toJS().length - 1].id 
      const info = yield client.query({
        query: GET_ORDER_STORE,
        variables,
      })
      if (info.data.order.length === 0) return 0
      self.allTransaction = pageNum === 1 ? info.data.order : self.allTransaction.toJS().concat(info.data.order)
      return self.allTransaction
    }),
    async fulfillOrder(UpdateOrderInput) { //DOESNT WORK
      const info = await client.mutate({
        mutation: FULFILL_ORDER,
        variables: {
          data: UpdateOrderInput
        }
      });
    },
    async cancelWithoutRefund(UpdateOrderInput) {
      const info = await client.mutate({
        mutation: CANCEL_WITHOUT_REFUND,
        variables: {
          data: UpdateOrderInput
        }
      });
    },
    async cancelWithRefund(UpdateOrderInput) {
      const info = await client.mutate({
        mutation: CANCEL_WITH_REFUND,
        variables: {
          data: UpdateOrderInput
        }
      });
    },
    getBatches: flow(function* getBatches() {
      const info = (yield client.query({
        query: GET_BATCHES,
        variables: {
          vendorName: "East West Tea"  //Hardcoding East West Tea for now.
        }
      })) 
      self.onTheWay = info.data.batch;
      console.log(toJS(self.onTheWay))
      return info.data.batch; //Return batches.
  
    }),
    createBatch: flow(function * createBatch(vendorName, orders, batchName) {
      try {
        let info = yield client.mutate({
          mutation: CREATE_BATCH,
          variables: {
            vendorName: vendorName,  
            orders: orders,
            batchName: batchName
          }
        });
        self.onTheWay.push(info.data.createBatch)
        return info.data.createBatch; //Return batches.
      } catch(error) {
        return [-1, error]
      }

    }),
    addToBatch: flow(function*  addToBatch(vendorName, orders, batchID) {
      let info = yield client.mutate({
        mutation: ADD_TO_BATCH,
        variables: {
          vendorName: vendorName,  
          orders: orders,
          batchID: batchID
        }
      });
      // update the state.
      self.onTheWay.forEach(batch => {
        if (batch._id === batchID) {
          console.log("Adding to batch with ID:" + batch._id)
          batch.orders = info.data.addToBatch.orders
        }
      })
      console.log("new batch")
      console.log(toJS(self.onTheWay).find(batch => batch._id === batchID))
      return info.data.batch; //Return batches.
    }),
    async removeFromBatch(vendorName, orders, batchID) {
      let info = await client.mutate({
        mutation: REMOVE_FROM_BATCH,
        variables: {
          vendorName: vendorName,  
          orders: orders,
          batchID: batchID
        }
      });
      return info.data.batch; //Return batches.
    },
    deleteBatch: flow(function* deleteBatch(batchID, vendorName) {
      let info = yield client.mutate({
        mutation: DELETE_BATCH,
        variables: {
          batchID: batchID,
          vendorName: vendorName
        }
      });
      // update store. 
      self.onTheWay = self.onTheWay.filter(batch => batch._id !== batchID);
      return info.data.deleteBatch; //Return batches.
    }),
  })).views(self => ({
    numPending() {
      return self.pending.length
    }
  })) 



export type Batch = typeof Batch.Type;


// ------------------------- ORDER QUERIES -------------------------------
const GET_ORDER_STORE = gql`
  query queryOrders($vendorName: String!, $starting_after: String, $status: String ) {
    order(vendorName: $vendorName, starting_after: $starting_after, status: $status) {
      id
      inBatch
      amount
      created
      customer
      email
      netID
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

const FULFILL_ORDER = gql`
mutation completeOrder ($data: UpdateOrderInput!) {
  completeOrder(
   	data: $data, 
  ) 
    {
    id
    amount
    charge
    created
    netID
    items {
      parent
      amount
    }
    orderStatus{
      _id
      pending
      onTheWay
      fulfilled
      unfulfilled
      refunded
    }
  }
 }
 `
 
const CANCEL_WITHOUT_REFUND = gql`
mutation cancelWithoutRefund ($data: UpdateOrderInput!) {
	cancelWithoutRefund(
   	data: $data, 
  ) 
    {
    id
    amount
    charge
    created
    items {
      parent
      amount
    }
    orderStatus{
      _id
      pending
      onTheWay
      fulfilled
      unfulfilled
      refunded
    }
  }
 }
 `
 const CANCEL_WITH_REFUND = gql`
 mutation cancelWithRefund ($data: UpdateOrderInput!) {
	cancelWithRefund(
   	data: $data, 
  ) 
    {
    id
    amount
    charge
    created
    items {
      parent
      amount
    }
    orderStatus{
      _id
      pending
      onTheWay
      fulfilled
      unfulfilled
      refunded
    }
  }
 }
 `

// ------------------------- BATCH QUERIES -------------------------------
const ADD_TO_BATCH = gql`
mutation addToBatch($orders: [String], $vendorName: String!, $batchID: String!) {
  addToBatch(orders: $orders, vendorName: $vendorName, batchID: $batchID) {
    _id
    batchName
    outForDelivery
    orders {
      id
      inBatch
      netID
      amount
      charge
      created
      customer
      customerName
      orderStatus{
        _id
        pending
        onTheWay
        fulfilled
        unfulfilled
        refunded
      }
      location {
        _id
        name
      }
      paymentStatus
      items{
        amount
        description
        parent
        quantity
      }
    }
  }
}
`

const REMOVE_FROM_BATCH = gql`
mutation removeFromBatch($orders: [String], $vendorName: String!, $batchID: String!) {
  removeFromBatch(orders: $orders, vendorName: $vendorName, batchID: $batchID) {
    _id
    orders {
      id
      amount
      charge
      created
      customer
      inBatch
    }
  }
}
`

const GET_BATCHES = gql`
query queryBatch($batchID: String, $vendorName: String!) {
  batch(batchID: $batchID, vendorName: $vendorName) {
    _id
    batchName
    outForDelivery
    orders {
      id
      inBatch
      netID
      amount
      charge
      created
      customer
      customerName
      orderStatus{
        _id
        pending
        onTheWay
        fulfilled
        unfulfilled
        refunded
      }
      location {
        _id
        name
      }
      paymentStatus
      items{
        amount
        description
        parent
        quantity
      }
    }
  }
}
`

// Query info for the orderStore.
// const GET_ORDER_STORE = gql`
//   query queryOrders($vendorName: String!, $starting_after: String, $status: String ) {
//     order(vendorName: $vendorName, starting_after: $starting_after, status: $status) {
//       id
//       amount
//       created
//       customer
//       email
//       inBatch
//       items {
//         parent
//         amount
//         description
//         quantity
//       }
//       orderStatus {
//         pending
//         onTheWay
//         fulfilled
//         unfulfilled
//       }
//       paymentStatus
//       location {
//         _id
//         name
//       }
//       netID
//       customerName
//     }
//   }
// `

// Create a new batch.
const CREATE_BATCH = gql`
  mutation createBatch($orders: [String], $vendorName: String!, $batchName: String!) {
    createBatch(orders: $orders, vendorName: $vendorName, batchName: $batchName) {
      _id
      batchName
      outForDelivery
      orders {
        id
        inBatch
        amount
        charge
        created
        customer
      }
    }
  }
`
const DELETE_BATCH = gql`
mutation deleteBatch($batchID: String, $vendorName: String!) {
	deleteBatch(batchID: $batchID, vendorName: $vendorName) {
    _id
    batchName
    orders {
      id
      inBatch
      amount
      charge
      created
      customer
    }
  }
}
`
