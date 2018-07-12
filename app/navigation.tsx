import { StackNavigator } from 'react-navigation';
import { AuthView, AuthWebView } from 'screens/auth'
import InitView from 'screens/init'
import MainView from 'screens/main'
import ProfileNav from 'screens/profile';
import MessageNav from 'screens/messages';
import DonateNav from 'screens/donate';

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
