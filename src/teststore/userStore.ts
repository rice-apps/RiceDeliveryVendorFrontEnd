


import { types, destroy } from "mobx-state-tree";


const UserName = types
.model('UserName', {
    name: types.string,
    vip: types.boolean
})
.actions(self => ({
    toggleVip(){
        self.vip = !self.vip
    }
}
))

const UserStore = types
.model('UserNames', {
    names: types.array(UserName)
})
.actions(self =>({
    addUser(user) {
        self.names.push(user)
    },
    removeUser(user) {
        destroy(user)
    }
})
)
.create({
     names: []
 })


export default UserStore


