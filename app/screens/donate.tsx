import React, { Component } from 'react';
import { Alert, Button, Platform, ScrollView, Text, View, WebView } from 'react-native';
import { HeaderBackButton, NavigationActions, NavigationScreenProps, SafeAreaView, StackNavigator } from 'react-navigation';

import TextInputListItem from 'components/forms/TextInputListItem';
import { UserAgreement } from 'components/UserAgreement';
import { Palette } from 'assets/constants';

interface DonateWebViewParams {
    amount: string;
    message: string;
}

class DonateWebView extends Component<NavigationScreenProps<DonateWebViewParams>, {webViewHtml?: string}> {
    static navigationOptions = {
        drawerLockMode: 'locked-closed'
    };

    constructor(props: NavigationScreenProps<DonateWebViewParams>) {
        super(props);

        const { navigation } = this.props;

        const formData: {[key: string]: string} = {
            amount: navigation.state.params!.amount,
            message: navigation.state.params!.message,
        };

        this.state = { webViewHtml:  
            Object.keys(formData).map((key) => {
                return encodeURIComponent(key) + '=' + encodeURIComponent(formData[key]);
            }).join('&').replace(/%20/g, '+')
        };

        /* fetch() + pass html string into webview doesn't work, as
           paypal doesn't like the change in useragent.  construct
           formdata manually.
        */
    }

    render() {
        return (
            <WebView
                source={{
                    uri: `https://www.destiny.gg/donate`,
                    method: 'POST',
                    body: this.state.webViewHtml
                }}
                startInLoadingState={true}
                style={{ backgroundColor: '#000' }}
                onNavigationStateChange={e => {
                    if (e.loading == false && e.url && e.url.indexOf('destiny.gg') != -1) {
                        if (e.url.indexOf('error') != -1) {
                            Alert.alert('Error', 'Could not complete donation. \
Try again later.');
                            this.props.navigation.goBack();
                        } else if (e.url.indexOf('complete') != -1) {
                            Alert.alert('Success', 'Donation complete.');
                            this.props.navigation.dispatch(NavigationActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({ routeName: 'DonateView' }),
                                ]
                            }));
                        }
                    }
                }}
            />
        );
    }
}

interface DonateViewParams {
    sendHandler: {(): any};
    backHandler: {(): any};
}

class DonateView extends Component<NavigationScreenProps<DonateViewParams>, {amount: string, message: string}> {    
    static navigationOptions = ({ navigation }: any) => {
        const { params }: {params: DonateViewParams} = navigation.state;
        return ({
            title: 'Donate',
            headerLeft: <HeaderBackButton title='Back' onPress={() => params.backHandler()} />,    
            headerRight: <View style={{
                            marginRight: (Platform.OS == 'ios') ? 5 : 15
                        }}>
                            <Button title='Pay' onPress={params.sendHandler ? params.sendHandler : () => null} />
                        </View>,
            headerTintColor: Palette.messageText
        });
    }

    constructor(props: NavigationScreenProps<DonateViewParams>) {
        super(props);
        this.state = { amount: "", message: "" };
    }

    send() {
        this.props.navigation.navigate('DonateWebView', {amount: this.state.amount, message: this.state.message});
    }

    componentDidMount() {
        this.props.navigation.setParams({ 
            sendHandler: () => this.send(), 
            backHandler: this.props.navigation.state.params!.backHandler 
        });
    }

    _showUserAgreement() {
        this.props.navigation.navigate('UserAgreement');
    }

    render() {
        return (
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: Palette.background
            }}>
                <ScrollView style={{ paddingTop: 25 }}>
                    <TextInputListItem
                        name='amount'
                        value={this.state.amount}
                        placeholder='Amount (USD)'
                        onChange={(name, value) => this.setState({ amount: value })}
                        key='amount'
                        first={true}
                    />
                    <TextInputListItem
                        name='message'
                        value={this.state.message}
                        placeholder='Write your message!'
                        onChange={(name, value) => this.setState({ message: value })}
                        key='message'
                        last={true}
                        multiline={true}
                        maxLength={200}
                    />
                    <Text style={{
                        color: Palette.handleLine,
                        fontSize: 12,
                        margin: 15
                    }}>
                        By clicking the "Pay" button, you are confirming that this purchase is
                        what you wanted and that you have read the 
                        <Text 
                            onPress={() => this._showUserAgreement()} 
                            style={{
                                color: Palette.link
                            }}
                        >
                            user agreement.
                        </Text>
                    </Text>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const DonateNav = StackNavigator({
    DonateView: { screen: DonateView },
    DonateWebView: { screen: DonateWebView },
    UserAgreement: { screen: UserAgreement }
}, {
    initialRouteName: 'DonateView',
    navigationOptions: {
        headerStyle: {
            backgroundColor: Palette.inner,
            borderColor: Palette.navBorder,
            borderStyle: "solid"
        },
        headerTitleStyle: {color: Palette.title},
        headerTintColor: (Platform.OS === 'android') ? Palette.title : undefined
    },
    cardStyle: {
        flex: 1,
        backgroundColor: Palette.background
    }
});

export default DonateNav;