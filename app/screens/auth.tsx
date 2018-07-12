import React, { Component } from 'react';
import { WebView, ScrollView, View, Text } from 'react-native';
import { ButtonList } from 'components';
import { NavigationActions, NavigationScreenProps } from 'react-navigation';
import styles from 'styles';

interface AuthNavParams {
    authProvider: string;
}

export class AuthView extends Component<NavigationScreenProps<{}>> {
    constructor(props: NavigationScreenProps<{}>) {
        super(props);
    }

    _onProviderSelect(provider: string) {
        this.props.navigation.dispatch(
            NavigationActions.navigate({
                routeName: 'AuthWebView', 
                params: { authProvider: provider } 
            })
        );
    }

    render() {
        const listItems = [
            { name: 'Twitch', onPress: () => this._onProviderSelect('twitch') },
            /* Google is no-go right now.  They don't allow embedded useragents to
               use their oauth implementation.
            { name: 'Google', onPress: () => this._onProviderSelect('google') }, */
            { name: 'Twitter', onPress: () => this._onProviderSelect('twitter') },
            { name: 'Reddit', onPress: () => this._onProviderSelect('reddit') },
            { name: 'Discord', onPress: () => this._onProviderSelect('discord') }
        ];

        return (
            <ScrollView style={[styles.View, styles.iosPad]}>
                <View>
                    <Text style={styles.selectTitle}>{'Choose auth provider.'}</Text>
                    <ButtonList listItems={listItems} />                    
                </View>
            </ScrollView>
        )
    }
}

export class AuthWebView extends Component<NavigationScreenProps<AuthNavParams>> {
    render() {
        return (
            <WebView
                source={{
                    uri: `https://www.destiny.gg/login?authProvider=${this.props.navigation.state.params!.authProvider}&rememberme=on`,
                    method: 'POST'
                }}
                style={{ backgroundColor: '#000' }}
                onNavigationStateChange={e => {
                    if (e.loading == false && e.url && e.url.indexOf('destiny.gg/profile') != -1) {
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