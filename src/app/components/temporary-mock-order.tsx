// The mock structure/data for orders.
// Using this to test out the listItem / list components I am trying to build.

var order1 = {
    id : 6969,
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
        itemName : "Pizza",
        },
        quantity : 2,
      },
      { item : {
          id : 2,
        itemName : "Banh Mi",
        },
        quantity : 4,
      },
      { item : {
          id : 3,
        itemName : "Cane's",
        },
        quantity : 1,
      },
    ],
  }

var order2 = {
    id : 333,
    user : {
      firstName : "Justin",
      lastName : "Fan",
    },
    status : {
      pending : "01/29/19 10:01PM",
      onTheWay: "01/29/19 10:05PM", 
      fulfilled: "01/29/19 10:40PM", 
      unfulfilled: false,
    }, 
    location : "Martel",
    items : [
      { item : {
          id : 1,
        itemName : "CFA Nuggets",
        },
        quantity : 3,
      },
      { item : {
          id : 2,
        itemName : "HBCB",
        },
        quantity : 1,
      },
    ],
}

var order3 = {
  id : 4444,
  user : {
    firstName : "Amy",
    lastName : "Huyen",
  },
  status : {
    pending : "01/29/19 10:01PM",
    onTheWay: "01/29/19 10:05PM", 
    fulfilled: "01/29/19 10:40PM", 
    unfulfilled: false,
  }, 
  location : "Brown",
  items : [
    { item : {
        id : 1,
      itemName : "CFA Nuggets",
      },
      quantity : 3,
    },
    { item : {
        id : 2,
      itemName : "HBCB",
      },
      quantity : 1,
    },
  ],
}

export var mock_orders = {
    order1 : order1,
    order2 : order2,
    order3 : order3,
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