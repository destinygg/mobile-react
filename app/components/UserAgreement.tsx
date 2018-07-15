import React, { Component } from "react";
import { WebView } from "react-native";

export class UserAgreement extends Component {
    static navigationOptions = {
        title: 'User Agreement',
        drawerLockMode: 'locked-closed'
    }
    render() {
        return (
            <WebView source={{ uri: 'https://www.destiny.gg/agreement' }} />
        )
    }
}