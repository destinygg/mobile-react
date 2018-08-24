import { createStackNavigator } from 'react-navigation';
import { AuthView, AuthWebView } from 'screens/AuthView'
import InitView from 'screens/InitView'
import MainView from 'screens/MainView'
import ProfileNav from 'screens/profile';
import MessageNav from 'screens/MessageView';
import DonateNav from 'screens/DonateView';

const InitNav = createStackNavigator({
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
