import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';
import CookieManager from 'react-native-cookies';
//import styles from './styles';

export default class InitView extends Component {
    constructor(props) {
        super(props);

        const { navigation, screenProps } = props;

        const req = new Request('https://www.destiny.gg/api/chat/me', { 
            method: "GET", 
            credentials: 'include'
        });
        fetch(req).then(r => {
            if (r.ok) {
                screenProps.chat.connect("wss://www.destiny.gg/ws");
                navigation.dispatch(NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'MainNav' })
                    ]
                }));
            } else {
                navigation.dispatch(NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'AuthView' })
                    ]
                }));
            }
        });
    }

    render() {
        return(
            <View>

            </View>
        )
    }
}