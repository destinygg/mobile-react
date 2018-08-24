import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import { NavigationActions, NavigationScreenProps, StackActions } from 'react-navigation';

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

                await MobileChat.current.loadMobileSettings();

                MobileChat.current
                    .withMe(me)
                    .withUserAndSettings(me)
                    .connect("wss://www.destiny.gg/ws");


                // @ts-ignore
                global.bugsnag.setUser(me.userId, me.username, me.username + '@destiny.gg');
                navigation.dispatch(StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'MainNav' })
                    ]
                }));
            } else {
                navigation.dispatch(StackActions.reset({
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
                            navigation.dispatch(StackActions.reset({
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
            <View style={{flex: 1}} />
        )
    }
}