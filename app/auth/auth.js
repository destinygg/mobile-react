import React, { Component } from 'react';
import { WebView, Platform, ScrollView, View, Text } from 'react-native';
import { ButtonList } from '../components';
import { NavigationActions } from 'react-navigation';
import styles from './styles';

export class AuthView extends Component {
    constructor(props) {
        super(props);

        const { navigation, screenProps } = props;

        this.listItems = [
            { itemText: 'Twitch', itemTarget: () => this._onProviderSelect('twitch') },
            /* Google is no-go right now.  They don't allow embedded useragents to
               use their oauth implementation.
            { itemText: 'Google', itemTarget: () => this._onProviderSelect('google') }, */
            { itemText: 'Twitter', itemTarget: () => this._onProviderSelect('twitter') },
            { itemText: 'Reddit', itemTarget: () => this._onProviderSelect('reddit') },
            { itemText: 'Discord', itemTarget: () => this._onProviderSelect('discord') }
        ];
    }

    _onProviderSelect(provider) {
        this.props.navigation.dispatch(
            NavigationActions.navigate({
                routeName: 'AuthWebView', 
                params: { authProvider: provider } 
            })
        );
    }

    render() {
        return (
            <ScrollView style={[styles.View, styles.iosPad]}>
                <View>
                    <Text style={styles.selectTitle}>{'Choose auth provider.'}</Text>
                    <ButtonList listItems={this.listItems} />                    
                </View>
            </ScrollView>
        )
    }
}

export class AuthWebView extends Component {
    render() {
        return (
            <WebView
                source={{
                    uri: `https://www.destiny.gg/login?authProvider=${this.props.navigation.state.params.authProvider}&rememberme=on`,
                    method: 'POST'
                }}
                style={{ backgroundColor: '#000' }}
                onNavigationStateChange={e => {
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
        );
    }
}