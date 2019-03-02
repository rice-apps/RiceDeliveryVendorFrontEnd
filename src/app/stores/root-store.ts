import { types } from "mobx-state-tree"
import { VendorStoreModel } from "./vendor-store"
import { OrderModel } from "./order-store"

/**
 * An RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  vendorStore: types.optional(VendorStoreModel, {}),
  orders: types.optional(OrderModel, {pending: [], onTheWay: []})

});

/**
 * The RootStore instance.
 */
export type RootStore = typeof RootStoreModel.Type

/**
 * The data of an RootStore.
 */
export type RootStoreSnapshot = typeof RootStoreModel.SnapshotType
