import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { AuthView, AuthWebView } from './auth/auth'
import InitView from 'init/init'
import MainView from 'main/main'
import ProfileNav from 'profile/profile';
import MessageNav from 'messages/messages';
import DonateNav from 'donate/donate';

const InitNav = StackNavigator({
    InitView: { screen: InitView },
    AuthView: { screen: AuthView },
    AuthWebView: { screen: AuthWebView },
    MainNav: { screen: MainView },
    ProfileView: { screen: ProfileNav },
    MessageView: { screen: MessageNav },
    DonateView: { screen: DonateNav },
}, {
    initialRouteName: 'InitView',
    headerMode: 'none',
    cardStyle: {flex: 1, backgroundColor: '#000'}
});

export default InitNav;
