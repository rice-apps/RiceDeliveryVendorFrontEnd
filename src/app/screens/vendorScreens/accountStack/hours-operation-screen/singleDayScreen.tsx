import React from "react"
import * as css from "../../../style"
import { View, Text, TextInput, Button, TouchableOpacity} from "react-native"
import { withNavigation } from "react-navigation";
import PrimaryButton from "../../../../components/primary-button";
import SecondaryButton from "../../../../components/secondary-button";
import { OverlayConfirmationScreen } from "./overlayConfirmationScreen";
import { client } from "../../../../main";
import gql from "graphql-tag";
import LoadingScreen from "../../loading-screen";
import DateTimePicker from 'react-native-modal-datetime-picker';

const UPDATE_HOURS_MUTATION = gql`
    mutation updateVendorHours($hours: [[Float]], $name: String!) {
        updateVendor(data: { hours: $hours, name: $name }) {
            name
            hours
        }
    }
`

const GET_HOURS_QUERY = gql`
    query getHours($name: String!) {
        vendor(name: $name) {
            hours
        }
    }
`

// datePicker = 0->23
// online = 1-> 24
class SingleDayScreen extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            loadingInitialData: true,
            displayModal: false,
            loadPending: false,
            openingHour: "",
            openingMinute: "00",
            openingAMPM: "",
            closingHour: "",
            closingMinute: "00",
            closingAMPM: "", 
            serverOpenData: "",
            serverCloseData: "",
            startTimePickerVisible: false, 
            endTimePickerVisible: false
        
        };
    }
    static navigationOptions = ({ navigation }) => {
        return {
          title: navigation.getParam('day', 'Day Settings'),
        };
      };

    getInitialData = async() => {
        let idx = this.props.navigation.getParam("idx", "NO_ID");
        const data = (await client.query({
            query: GET_HOURS_QUERY, 
            variables: 
                {
                "name": "East West Tea"
              }   
        })).data.vendor[0].hours[idx]
        const openingTimes = this.getDisplayTime(data[0]);
        const closingTimes = this.getDisplayTime(data[1]);
        this.setState({
            serverOpenData: `${openingTimes[0]}:${openingTimes[1]} ${openingTimes[2]}`,
            serverCloseData: `${closingTimes[0]}:${closingTimes[1]} ${closingTimes[2]}`,
            loadingInitialData: false,
            openingHour: `${openingTimes[0]}`,
            openingMinute: `${openingTimes[1]}`,
            openingAMPM: `${openingTimes[2]}`,
            closingHour: `${closingTimes[0]}`,
            closingMinute: `${closingTimes[1]}`,
            closingAMPM: `${closingTimes[2]}`,
        })
    }

    componentDidMount() {
        this.getInitialData();
    }
    setDate = (newDate) => {
        this.setState({chosenDate: newDate})
    }

    sendUpdateHandler = () => {
        console.log()
        this.setState({displayModal: !this.state.displayModal})
    }

    // Function to convert into time to store on backend.
    convertTime = (hour, minute, AMPM: String) => {
        hour = parseInt(hour)
        minute = parseInt(minute)
        if (AMPM.toUpperCase() == "PM" && hour != 12) hour = (hour + 12)
        if (AMPM.toUpperCase() == "AM" && hour == 12) hour = (hour + 12)
        return hour + (minute/100.0)
    }

    getDisplayTime = (time) => {
        let timeStr = time.toString().split(".")
        let hour = parseInt(timeStr[0])
        let minute = timeStr[1] ? (timeStr[1]) : "00"
        let AMPM = (hour >= 12 && hour < 24) ? "PM" : "AM"
        if (hour > 12) hour = hour - 12
        return [hour.toString(), minute, AMPM]
    }

    queryFunction = async() => {
        let hours = this.props.navigation.getParam("hours", "NO_ID");
        let idx = this.props.navigation.getParam("idx", "NO_ID");
        this.state.displayModal && this.setState({loadPending: true})
        const numOpeningTime = this.convertTime(this.state.openingHour, this.state.openingMinute, this.state.openingAMPM);
        const numClosingTime = this.convertTime(this.state.closingHour, this.state.closingMinute, this.state.closingAMPM);
        console.log(`numOpening time: ${numOpeningTime} numClosingTime: ${numClosingTime}  `)
        console.log(hours)
        hours[idx][0] = numOpeningTime;
        hours[idx][1] = numClosingTime;
        console.log(hours);
        let newHours = await client.mutate({
            mutation: UPDATE_HOURS_MUTATION, 
            variables: 
                {
                "hours": hours,
                "name": "East West Tea"
            }
        })
        this.state.displayModal && this.setState({
            loadPending: false, 
            displayModal: false,
            serverOpenData: `${this.state.openingHour}:${this.state.openingMinute} ${this.state.openingAMPM}`,
            serverCloseData: `${this.state.closingHour}:${this.state.closingMinute} ${this.state.closingAMPM}`
        })
    }

    setVisibility = () => {
        console.log("SETTING")
        this.setState({displayModal: !this.state.displayModal})
    }

    showStartTimePicker = () => this.setState({ startTimePickerVisible: true });
 
    showEndTimePicker = () => this.setState({ endTimePickerVisible: true });
    
    hideStartTimePicker = () => this.setState({ startTimePickerVisible: false });
    
    hideEndTimePicker = () => this.setState({ endTimePickerVisible: false });
    
    handleStartPicked = (date) => {
        let hour24 = date.getHours();
        let min  = date.getMinutes();
        console.log(min);
        console.log(hour24)
        let hour12 = (hour24 % 12 == 0) ? 12 : hour24 % 12; 
        // 0-> 11 == AM 
        // 12-> 23 == PM
        if (hour24 >= 0 && hour24 <=11) {
            this.setState({openingAMPM: "AM"})
        } else if (hour24 >= 12 && hour24 <= 23) {
            this.setState({openingAMPM: "PM"})
        }

        let minString = (min < 10) ? `0${min}` : min.toString();
        this.setState({openingHour: hour12.toString()})
        this.setState({openingMinute: minString})

        this.hideStartTimePicker();
    };
    
    handleEndPicked = (date) => {
        let hour24 = date.getHours();
        let min  = date.getMinutes();
        let hour12 = (hour24 % 12 == 0) ? 12 : hour24 % 12; 
        console.log(min);
        console.log(hour24)
        if (hour24 >= 0 && hour24 <=11) {
            this.setState({closingAMPM: "AM"})
        } else if (hour24 >= 12 && hour24 <= 23) {
            this.setState({closingAMPM: "PM"})
        }

        let minString = (min < 10) ? `0${min}` : min.toString();
        this.setState({closingHour: (hour12).toString()})
        this.setState({closingMinute: minString})
        this.hideEndTimePicker();
    };

   

    
    render() {
        let day = this.props.navigation.getParam("day", "NO_ID")
        let hours = this.props.navigation.getParam("hours", "NO_ID");
        let idx = this.props.navigation.getParam("idx", "NO_ID");

    
        if (this.state.loadingInitialData) {
            return <LoadingScreen />
        } 
        return (
        <View style={[{height: "100%"}, css.debugScreen.borderColorRed, css.screen.padding]}>
        {
            this.state.displayModal && 
            <OverlayConfirmationScreen 
                openingTime={`${this.state.openingHour}:${this.state.openingMinute} ${this.state.openingAMPM}`}
                closingTime={`${this.state.closingHour}:${this.state.closingMinute} ${this.state.closingAMPM}`}
                loadPending={this.state.loadPending}
                hours={hours}
                idx={idx}
                isVisible={this.state.displayModal}
                queryFunction={this.queryFunction}
                setVisibility={this.setVisibility}
            />
        }
            <View style={[{height: "50%"}, css.screen.flex, css.screen.padding, css.screen.startContent, css.debugScreen.borderColorRed]}>
                <Text style={[css.text.headerText, {paddingBottom: 10}]}>{day} hours</Text>
                <Text style={[css.text.bigBodyText, {paddingBottom: 10}]}>{this.state.serverOpenData} - {this.state.serverCloseData}</Text>

                <View style={{width: "100%", alignItems: "center"} } >
                   
                    <Button 
                            title="Set Opening Hours"
                            onPress = {() => {this.showStartTimePicker()}}
                        />
                         <Text style={css.text.timePickerShowText}> {this.state.openingHour} {":"} {this.state.openingMinute}  {this.state.openingAMPM}</Text>
                    </View>

                    <View>
                        <TouchableOpacity onPress={() => this.showStartTimePicker}>
                        </TouchableOpacity>
                        <DateTimePicker
                            titleIOS = {"Change opening time"}
                            isVisible={this.state.startTimePickerVisible}
                            mode = {"time"}
                            onConfirm={this.handleStartPicked}
                            onCancel={this.hideStartTimePicker}
                        />
                    
                    </View>
             
                <View style={{width: "100%", alignItems: "center", paddingTop: 20}} >
                    <Button 
                        title="Set Closing Hours"
                        onPress = {() => {this.showEndTimePicker()}}
                    />
                    <Text style={css.text.timePickerShowText}> {this.state.closingHour} {":"} {this.state.closingMinute}  {this.state.closingAMPM}</Text>
                    <View>
                        <TouchableOpacity onPress={() => this.showEndTimePicker}>
                        </TouchableOpacity>
                        <DateTimePicker
                            titleIOS = {"Change closing time"}
                            isVisible={this.state.endTimePickerVisible}
                            mode = {"time"}
                            onConfirm={this.handleEndPicked}
                            onCancel={this.hideEndTimePicker}
                        />
                    </View>

                </View>
            </View>

            <View style={{width: "100%"}}>
                    <PrimaryButton 
                        onPress={this.sendUpdateHandler}
                        title="Confirm"
                    />
            </View>

           
        </View>

        )
    }
}
export default withNavigation(SingleDayScreen)
