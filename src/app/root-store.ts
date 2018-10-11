import { types } from "mobx-state-tree"
import { NavigationStoreModel } from "../navigation/navigation-store"

const VendorModel = types.model({
  name: "default", 
  // hours: "default",
  // phone: "default",
  // menu: "default",
  // locationOptions: "default",
  // orders: "default"
})

/**
 * An RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  navigationStore: types.optional(NavigationStoreModel, {}),
  vendors: types.array(VendorModel)
}).actions(self => {
  function addVendor(name) {
    self.vendors.push({name})
  }
  return {
    addVendor
  }
})



// type Vendor {
//   _id: String
//   name: String
//   hours: [Int]
//   phone: String
//   menu: [MenuItem]
//   locationOptions: [Location]
//   orders: [Order]
//  }

/**
 * The RootStore instance.
 */
export type RootStore = typeof RootStoreModel.Type

/**
 * The data of an RootStore.
 */
export type RootStoreSnapshot = typeof RootStoreModel.SnapshotType
