import { StyleSheet } from "react-native";

const GRAY = "#696969";
const LIGHT_GRAY = "#DCDCDC"
const FONT_FAMILY = "Verdana"

module.exports = StyleSheet.create({
//SCREENS
defaultScreen: {
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: LIGHT_GRAY
  }, 

//TEXT
headerText: {
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

//TEXTINPUT
textInput: {
    margin: 10,
    paddingLeft: 15,
    paddingRight: 15,
    }

});