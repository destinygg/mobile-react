import { StackNavigator, DrawerNavigator } from 'react-navigation';
import React, { Component } from 'react';
import { AuthView, AuthWebView } from './auth/auth.js'
import InitView from './init/init.js'
import MainView from './main/main';
import { ChatViewWrapper } from './chat/window';
import ProfileNav from './profile/profile';
import MessageNav from './messages/messages';

const MainNav = DrawerNavigator({
    MainView: { screen: MainView },
    ChatView: { screen: ChatViewWrapper },
    MessageView: { 
        screen: MessageNav,
        navigationOptions: {
            title: 'Messages'
        }
    },
    ProfileView: { screen: ProfileNav }
}, {
    initialRouteName: "MainView",
    drawerBackgroundColor: '#111',
    contentOptions: {
        activeBackgroundColor: '#181818',
        inactiveTintColor: '#fff'
    }
});

const InitNav = StackNavigator({
    InitView: { screen: InitView },
    AuthView: { screen: AuthView },
    AuthWebView: { screen: AuthWebView },
    MainNav: { screen: MainNav }
}, {
    initialRouteName: 'InitView',
    headerMode: 'none',
    cardStyle: {flex: 1, backgroundColor: '#000'}
});

export default InitNav;