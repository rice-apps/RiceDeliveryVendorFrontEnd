import { types } from "mobx-state-tree"
import { NavigationStoreModel } from "../navigation/navigation-store"
//import { BookStore } from "../teststore/userStore"
/**
 * An RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  navigationStore: types.optional(NavigationStoreModel, {}),
  //bookStore: types.optional(BookStore,{ }), // something new added 
})
//a store within a store?


/**
 * The RootStore instance.
 */
export type RootStore = typeof RootStoreModel.Type

/**
 * The data of an RootStore.
 */
export type RootStoreSnapshot = typeof RootStoreModel.SnapshotType
