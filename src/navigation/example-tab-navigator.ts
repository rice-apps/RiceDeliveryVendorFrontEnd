import { createBottomTabNavigator } from "react-navigation"
import { OrderTab } from "../views/example/order-example-tab"
import { BatchTab } from "../views/example/batch-example-tab"

// we must export this ExampleTabNavigator so we can use it in our other files
export const ExampleTabNavigator = createBottomTabNavigator({
    // in the first argument of createTabNavigator, we define which screens are managed by our navigator
    // there are two ways to do this:
    //      TabA: TimelineTab (where order-example-tab is a screen we have defined)
    //      TabA: {screen: order-tab} this way is the older way, but either works
    TabA: OrderTab,
    TabB: BatchTab,
}, {
    // the second argument is where you define the properties of the tab navigator
    // here we define the order of the tabs from left to right; we reference them using the variables created above
    // animationEnabled allows shows the animated movement from tab to tab; makes it clear that we have swithced tabs
    order: ['TabA', 'TabB'],
    animationEnabled: true,
})