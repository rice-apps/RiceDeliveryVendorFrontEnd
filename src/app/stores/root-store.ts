import { types, flow } from "mobx-state-tree"
import { VendorStoreModel } from "./vendor-store"
import { OrderModel } from "./order-store"
import { client } from "../main"
import gql from "graphql-tag"
import { instanceOf } from "prop-types"
const VENDOR_QUERY = gql`
  query {
    vendor(name: "The Hoot") {
      _id
      name
      phone
      hours
      locationOptions {
        _id
        name
      }
    }
  }
`

/**
 * An RootStore model.
 */
export const RootStoreModel = types
  .model("RootStore")
  .props({
    vendorStore: types.optional(VendorStoreModel, {}),
    orders: types.optional(OrderModel, { pending: [], onTheWay: [], allTransaction: [], refunded: [] }),
  })
  .views(self => ({
    get getOrders() {
      return self.orders.pending
    },
  }))
  .actions(self => ({
    initializeVendor: flow(function* initializeVendor() {
      const info = yield client.query({
        query: VENDOR_QUERY,
      })
      const data = info.data.vendor[0]
      const vendor = VendorStoreModel.create({
        id: data._id,
        name: data.name,
        phone: data.phone,
        hours: data.hours,
        locationOptions: data.locationOptions,
      })
      self.vendorStore = vendor
      return vendor
    }),
  }))

/**
 * The RootStore instance.
 */
export type RootStore = typeof RootStoreModel.Type

/**
 * The data of an RootStore.
 */
export type RootStoreSnapshot = typeof RootStoreModel.SnapshotType
