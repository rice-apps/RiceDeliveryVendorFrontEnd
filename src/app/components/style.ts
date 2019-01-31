import { StyleSheet } from "react-native";

//Use this site to look for RGB colors.
// https://www.w3schools.com/colors/colors_rgb.asp
//

const BRIGHT_BLUE = "#4363e0"
const LIGHT_BLUE = "#5c63d8"
const FONT_FAMILY = "Verdana"

module.exports = StyleSheet.create({

primaryButton: {
    backgroundColor: BRIGHT_BLUE,
    borderColor: "transparent",
    borderWidth: 4,
    borderRadius: 5,
    margin: 5
  }, 

secondaryButton: {
    backgroundColor: LIGHT_BLUE,
    borderColor: "transparent",
    borderWidth: 4,
    borderRadius: 5,
    margin: 5
}

});