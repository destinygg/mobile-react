import React, { Component } from 'react';
import { View, ScrollView, Text, TextInput, WebView } from 'react-native';
import { NavigationActions } from 'react-navigation';

class DonateWebView extends Component {
    static navigationOptions = {
        drawerLockMode: 'locked-closed'
    };

    constructor(props) {
        super(props);
        this.state = { webViewHtml: null };
        const { navigation } = this.props;
        const formData = new FormData();
        formData.append('amount', navigation.state.params.amount);
        formData.append('message', navigation.state.params.message);

        fetch(`https://www.destiny.gg/donate`, {
            'Content-Type': 'application/x-www-form-urlencoded',
            method: 'POST',
            credentials: 'include',
            body: formData
        }).then((response) => {
            response.text().then((html) => {
                this.setState({ webViewHtml: html });
            })
        });
    }

    render() {
        console.log(this.state.webViewHtml);
        return (
            <WebView
                source={(this.state.webViewHtml === null) ? { uri: '' } : { html: this.state.webViewHtml }}
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
            headerRight: <Button title='Send' onPress={params.sendHandler ? params.sendHandler : () => null} />
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
                    />
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export const DonateNav = StackNavigator({
    DonateView: { screen: DonateView },
    DonateWebView: { screen: DonateWebView }
}, {
    initialRouteName: 'DonateView',
    navigationOptions: {
        headerStyle: styles.Navigation,
        headerTitleStyle: styles.NavigationHeaderTitle,
        headerTintColor: (Platform.OS === 'android') ? '#fff' : undefined
    },
    cardStyle: styles.View
});