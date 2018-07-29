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

        const meReq = new Request('https://www.destiny.gg/api/chat/me', {
            method: "GET",
            credentials: 'include'
        });
        const histReq = new Request("https://www.destiny.gg/api/chat/history");

        Promise.all([fetch(meReq), fetch(histReq)]).then(async r => {
            const meRes = r[0];
            const histRes = r[1];
            if (meRes.ok) {
                const me = await meRes.json();
                const hist = await histRes.json();

                MobileChat.current
                    .withUserAndSettings(me)
                    .withHistory(hist)
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