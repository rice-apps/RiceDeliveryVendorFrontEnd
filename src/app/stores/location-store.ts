import { types } from "mobx-state-tree"

export const Location = types.model('Location', {
    _id: types.string,
    name: types.string
})