import { types } from "mobx-state-tree"
import { Location} from "./location-store"
import { client } from "../main";

export const Vendor = types.model("Vendor", {
    id: "",
    name: "",
    phone: "",
    hours: types.optional(types.array(types.array(types.number)), []),
    locationOptions: types.optional(types.array(Location),[])
    // batchOrder: types.array(types.string)
}).actions(self => ({
}))
