"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_navigation_1 = require("react-navigation");
const auth_1 = require("screens/auth");
const init_1 = __importDefault(require("screens/init"));
const main_1 = __importDefault(require("screens/main"));
const profile_1 = __importDefault(require("screens/profile"));
const messages_1 = __importDefault(require("screens/messages"));
const donate_1 = __importDefault(require("screens/donate"));
const InitNav = react_navigation_1.StackNavigator({
    InitView: { screen: init_1.default },
    AuthView: { screen: auth_1.AuthView },
    AuthWebView: { screen: auth_1.AuthWebView },
    MainNav: { screen: main_1.default },
    ProfileView: { screen: profile_1.default },
    MessageView: { screen: messages_1.default },
    DonateView: { screen: donate_1.default },
}, {
    initialRouteName: 'InitView',
    headerMode: 'none',
    cardStyle: { flex: 1, backgroundColor: '#000' }
});
exports.default = InitNav;
