import { types } from "mobx-state-tree"
import { Location} from "./location-store"
import { client } from "../main";

export const Vendor = types.model("Vendor", {
    id: types.string,
    name: types.string,
    phone: types.string,
    hours: types.optional(types.array(types.array(types.number)), []),
    locationOptions: types.optional(types.array(Location),[])
    // batchOrder: types.array(types.string)
}).actions(self => ({
    initializeVendors() {
        console.log("here")
    }
}))
