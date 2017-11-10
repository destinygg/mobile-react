import React, { Component } from 'react';
import { View, ScrollView, Text, TextInput, WebView, Platform, Button, SafeAreaView } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { TextInputListItem, UserAgreement } from '../components';
import styles from '../styles';

class DonateWebView extends Component {
    static navigationOptions = {
        drawerLockMode: 'locked-closed'
    };

    constructor(props) {
        super(props);
        this.state = { webViewHtml: null };
        const { navigation } = this.props;

        const formData = {
            amount: navigation.state.params.amount,
            message: navigation.state.params.message,
        };

        /* fetch() + pass html string into webview doesn't work, as
           paypal doesn't like the change in useragent.  construct
           formdata manually.
        */
        this.body = Object.keys(formData).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(formData[key]);
        }).join('&').replace(/%20/g, '+');
    }

    render() {
        return (
            <WebView
                source={{
                    uri: `https://www.destiny.gg/donate`,
                    method: 'POST',
                    body: this.body
                }}
                startInLoadingState={true}
                style={{ backgroundColor: '#000' }}
                onNavigationStateChange={e => {
                    if (e.loading == false && e.url.indexOf('destiny.gg') != -1) {
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

class DonateView extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return ({
            title: 'Donate',
            headerRight: <View style={{ marginRight: 5 }}>
                            <Button title='Pay' onPress={params.sendHandler ? params.sendHandler : () => null} />
                        </View>
        });
    }

    constructor(props) {
        super(props);
        this.state = { amount: 0, message: "" };
    }

    send() {
        this.props.navigation.navigate('DonateWebView', {amount: this.state.amount, message: this.state.message});
    }

    componentDidMount() {
        this.props.navigation.setParams({ sendHandler: () => this.send() });
    }

    render() {
        return (
            <SafeAreaView style={styles.View}>
                <ScrollView style={{ paddingTop: 25 }}>
                    <TextInputListItem
                        name='amount'
                        placeholder='Amount (USD)'
                        onChange={(name, value) => this.setState({ amount: value })}
                        key='amount'
                        first={true}
                    />
                    <TextInputListItem
                        name='message'
                        placeholder='Write your message!'
                        onChange={(name, value) => this.setState({ message: value })}
                        key='message'
                        last={true}
                        multiline={true}
                        maxLength={200}
                    />
                    <Text style={styles.SubscriptionTerms}>
                        By clicking the "Pay" button, you are confirming that this purchase is
                        what you wanted and that you have read the <Text onPress={() => this._showUserAgreement()} style={styles.UserAgreement}>user agreement.</Text>
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
        headerStyle: styles.Navigation,
        headerTitleStyle: styles.NavigationHeaderTitle,
        headerTintColor: (Platform.OS === 'android') ? '#fff' : undefined
    },
    cardStyle: styles.View
});

export default DonateNav;