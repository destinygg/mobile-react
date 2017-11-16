import { StackNavigator, DrawerNavigator } from 'react-navigation';
import React, { Component } from 'react';
import { AuthView, AuthWebView } from './auth/auth'
import InitView from './init/init'
import MainView from './main/main'

const InitNav = StackNavigator({
    InitView: { screen: InitView },
    AuthView: { screen: AuthView },
    AuthWebView: { screen: AuthWebView },
    MainNav: { screen: MainView }
}, {
    initialRouteName: 'InitView',
    headerMode: 'none',
    cardStyle: {flex: 1, backgroundColor: '#000'}
});

export default InitNav;
