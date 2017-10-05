import { StackNavigator } from 'react-navigation';
import AuthView from './auth/auth.js'
import MainView from './main/main.js';
import ProfileView from './profile/profile.js';

const MainNav = DrawerNavigator({
    MainView: { screen: MainView },
    ChatView: { screen: MainView },      // figure out how to pass chat state into MainView
    ProfileView: { screen: ProfileView }
});

const InitNav = StackNavigator({
    InitView: { screen: InitView },
    AuthView: { screen: AuthView },
    MainNav: { screen: MainNav }
});