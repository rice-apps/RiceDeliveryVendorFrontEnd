// The mock structure/data for orders.
// Using this to test out the listItem / list components I am trying to build.

export var mock_order = {
    id : 696969,
    user : {
      firstName : "Jonathan",
      lastName : "Cai",
    },
    status : {
      pending : "01/29/19 10:12PM",
      onTheWay: "01/29/19 10:21PM", 
      fulfilled: "01/29/19 10:40PM", 
      unfulfilled: false,
    }, 
    location : "Jones",
    items : [
      { item : {
          id : 1,
        "itemName" : "Pizza",
        },
        quantity : 2,
      },
      { item : {
          id : 2,
        "itemName" : "Banh Mi",
        },
        quantity : 4,
      },
      { item : {
          id : 3,
        "itemName" : "Cane's",
        },
        quantity : 1,
      },
    ],
  }

export default interface Order {
    id : number
    user : {
        firstName : string,
        lastName : string,
    },
    status : {
        pending : string,
        onTheWay: string, 
        fulfilled: string, 
        unfulfilled: boolean,
    }, 
    location : string,
    items : [
        OrderItem
    ],
}
 
interface OrderItem {
    item : {
        itemName : string,
    },
    quantity : number
}