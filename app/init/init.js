import React, { Component } from 'react';
import { View, AsyncStorage, Alert } from 'react-native';
import { NavigationActions } from 'react-navigation';
import styles from '../styles';

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
                r.json().then(me => {
                    screenProps.chat
                        .withUserAndSettings(me)
                        .connect("wss://www.destiny.gg/ws");
                    screenProps.chat.me = me;
                    global.bugsnag.setUser(me.userId, me.username, me.username + '@destiny.gg');
                    navigation.dispatch(NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: 'MainNav' })
                        ]
                    }));
                })
            } else {
                navigation.dispatch(NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'AuthView' })
                    ]
                }));
            }
        }, error => {
            Alert.alert(
                'Network rejection', 
                'Check your network connection and retry.',
                [
                    {text: 'Retry', onPress: () => {
                        navigation.dispatch(NavigationActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: 'InitView' })
                            ]
                        }));
                    }}
                ],
                {cancelable: false}
            );
        });
    }

    render() {
        return(
            <View style={styles.View} />
        )
    }
}