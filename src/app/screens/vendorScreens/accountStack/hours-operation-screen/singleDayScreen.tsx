import React from "react"
import * as css from "../../../style"
import { View, Text, TextInput} from "react-native"
import { withNavigation } from "react-navigation";
import PrimaryButton from "../../../../components/primary-button";
import SecondaryButton from "../../../../components/secondary-button";
import { OverlayConfirmationScreen } from "./overlayConfirmationScreen";
import { client } from "../../../../main";
import gql from "graphql-tag";
import LoadingScreen from "../../loading-screen";

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
class SingleDayScreen extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            loadingInitialData: true,
            displayModal: false,
            loadPending: false,
            openingHour: "",
            openingMinute: "",
            openingAMPM: "",
            closingHour: "",
            closingMinute: "",
            closingAMPM: "", 
            serverOpenData: "",
            serverCloseData: ""        
        
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
        console.log(data)
        const openingTimes = this.getDisplayTime(data[0]);
        const closingTimes = this.getDisplayTime(data[1]);
        this.setState({
            serverOpenData: `${openingTimes[0]}:${openingTimes[1]} ${openingTimes[2]}`,
            serverCloseData: `${closingTimes[0]}:${closingTimes[1]} ${closingTimes[2]}`,
            loadingInitialData: false
        })
    }

    componentDidMount() {
        this.getInitialData();
    }
    setDate = (newDate) => {
        this.setState({chosenDate: newDate})
    }

    sendUpdateHandler = () => {

        const re = /([aAPp][mM])$/
        // Validate hour fields
        if (this.state.openingHour < 1 || this.state.openingHour > 12 || parseInt(this.state.openingHour) == -1 ||
            this.state.closingHour < 1 || this.state.closingHour > 12 || parseInt(this.state.closingHour) == -1 ) {
                alert("Please Input a valid time!")
                return;
        }
        // Validate minute fields
        if (this.state.openingMinute < 1 || this.state.openingMinute > 12 || parseInt(this.state.openingMinute) == -1 ||
            this.state.closingMinute < 1 || this.state.closingMinute > 12 || parseInt(this.state.closingMinute) == -1 ) {
            alert("Please Input a valid time!")
            return;
        }
        // Validate AM/PM fields
        if (!re.test(this.state.openingAMPM) || !re.test(this.state.closingAMPM)) {
            alert("Please Input a valid time!")
            return;
        } else {
            this.setState({displayModal: !this.state.displayModal})
        }
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
        let minute = timeStr[1] ? timeStr[1] : "00"
        if (minute < 10 && minute != "00") minute = (minute * 10).toString()
        let AMPM = (hour >= 12 && hour < 24) ? "PM" : "AM"
        if (hour > 12) hour = hour - 12
        console.log([hour.toString(), minute, AMPM])
        return [hour.toString(), minute, AMPM]
    }

    queryFunction = async() => {
        let day = this.props.navigation.getParam("day", "NO_ID")
        let hours = this.props.navigation.getParam("hours", "NO_ID");
        let idx = this.props.navigation.getParam("idx", "NO_ID");
        this.state.displayModal && this.setState({loadPending: true})
        const numOpeningTime = this.convertTime(this.state.openingHour, this.state.openingMinute, this.state.openingAMPM);
        const numClosingTime = this.convertTime(this.state.closingHour, this.state.closingMinute, this.state.closingAMPM);
        hours[idx] = [numOpeningTime, numClosingTime]
        
        await client.mutate({
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
                queryFunction={this.queryFunction}
            />
        }
            <View style={[{height: "50%"}, css.screen.flex, css.screen.padding, css.screen.startContent, css.debugScreen.borderColorRed]}>
                <Text style={[css.text.headerText, {paddingBottom: 10}]}>{day} hours</Text>
                <Text style={[css.text.bigBodyText, {paddingBottom: 10}]}>{this.state.serverOpenData} - {this.state.serverCloseData}</Text>

                <Text style={[css.text.bodyText]}>Set Opening Time</Text>
                <View style={[{flexDirection: "row", display: "flex", height: "10%", justifyContent: "center", alignItems: "center"}]}>
                    <TextInput 
                        placeholder="Hour"
                        onChangeText={event => this.setState({openingHour: event.toString()})}
                        style={[{height: 40, width: "20%"}]}
                    />
                    <TextInput 
                        placeholder="Minute"
                        onChangeText={event => this.setState({openingMinute: event.toString() == "0" ? "00" : event.toString()})}
                        style={[{height: 40, width: "20%"}]}

                    />
                    <TextInput 
                        onChangeText={event => this.setState({openingAMPM: event.toString().toUpperCase()})}
                        placeholder="AM/PM"
                        style={[{height: 40, width: "20%"}]}
                    />
                </View>
                <Text style={css.text.bodyText}>Set Closing Time</Text>

                <View style={[{flexDirection: "row", display: "flex", height: "10%"}]}>
                    <TextInput 
                        placeholder="Hour"
                        onChangeText={event => this.setState({closingHour: event.toString()})}

                        style={[{width: "20%", height: 40}]}
                    />
                    <TextInput 
                        placeholder="Minute"
                        onChangeText={event => this.setState({closingMinute: event.toString() == "0" ? "00" : event.toString()})}

                        style={[{width: "20%", height: 40}]}

                    />
                    <TextInput 
                        placeholder="AM/PM"
                        onChangeText={event => this.setState({closingAMPM: event.toString().toUpperCase()})}

                        style={[{width: "20%", height: 40}]}
                    />
                </View>
                <View style={{width: "100%"}}>
                    <PrimaryButton 
                        onPress={this.sendUpdateHandler}
                        title="Change Hours"
                    />
                </View>
            </View>
        </View>

        )
    }
}
export default withNavigation(SingleDayScreen)
