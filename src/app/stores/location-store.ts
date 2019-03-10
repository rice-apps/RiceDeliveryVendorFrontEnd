import { types } from "mobx-state-tree"

export const Location = types.model('Location', {
    _id: types.optional(types.string, ""),
    name: types.optional(types.string, "")
})