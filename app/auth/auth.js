import React, { Component } from 'react';
import { WebView, Platform } from 'react-native';
import { NavigationActions } from 'react-navigation';
import styles from '../styles';

export class AuthView extends Component {
    constructor() {
        this.listItems = [
            { itemText: 'Twitch', itemTarget: _onProviderSelect('twitch') },
            { itemText: 'Google', itemTarget: _onProviderSelect('google') },
            { itemText: 'Twitter', itemTarget: _onProviderSelect('twitter') },
            { itemText: 'Reddit', itemTarget: _onProviderSelect('reddit') },
            { itemText: 'Discord', itemTarget: _onProviderSelect('discord') }
        ];
    }

    _onProviderSelect(provider) {
        this.props.authProvider.name = provider;
        NavigationActions.navigate({ routeName: 'AuthWebView' })
    }

    render() {
        return (
            <ScrollView style={styles.View}>
                <View>
                    <Text style={styles.subtitle}>{'Choose auth provider.'}</Text>
                </View>
                <ButtonList listItems={this.listItems} />
            </ScrollView>
        )
    }
}

export class AuthWebView extends Component {
    render() {
        <WebView
            source={{
                uri: `https://www.destiny.gg/login?authProvider=${this.props.authProvider.name}&rememberme=on`,
                method: 'POST'
            }}
            style={{ backgroundColor: '#000' }}
            onNavigationStateChange={e => {
                console.log(e);
                if (e.loading == false && e.url.indexOf('destiny.gg/profile') != -1) {
                    this.props.navigation.dispatch(NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: 'InitView' })
                        ]
                    }));
                }
            }}
        />
    }
}