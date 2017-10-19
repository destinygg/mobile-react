import { StackNavigator, DrawerNavigator } from 'react-navigation';
import AuthView from './auth/auth.js'
import MainView from './main/main';
import { MobileChatView } from './chat/chat';
import ProfileView from './profile/profile';
import MessageView from './messages/messages';

const MainNav = DrawerNavigator({
    MainView: { screen: MainView },
    ChatView: { screen: MobileChatView },
    MessageView: { screen: MessageView },
    ProfileView: { screen: ProfileNav }
}, {
    initialRouteName: "MainView"
});

// may have to add an intermediate view between InitNav and MainNav
// to pass screenProps correctly

const InitNav = StackNavigator({
    InitView: { screen: InitView },
    AuthView: { screen: AuthView },
    MainNav: { screen: MainNav }
}, {
    initialRouteName: "InitView"
});

export default InitNav;