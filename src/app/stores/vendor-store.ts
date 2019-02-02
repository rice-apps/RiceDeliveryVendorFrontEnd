import { types } from "mobx-state-tree"
import { Location} from "./location-store"

export const Vendor = types.model("Vendor", {
    name: types.string,
    hours: types.array(types.array(types.number)),
    locationOptions: Location
    // batchOrder: types.array(types.string)
})