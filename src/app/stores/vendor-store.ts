import { types } from "mobx-state-tree"

export const Vendor = types.model("Vendor", {
    name: types.string,
    hours: types.array(types.array(types.number)),
    // batchOrder: types.array(types.string)
  })