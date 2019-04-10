import { types, flow, getSnapshot } from "mobx-state-tree"
import { toJS } from "mobx"
import { Location } from "./location-store"
import gql from "graphql-tag"
import { client } from "../../app/main"

// Notes: types.maybe allows the type to be nullable and optional.

const fragments = {
  allOrderData : gql`
    fragment orders on Order {
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
        refunded
        arrived
      }
      paymentStatus
      location {
        _id
        name
      }
      netID
      customerName
    }

  `
}

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
  refunded: types.maybe(types.number),
  arrived: types.maybe(types.number)
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
    refunded: types.array(Order),
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
    getNewOrders: flow(function* getNewOrders() {
      let variables = {vendorName: "East West Tea"} 
      const info = yield client.query({
        query: GET_PENDING_ORDERS,
        variables,
      })
      console.log(info.data.pendingOrders)
      if (info.data.pendingOrders.length === 0) return []
      self.pending = info.data.pendingOrders
      console.log("Length after refreshing" + toJS(self.pending).length)
      return getSnapshot(self.pending)
    }),
    
    getMoreOrders: flow(function* getMoreOrders(pageNum) {
      let variables: any = { vendorName: "East West Tea"} // SHOULD BE PAID. NOT CREATED.
      let prevLength = toJS(self.pending).length
      // if page number is greater than 1, then start pagination!
      variables.starting_after = self.pending[toJS(self.pending).length - 1].id 
      const info = yield client.query({
        query: GET_PENDING_ORDERS,
        variables,
      })
      if (info.data.pendingOrders.length === 0) return []
      self.pending = toJS(self.pending).concat(info.data.pendingOrders)
      if (prevLength === toJS(self.pending.length)) {
        return [];
      }
      return getSnapshot(self.pending)
    }),

    queryRefundedOrders: flow(function* queryRefundedOrders(pageNum, status) {
      let variables = { vendorName: "East West Tea", status: "canceled" } 
      // if page number is greater than 1, then start pagination!
      if (pageNum > 1) variables.starting_after = self.refunded[toJS(self.refunded).length - 1].id 
      const info = yield client.query({
        query: GET_FINISHED_ORDERS,
        variables,
      })
      console.log(info.data)
      if (info.data.finishedOrders.length === 0) return []
      self.refunded = pageNum === 1 ? info.data.finishedOrders : toJS(self.refunded).concat(info.data.finishedOrders)
      console.log("added to rootstore. length is now: " + toJS(self.refunded).length)
      return self.refunded
    }),
    
    queryAllOrders: flow(function* queryOrders(pageNum, status) {
      let variables = { vendorName: "East West Tea", status: status } 
      // if page number is greater than 1, then start pagination!
      if (pageNum > 1) variables.starting_after = self.allTransaction[toJS(self.allTransaction).length - 1].id 
      const info = yield client.query({
        query: GET_FINISHED_ORDERS,
        variables,
      })
      console.log(info.data)
      if (info.data.finishedOrders.length === 0) return []
      self.allTransaction = pageNum === 1 ? info.data.finishedOrders : toJS(self.allTransaction).concat(info.data.finishedOrders)
      return self.allTransaction
    }),
    querySingleOrder: flow(function* querySingleOrder(id) {
      const info = yield client.query({
        query: GET_SINGLE_ORDER,
        variables: {
          vendorName: "East West Tea",
          orderID: id
        }
      });
      return info.data.order[0];
    }),
    async fulfillOrder(UpdateOrderInput) { 
      const info = await client.mutate({
        mutation: FULFILL_ORDER,
        variables: {
          data: UpdateOrderInput
        }
      });
      return info.data.completeOrder;
    },
    async orderArrived(UpdateOrderInput) {
      const info = await client.mutate({
        mutation: ORDER_ARRIVED,
        variables: {
          data: UpdateOrderInput
        }
      });
      return info.data.orderArrived;
    },
    async cancelWithRefund(UpdateOrderInput) {
      const info = await client.mutate({
        mutation: CANCEL_WITH_REFUND,
        variables: {
          data: UpdateOrderInput
        }
      });
      return info.data.cancelWithRefund;
    },  
    async cancelWithoutRefund(UpdateOrderInput) {
      const info = await client.mutate({
        mutation: CANCEL_WITHOUT_REFUND, 
        variables: {
          data: UpdateOrderInput
        }
      })
      return info.data.cancelWithoutRefund;
    },
    getBatch: flow(function* getBatch(batchID) {
      const info = (yield client.query({
        query: GET_BATCH,
        variables: {
          vendorName: "East West Tea",  //Hardcoding East West Tea for now.
          batchID: batchID
        }
      })) 
      self.onTheWay = self.onTheWay.map(batch => batch._id === batchID ? info.data.batch[0] : batch)
      return info.data.batch; //Return batches.
    }),
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
    deliverBatch: flow(function *  deliverBatch(batchID, vendorName) {
      let info = yield client.mutate({
        mutation: DELIVER_BATCH,
        variables: {
          batchID: batchID,
          vendorName: vendorName
        }});
      self.onTheWay = self.onTheWay.map(batch => {
        if (batch._id === batchID) {
          return info.data.deliverBatch
        } else {
          return batch
        }
      })
      return info.data.deliverBatch
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
    removeFromBatch: flow(function * removeFromBatch(vendorName, orders, batchID) {
      let info = yield client.mutate({
        mutation: REMOVE_FROM_BATCH,
        variables: {
          vendorName: vendorName,  
          orders: orders,
          batchID: batchID
        }
      });
      // update the state.
      self.onTheWay.forEach(batch => {
        if (batch._id === batchID) {
          batch.orders = info.data.removeFromBatch.orders
        }
      })
      return info.data.batch; //Return batches.
    }),
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

const GET_SINGLE_ORDER = gql`
  query queryOrders($vendorName: String!, $orderID: String!)  {
    order(vendorName: $vendorName, orderID: $orderID)  {
        ...orders
      }
  }
  ${fragments.allOrderData}
`

const GET_PENDING_ORDERS = gql`
  query queryPendingOrders($vendorName: String!, $starting_after: String) {
    pendingOrders(vendorName: $vendorName, starting_after: $starting_after) {
      ...orders
    }
  }
  ${fragments.allOrderData}
`

const GET_FINISHED_ORDERS = gql`
  query queryFinishedOrders($vendorName: String!, $starting_after: String, $status:String) {
    finishedOrders(vendorName: $vendorName, starting_after: $starting_after, status: $status) {
      ...orders
    }
  }    
  ${fragments.allOrderData}

`

const GET_ORDER_STORE = gql`
  query queryOrders($vendorName: String!, $starting_after: String, $status: String ) {
    order(vendorName: $vendorName, starting_after: $starting_after, status: $status) {
      ...orders
    }
  }
  ${fragments.allOrderData}
`

const FULFILL_ORDER = gql`
mutation completeOrder ($data: UpdateOrderInput!) {
  completeOrder(
   	data: $data, 
  ) 
    {
      ...orders
  }
 }
 ${fragments.allOrderData}
 `
 
const CANCEL_WITHOUT_REFUND = gql`
mutation cancelWithoutRefund($data: UpdateOrderInput!) {
	cancelWithoutRefund(
   	data: $data, 
  ) 
    {
      ...orders
  }
 }
 ${fragments.allOrderData}
 `
 
 const CANCEL_WITH_REFUND = gql`
 mutation cancelWithRefund ($data: UpdateOrderInput!) {
	cancelWithRefund(
   	data: $data, 
  ) {
    ...orders
  }
 }
 ${fragments.allOrderData}
 `

const ORDER_ARRIVED = gql`
mutation orderArrived ($data: UpdateOrderInput!) {
  orderArrived(
    data: $data, 
 ) {
   ...orders
 }
}
 ${fragments.allOrderData}
`

// ------------------------- BATCH QUERIES -------------------------------
const ADD_TO_BATCH = gql`
mutation addToBatch($orders: [String], $vendorName: String!, $batchID: String!) {
  addToBatch(orders: $orders, vendorName: $vendorName, batchID: $batchID) {
    _id
    batchName
    outForDelivery
    orders {
      ...orders
    }
  }
}
${fragments.allOrderData}
`
const DELIVER_BATCH = gql`
mutation deliverBatch($batchID: String!, $vendorName: String!){
	deliverBatch(batchID: $batchID, vendorName: $vendorName) {
    _id
    batchName
    outForDelivery
    orders {
      ...orders
    }
  }
}
${fragments.allOrderData}
`
const REMOVE_FROM_BATCH = gql`
mutation removeFromBatch($orders: [String], $vendorName: String!, $batchID: String!) {
  removeFromBatch(orders: $orders, vendorName: $vendorName, batchID: $batchID) {
    _id
    batchName
    outForDelivery
    orders {
      ...orders
    }
  }
}
${fragments.allOrderData}
`

const GET_BATCH = gql`
query queryBatch($batchID: String, $vendorName: String!) {
  batch(batchID: $batchID, vendorName: $vendorName) {
    _id
    batchName
    outForDelivery
    orders {
      ...orders
    }
  }
}
${fragments.allOrderData}
`

const GET_BATCHES = gql`
query queryBatch($batchID: String, $vendorName: String!) {
  batch(batchID: $batchID, vendorName: $vendorName) {
    _id
    batchName
    outForDelivery
    orders {
      ...orders
    }
  }
}
${fragments.allOrderData}
`


// Create a new batch.
const CREATE_BATCH = gql`
  mutation createBatch($orders: [String], $vendorName: String!, $batchName: String!) {
    createBatch(orders: $orders, vendorName: $vendorName, batchName: $batchName) {
      _id
      batchName
      outForDelivery
      orders {
        ...orders
      }
    }
  }
  ${fragments.allOrderData}
`
const DELETE_BATCH = gql`
mutation deleteBatch($batchID: String, $vendorName: String!) {
	deleteBatch(batchID: $batchID, vendorName: $vendorName) {
    _id
    batchName
    orders {
      ...orders
    }
  }
}
${fragments.allOrderData}
`
