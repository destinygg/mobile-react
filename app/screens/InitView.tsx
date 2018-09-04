import React, { Component } from 'react';
import { View, Alert, ActivityIndicator, Image } from 'react-native';
import { NavigationActions, NavigationScreenProps, StackActions } from 'react-navigation';
import MobileEmotes from 'chat/MobileEmotes';
import MobileIcons from 'chat/MobileIcons';
import { MobileChatFlairColors } from 'chat/styles';
import { Palette } from 'assets/constants';

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

        Promise.all([
            fetch(meReq), 
            fetch(histReq), 
            MobileEmotes.init(), 
            MobileIcons.init(),
            MobileChatFlairColors.init()
        ]).then(async r => {
            const meRes = r[0];
            const histRes = r[1];
            if (meRes.ok) {
                const me = await meRes.json();
                const hist = await histRes.json();

                await MobileChat.current.loadMobileSettings();

                MobileChat.current
                    .withMe(me)
                    .withUserAndSettings(me)
                    .withHistory(hist)
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
            console.log(error);
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
            <View 
                style={{
                    flex: 1,
                    backgroundColor: Palette.background,
                    justifyContent: "center"
                }} 
            >
                <Image
                    source={require("assets/logo.jpg")}
                    resizeMode={"contain"}
                    style={{
                        maxWidth: 200,
                        maxHeight: 200,
                        marginBottom: 25
                    }}
                />
                <ActivityIndicator
                    size={"large"}
                />
            </View>
        )
    }
}