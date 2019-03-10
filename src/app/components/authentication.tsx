import * as React from "react"
import { View, ViewStyle, StatusBar } from "react-native"
import { inject, observer } from "mobx-react"
import { create } from 'apisauce'
// Linking
import { WebView } from 'react-native';
import { RootStore } from "../stores/root-store";
import CookieManager from 'react-native-cookies'; 

const FULL: ViewStyle = { flex: 1 }

const api = create({
  baseURL: "http://localhost:3000/graphql",
  headers: { 'Accept': 'application/json' }
});

export interface AuthenticationComponentProps {
  rootStore?: RootStore
  onSuccess?: Function
  onFailure?: Function
}

@inject("rootStore")
@observer
export class AuthenticationComponent extends React.Component<AuthenticationComponentProps, { author: object, person: string, authorJSON: string, displayBrowser: boolean, vendorStore: VendorStore }> {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      author: {},
      authorJSON: "",
      person: "",
      displayBrowser: true,
      vendorStore: props.rootStore.vendorStore
    };
  }

  queryGetPost = (name) => {
    api
      .post(
        '',
        {
          query: `
          query Author($firstName: String!) {
          author(filter:$firstName){
            lastName
          }
        }
        `,
          variables: {
            firstName: name
          },
        }
      ).then(
        (res: any) => {
          return this.setState({ author: res.data.data.author[0] });
        }
      );
  }

  toggleBrowser() {
    this.setState({ displayBrowser: !this.state.displayBrowser });
  }


  authenticate = (ticket) => {
    api
      .post(
        '',
        {
          query: `
          mutation Authenticate($ticket: String!) {
            authenticator(ticket:$ticket) {
              netID
            }
          }
        `,
          variables: {
            ticket: ticket
          }
        }
      )
      .then((res) => {
        let user = res.data.data.authenticator;

        console.log(user);
        console.log(res);
      });
  }

  async _onNavigationStateChange(webViewState) {
    console.log(webViewState.url);

    CookieManager.get(webViewState.url).then((res) => {console.log('CookieManager.get =>', res);
    });

    var equalSignIndex = webViewState.url.indexOf('ticket=') + 1;
    if (equalSignIndex > 0) {

      var ticket = webViewState.url.substring(equalSignIndex + 6);
      console.log("Parsed Ticket: " + ticket);
      let badTicket = "28939299239";
      await this.state.vendorStore.authenticate(ticket);
      console.log("Authenticated");
      let authenticated = this.state.vendorStore.authenticated;
      console.log("Post Auth");
      console.log(authenticated);
      if (authenticated) {
        this.props.onSuccess();
      } else {
        console.log("Auth failed");
        this.props.onFailure();
      }
    }

  }

  checkUser() {
    console.log(this.state.vendorStore.user);
  }

  render() {
    return (
      <View style={FULL}>
        <StatusBar barStyle="light-content" />
        <WebView
              // source={{uri: 'https://idp.rice.edu/idp/profile/cas/login?service=hedwig://localhost:8080/auth'}}
              source={{ uri: 'https://idp.rice.edu/idp/profile/cas/login?service=https://riceapps.org' }}
              onNavigationStateChange={this._onNavigationStateChange.bind(this)}
              style={{ marginTop: 20, display: this.state.displayBrowser ? 'flex' : 'none' }}
            />
      </View>
    )
  }
}

export default AuthenticationComponent