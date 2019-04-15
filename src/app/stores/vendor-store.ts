import { types, flow } from "mobx-state-tree"
import { Location } from "./location-store"
import { client } from "../main"
import gql from "graphql-tag"
import { AsyncStorage } from "react-native";

const AUTHENTICATION = gql`
    mutation Authenticate($ticket: String!, $checkVendor: Boolean!, $vendorName: String) {
        authenticator(ticket:$ticket, checkVendor: $checkVendor, vendorName: $vendorName) {
            user {
                netID
                firstName
                lastName
                phone
            }
            token
        }
    }    
`
const User = types.model("User", {
  // _id: types.string,
  netID: types.optional(types.string, ""),
  firstName: types.optional(types.string, ""),
  lastName: types.optional(types.string, ""),
  phone: types.optional(types.string, ""),
  // defaultLocation: types.optional(Location, {name: ""}),
})

export const VendorStoreModel = types
  .model("VendorStoreModel", {
    id: types.optional(types.string, ""),
    phone: types.optional(types.string, ""),
    name: types.optional(types.string, ""),
    hours: types.optional(types.array(types.array(types.number)), []),
    locationOptions: types.optional(Location, {}),
    user: types.optional(User, {}),
    authenticated: types.optional(types.boolean, false),
    hasAccount: types.optional(types.boolean, false),
    attemptedLogin: types.optional(types.boolean, false)
    // batchOrder: types.array(types.string)
}).actions(
    (self) => ({
        authenticate: flow(function * authenticate(ticket) {
            console.log("HERE");
            var name = "East West Tea";
            console.log(name);
            let { data } = yield client.mutate({
                mutation: AUTHENTICATION,
                variables: {
                    ticket: ticket,
                    checkVendor: true, // need to perform vendor authentication
                    vendorName: name // vendor name
                }
            });
            console.log(data);
            let { user, token } = data.authenticator;
            console.log(user);
            console.log(token);
            // console.log(user.data.authenticator);

            // console.log("Almost authenticated");
            // If empty user returned, then authorization failed
            if (user.netID == null) {
                console.log("Here")
                self.setAttempt(true);
            }
            else {
                self.setAuth(true);
                console.log(token);
                yield AsyncStorage.setItem('token', token);
                if (user.firstName != null) {
                    self.setUser(user);
                    self.setAccountState(true);
                } else {
                    self.setUser({ netID: user.netID });
                    self.setAccountState(false);
                }
            }

            // api
            // .post(
            // '',
            // {
            //     query: `
            //     mutation Authenticate($ticket: String!) {
            //         authenticator(ticket:$ticket) {
            //         netID
            //         }
            //     }
            //     `,
            //     variables: {
            //     ticket: ticket
            //     }
            // }
            // )
            // .then((res) => {
            // let user = res.data.data.authenticator;
            
            // console.log(user);
            // console.log(res);
            // });
        }),
        setUser(user) {
            self.user = user;
        },
        setAccountState(accountState) {
            self.hasAccount = accountState;
        },
        // loggedIn() {
        //     return self.authenticated ? true : false
        // },
        setAuth(authState) {
            self.authenticated = authState;
        },
        setAttempt(attemptState) {
            self.attemptedLogin = attemptState;
        }
    })
)

export type VendorStore = typeof VendorStoreModel.Type
