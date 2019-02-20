import { StyleSheet } from "react-native";
import { color } from '../../theme';

//Use this site to look for RGB colors.
// https://www.w3schools.com/colors/colors_rgb.asp


const BRIGHT_BLUE = "#4363e0"
const LIGHT_BLUE = "#5c63d8"
const ORANGE = "#ffa55e"
const FONT_FAMILY = "Verdana"

//DATEPICKERIOS
export const containers = StyleSheet.create({
  batchContainer : { 
      display: "flex", 
      alignContent: "center",
      justifyContent: "center", 
      flexDirection:"row",
      borderColor: "red",
      borderWidth: 2
  }
});
export const button = StyleSheet.create({

primaryButton: {
    backgroundColor: ORANGE,
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

export const orderList = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center", 
        alignItems: "center"
       },

    flatList: {
         width: "100%"
        }
    
});

export const orderListItem = StyleSheet.create({
  row: {
    elevation: 1,
    backgroundColor: color.background,
    flex: 1,
    flexDirection: 'row',  // main axis
    justifyContent: 'flex-start', // main axis
    alignItems: 'center', // cross axis
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 14,
    paddingRight: 16,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff'    
  },
  row_cell: {
    flex: 1,
    flexDirection: 'column',
  },
  row_location: {
    paddingLeft : 0,
    color: color.storybookTextColor,
    textAlignVertical: 'top',
    includeFontPadding: false,
    flex: 0,
    fontSize: 30,
  },
  row_name: {
    paddingLeft : 0,
    color: color.storybookTextColor,
    includeFontPadding: false,
    flex: 0,
    fontSize: 18,
  },
  row_time: {
    paddingLeft : 0,
    color: color.storybookTextColor,
    textAlignVertical: 'bottom',
    includeFontPadding: false,
    flex: 0,
    fontSize: 10,
  },
})
