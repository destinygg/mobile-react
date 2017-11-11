import { StackNavigator, DrawerNavigator } from 'react-navigation';
import React, { Component } from 'react';
import { AuthView, AuthWebView } from './auth/auth'
import InitView from './init/init'
import MainView from './main/main';
import { ChatViewWrapper } from './chat/window';
import ProfileNav from './profile/profile';
import MessageNav from './messages/messages';
import DonateNav from './donate/donate';
import AboutView from './about/about'

const MainNav = DrawerNavigator({
    MainView: { screen: MainView },
    ChatView: { screen: ChatViewWrapper },
    MessageView: { 
        screen: MessageNav,
        navigationOptions: {
            title: 'Messages'
        }
    },
    DonateView: { screen: DonateNav },
    ProfileView: { screen: ProfileNav },
    About: { screen: AboutView }
}, {
    initialRouteName: "MainView",
    drawerBackgroundColor: '#111',
    contentOptions: {
        activeBackgroundColor: '#181818',
        inactiveTintColor: '#fff'
    },
    drawerWidth: 250
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