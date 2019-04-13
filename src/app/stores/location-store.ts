import { types } from "mobx-state-tree"

export const Location = types.model("Location", {
  _id: types.maybe(types.string),
  name: types.optional(types.string, ""),
})
