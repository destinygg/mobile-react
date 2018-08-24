import React, { Component } from 'react';
import { WebView, ScrollView, View, Text, Platform } from 'react-native';
import { StackActions, NavigationScreenProps, NavigationActions } from 'react-navigation';
import ButtonList from 'components/forms/ButtonList';
import { Palette, h2 } from 'assets/constants';

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
            <ScrollView style={{
                flex: 1,
                backgroundColor: Palette.background,
                paddingTop: (Platform.OS === 'ios' ? 20 : 0)                
            }}>
                <View>
                    <Text style={{
                        fontSize: h2,
                        fontWeight: '700',
                        color: Palette.title,
                        marginTop: 100,
                        marginBottom: 10,        
                        marginLeft: 15        
                    }}>
                        Choose auth provider.
                    </Text>
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
                        this.props.navigation.dispatch(StackActions.reset({
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