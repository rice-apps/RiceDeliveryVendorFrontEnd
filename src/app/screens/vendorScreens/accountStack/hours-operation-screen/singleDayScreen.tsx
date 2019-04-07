import React from "react"
import * as css from "../../../style"
import { View, Text, TextInput, Button, TouchableOpacity, Alert} from "react-native"
import { withNavigation } from "react-navigation";
import PrimaryButton from "../../../../components/primary-button";
import SecondaryButton from "../../../../components/secondary-button";
import { OverlayConfirmationScreen } from "./overlayConfirmationScreen";
import { client } from "../../../../main";
import gql from "graphql-tag";
import LoadingScreen from "../../loading-screen";
import DateTimePicker from 'react-native-modal-datetime-picker';
import { material } from "react-native-typography";
import { validate } from "../../../../../lib/validate";

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

interface SingleDayScreenState {
    loadingInitialData: boolean
    displayModal: boolean
    loadPending: boolean
    openingHour: string
    openingMinute: string
    openingAMPM: string
    closingHour: string
    closingMinute: string
    closingAMPM: string
    serverOpenData: string
    serverCloseData: string
    startTimePickerVisible: boolean
    endTimePickerVisible: boolean
    closedForTheDay:boolean
}

// datePicker = 0->23
// online = 1-> 24
class SingleDayScreen extends React.Component<any, SingleDayScreenState> {

    constructor(props) {
        super(props);
        this.state = {
            loadingInitialData: true,
            displayModal: false,
            loadPending: false,
            openingHour: "00",
            openingMinute: "00",
            openingAMPM: "",
            closingHour: "00",
            closingMinute: "00",
            closingAMPM: "", 
            serverOpenData: "",
            serverCloseData: "",
            startTimePickerVisible: false, 
            endTimePickerVisible: false,
            closedForTheDay: false
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

        console.log("DATA")
        console.log(data)
        // check if the day has been marked as closed.
        if (data[0] === -1 || data[1] === -1) {
            await this.setState({closedForTheDay: true})
        } else {
            const openingTimes = this.getDisplayTime(data[0]);
            const closingTimes = this.getDisplayTime(data[1]);
            await this.setState({
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
        this.setState({loadingInitialData: false})
    }

    componentDidMount() {
        this.getInitialData();
    }

    validateTimes(hour, minute) {
        if (hour === NaN || minute === NaN || hour > 12 || hour < 1 || minute > 60 || minute < 0) {
            return true
        } 
        return false
    }

    sendUpdateHandler = () => {
        // validate opening dates
        let openingHour = parseInt(this.state.openingHour)
        let openingMinute = parseInt(this.state.openingMinute)
        let closingHour = parseInt(this.state.closingHour)
        let closingMinute = parseInt(this.state.closingMinute)

        if (this.validateTimes(openingHour, openingMinute) || this.validateTimes(closingHour, closingMinute)) {
            Alert.alert("Please input valid times!")
        }
        this.setState({displayModal: !this.state.displayModal})
    }

    closeTheDayHandler = async() => {
        let hours = this.props.navigation.getParam("hours", "NO_ID");
        let idx = this.props.navigation.getParam("idx", "NO_ID");
        hours[idx][0] = -1;
        hours[idx][1] = -1;
        let newHours = await client.mutate({
            mutation: UPDATE_HOURS_MUTATION, 
            variables: 
                {
                "hours": hours,
                "name": "East West Tea"
            }
        })
        // reset hours
        this.setState({
            closedForTheDay: true, 
            openingHour: "00",
            openingMinute: "00",
            openingAMPM: "",
            closingHour: "00",
            closingMinute: "00",
            closingAMPM: "", 
            serverOpenData: "",
            serverCloseData: "",})
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

   
    setHoursHandler = () => {
        this.setState({closedForTheDay:false})
    }
    
    render() {
        let day = this.props.navigation.getParam("day", "NO_ID")
        let hours = this.props.navigation.getParam("hours", "NO_ID");
        let idx = this.props.navigation.getParam("idx", "NO_ID");

    
        if (this.state.loadingInitialData) {
            return <LoadingScreen />
        } else if (this.state.closedForTheDay) {
            return (
                <View style={[{height: "50%"}, css.screen.flex, css.screen.padding, css.screen.startContent]}>
                    <Text style={[css.text.headerText, {paddingBottom: 10}]}>{day} hours</Text>
                    <Text style={material.headline}>Closed for the day</Text>
                    <View style={{width: "100%"}}>
                    <PrimaryButton 
                        onPress={this.setHoursHandler}
                        title="Set Hours"
                    />
            </View>
                </View>
            )
        }
        return (
        <View style={[{height: "100%"}, css.screen.padding]}>
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
            <View style={[{height: "50%"}, css.screen.flex, css.screen.padding, css.screen.startContent]}>
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
                        title="Confirm Hours"
                    />
            </View>
            <View style={{width: "100%"}}>
                    <SecondaryButton 
                        onPress={this.closeTheDayHandler}
                        title="Close for the day"
                    />
            </View>

           
        </View>

        )
    }
}
export default withNavigation(SingleDayScreen)
