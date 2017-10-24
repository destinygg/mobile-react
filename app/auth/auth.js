import React, { Component } from 'react';
import { WebView, Platform } from 'react-native';
import { NavigationActions } from 'react-navigation';
//import styles from './styles';

export default class AuthView extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let body;
        const formData = new FormData;
        formData.append('authProvider', 'reddit');
        formData.append('rememberme', 'on');
            return (
                <WebView 
                    source={{uri: `https://www.destiny.gg/login?authProvider=reddit&rememberme=on`, 
                             method: 'POST'
                    }} 
                    style={{backgroundColor: '#000'}}
                    onNavigationStateChange={e => {
                        console.log(e);
                        if ( e.loading == false && e.url.indexOf('destiny.gg/profile') != -1){
                            this.props.navigation.dispatch(NavigationActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({ routeName: 'InitView' })
                                ]
                            }));
                        }
                    }}
                />
            )
    }
}