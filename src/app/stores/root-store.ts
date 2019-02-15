import { types } from "mobx-state-tree"
import { Vendor } from "./vendor-store"
import { OrderModel } from "./order-store"

/**
 * An RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  vendors: types.optional(types.array(Vendor), []),
  orders: types.optional(OrderModel, {pending: [], onTheWay: []})

}).actions(self => {
  function addVendor(vendor) {
    self.vendors.push(vendor)
  }
  return {
    addVendor
  }
})

/**
 * The RootStore instance.
 */
export type RootStore = typeof RootStoreModel.Type

/**
 * The data of an RootStore.
 */
export type RootStoreSnapshot = typeof RootStoreModel.SnapshotType
