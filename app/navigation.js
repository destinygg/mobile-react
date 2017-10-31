import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { AuthView, AuthWebView } from './auth/auth.js'
import InitView from './init/init.js'
import MainView from './main/main';
import { ChatViewWrapper } from './chat/window';
import ProfileNav from './profile/profile';
import MessageView from './messages/messages';

const MainNav = DrawerNavigator({
    MainView: { screen: MainView },
    ChatView: { screen: ChatViewWrapper },
    //MessageView: { screen: MessageView },
    ProfileView: { screen: ProfileNav }
}, {
    initialRouteName: "MainView"
});

let authProvider = { name: null };

const InitNav = StackNavigator({
    InitView: { screen: InitView },
    AuthView: { screen: (props) => <AuthView {...props} authProvider={authProvider} /> },
    AuthWebView: { screen: (props) => <AuthWebView {...props} authProvider={authProvider} /> },
    MainNav: { screen: MainNav }
}, {
    initialRouteName: 'InitView',
    headerMode: 'none'
});

export default InitNav;