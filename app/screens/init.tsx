import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import { NavigationActions, NavigationScreenProps } from 'react-navigation';
import styles from 'styles';

const { MobileChat } = require("../chat/chat"); 

export default class InitView extends Component<NavigationScreenProps> {
    componentDidMount() {
        const { navigation } = this.props;

        if (MobileChat.current === undefined) {
            Alert.alert("Internal error.")
            return;
        }

        const req = new Request('https://www.destiny.gg/api/chat/me', {
            method: "GET",
            credentials: 'include'
        });

        fetch(req).then(r => {
            if (r.ok) {
                r.json().then(me => {
                    MobileChat.current
                        .withUserAndSettings(me)
                        .connect("wss://www.destiny.gg/ws");
                    MobileChat.current.me = me;
                    // @ts-ignore
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
                    {
                        text: 'Retry', onPress: () => {
                            navigation.dispatch(NavigationActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({ routeName: 'InitView' })
                                ]
                            }));
                        }
                    }
                ],
                { cancelable: false }
            );
        });
    }

    render() {
        return(
            <View style={styles.View} />
        )
    }
}