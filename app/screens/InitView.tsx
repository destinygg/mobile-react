import React, { Component } from 'react';
import { View, Alert, ActivityIndicator, Image, Dimensions, Text } from 'react-native';
import { NavigationActions, NavigationScreenProps, StackActions } from 'react-navigation';
import MobileEmotes from 'chat/MobileEmotes';
import MobileIcons from 'chat/MobileIcons';
import { MobileChatFlairColors } from 'chat/styles';
import { Palette } from 'assets/constants';

const { MobileChat } = require("../chat/chat"); 

export default class InitView extends Component<NavigationScreenProps, {status?: string}> {
    constructor(props: NavigationScreenProps) {
        super(props);
        this.state = { status: "Connecting to destiny.gg..." };
    }
    async componentDidMount() {
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
        const meRes = await fetch(meReq);
        const histRes = await fetch(histReq);

        this.setState({status: "Updating assets..."});

        Promise.all([
            MobileEmotes.init(), 
            MobileIcons.init(),
            MobileChatFlairColors.init()
        ]).then(async () => {
            this.setState({status: undefined});
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
            this.setState({status: undefined})
        });
    }

    render() {
        return(
            <View 
                style={{
                    flex: 1,
                    backgroundColor: Palette.background,
                    alignItems: "center"
                }} 
            >
                <View
                    style={{
                        shadowOffset: {width: 0, height: 5},
                        shadowRadius: 10,
                        shadowOpacity: 0.7,
                        marginBottom: 35,
                        marginTop: Dimensions.get("window").height * 0.3,
                    }}
                >
                    <Image
                        source={require("assets/logo.jpg")}
                        resizeMode={"contain"}
                        style={{
                            maxWidth: 128,
                            maxHeight: 128,
                            borderRadius: 10,
                        }}
                    />
                </View>
                <ActivityIndicator
                    size={"large"}
                    color={"#5DAEE7"}
                />
                {this.state.status &&
                    <Text
                        style={{
                            color: Palette.text,
                            fontSize: 14,
                            marginTop: 25
                        }}
                    >
                        {this.state.status}
                    </Text>
                }
            </View>
        )
    }
}