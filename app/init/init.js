import React, { Component } from 'react';
import { View } from 'react-native';
//import styles from './styles';

class InitView extends Component {
    constructor(props) {
        super(props);

        const { navigation, screenProps } = props;

        let me = fetch('/api/chat/me', { method: "GET" })
        let history = fetch('/api/chat/history', { method: "GET" });

        Promise.all([me, history]).then(values => {
            let me = values[0];
            let history = values[1];

            screenProps.chat.withHistory(history);

            if (me) {
                navigation.dispatch(NavigationActions.Reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'MainNav' })
                    ]
                }));
            } else {
                navigation.dispatch(NavigationActions.Reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'AuthNav' })
                    ]
                }));
            }
        });
    }

    render() {
        return(
            <View>

            </View>
        )
    }
}