import { StyleSheet } from "react-native";
import { color } from "../../theme";

const GRAY = "#696969";
const LIGHT_GRAY = "#DCDCDC"
const FONT_FAMILY = "Verdana"

//SCREENS
export const screen = StyleSheet.create({
    defaultScreen: {
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: LIGHT_GRAY
    }, 

    paddedScreen: {
        flex: 1, 
        padding: 10,
        backgroundColor: LIGHT_GRAY
    }, 
    
    divider : {
        backgroundColor : color.storybookDarkBg,
        height : 1,
      },
})

//TEXT
export const text = StyleSheet.create({
    logo: {
        fontSize: 30,
        fontFamily: FONT_FAMILY,
        color: GRAY,
        paddingBottom: 100
      },
    regularText: {
        fontSize: 15,
        fontFamily: FONT_FAMILY,
        color: GRAY,
    },
    headerText: {
        color: color.storybookTextColor,
        fontWeight: '800',
        fontSize: 40,
        paddingTop: 10,
      },
      bodyText: {
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 20,
        color: color.storybookTextColor,
      },
      bigBodyText: {
        paddingTop: 10,
        fontSize: 30,
        color: color.storybookTextColor,
      },
      smallText : {
        fontSize : 15,
        paddingBottom : 10,
      },
    textInput: {
        margin: 10,
        paddingLeft: 15,
        paddingRight: 15,
    }
});

//FLATLIST
export const flatlist = StyleSheet.create({
      itemText : {
        marginLeft : 10,
        fontSize: 15,
        paddingTop : 5,
        paddingBottom : 5,
      }
});
