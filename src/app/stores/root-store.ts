import { types, flow } from "mobx-state-tree"
import { Vendor } from "./vendor-store"
import { OrderModel } from "./order-store"
import { client } from "../main";
import gql from "graphql-tag";
import { instanceOf } from "prop-types";

/**
 * An RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  vendors: types.optional(types.array(Vendor), []),
  orders: types.optional(OrderModel, {pending: [], onTheWay: []}),
  number: types.optional(types.number, 1)

}).views(self => ({
  get getOrders() {
      return self.orders.pending
  }
})).actions(self => ({

  increment: flow(function* increment() {
    self.number++;
  }),

  addVendor(vendor) {
    self.vendors.push(vendor)
  }, 

  initializeVendors() {
    const info = client.query({
      query: gql`
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
      }).then((data) =>{
        self.initializeSuccess(data)
      })
  },
  initializeSuccess(data) {
    // self.number++
    const vendor = data.data.vendor[0]
    self.vendors.push({
      id: vendor._id,
      name: vendor.name,
      phone: vendor.phone,
      hours: vendor.hours,
      locationOptions: vendor.locationOptions
    })
  }

  // initializeVendors: flow(function* initializeVendors() {
  //     // self.number++;
  //     const info = (yield client.query({
  //       query: gql`
  //       query {
  //         vendor(name: "The Hoot") {
  //           _id
  //           name
  //           phone
  //           hours
  //           locationOptions {
  //             _id
  //             name
  //           }
  //         }
  //       }
  //       `
  //     }))
  //     const data = info.data.vendor[0]
  //     const vendor = {
  //       id: data._id,
  //       name: data.name,
  //       phone: data.phone,
  //       hours: data.hours,
  //       locationOptions: data.locationOptions
  //     }
  //     // console.log(vendor)
  //     self.vendors.push(vendor)
  //     console.log("Done")
  //   })
}))

/**
 * The RootStore instance.
 */
export type RootStore = typeof RootStoreModel.Type

/**
 * The data of an RootStore.
 */
export type RootStoreSnapshot = typeof RootStoreModel.SnapshotType
