import { StyleSheet } from "react-native"
import { color } from "../../theme"

//Use this site to look for RGB colors.
// https://www.w3schools.com/colors/colors_rgb.asp

const BRIGHT_BLUE = "#4363e0"
const LIGHT_BLUE = "#5c63d8"
const ORANGE = "#ffa55e"
const FONT_FAMILY = "Verdana"

//DATEPICKERIOS
export const containers = StyleSheet.create({
  batchContainer: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
})
export const button = StyleSheet.create({
  primaryButton: {
    backgroundColor: ORANGE,
    borderColor: "transparent",
    borderWidth: 4,
    borderRadius: 5,
    margin: 5,
  },

  secondaryButton: {
    backgroundColor: LIGHT_BLUE,
    borderColor: "transparent",
    borderWidth: 4,
    borderRadius: 5,
    margin: 5,
  },
})

//PICKER
export const picker = StyleSheet.create({
  locationPicker: {
      height: 1, 
      width: 100, 
      padding: 0, 
      margin: 0,
  }
});

export const orderList = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  flatList: {
    width: "100%",
    flex: 1,
  },
})

export const orderListItem = StyleSheet.create({
  row: {
    elevation: 1,
    height: 80,
    backgroundColor: color.background,
    flex: 1,
    flexDirection: "row", // main axis
    justifyContent: "flex-start", // main axis
    alignItems: "center", // cross axis
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fff",
  },
  badge_cell: {
    paddingLeft: .5,
    flex: 0.30,
    flexDirection: "column",
  },
  badge_text: {
    fontSize: 8,
    textAlignVertical: "bottom",
    textAlign: "center",
    includeFontPadding: false,
    
  },
  row_cell: {
    
    paddingLeft: 0.0,
    flex: 1,
    flexDirection: "column",
  },
  row_location: {
    paddingLeft: 0.0,
    color: color.storybookTextColor,
    textAlignVertical: "top",
    includeFontPadding: false,
    flex: 0,
    fontSize: 16,
    fontWeight: "bold"
  },
  row_name: {
    paddingLeft: 0.0,
    color: color.storybookTextColor,
    includeFontPadding: false,
    flex: 0,
    fontSize: 16
  },
  row_time: {
    paddingLeft: 0.0,
    color: color.storybookTextColor,
    textAlignVertical: "bottom",
    includeFontPadding: false,
    flex: 0,
    fontSize: 10,
  },
  activeItem: {
    backgroundColor: "orange",
  },
})
