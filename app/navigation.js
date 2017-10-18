import { StackNavigator, DrawerNavigator } from 'react-navigation';
import AuthView from './auth/auth.js'
import MainView from './main/main.js';
import { MobileChatView } from './chat/chat.js';
import ProfileView from './profile/profile.js';
import MessageView from './messages/messages.js';

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