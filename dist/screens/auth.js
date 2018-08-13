"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_navigation_1 = require("react-navigation");
const styles_1 = __importDefault(require("styles"));
const ButtonList_1 = __importDefault(require("../components/forms/ButtonList"));
class AuthView extends react_1.Component {
    constructor(props) {
        super(props);
    }
    _onProviderSelect(provider) {
        this.props.navigation.dispatch(react_navigation_1.NavigationActions.navigate({
            routeName: 'AuthWebView',
            params: { authProvider: provider }
        }));
    }
    render() {
        const listItems = [
            { name: 'Twitch', onPress: () => this._onProviderSelect('twitch') },
            /* Google is no-go right now.  They don't allow embedded useragents to
               use their oauth implementation.
            { name: 'Google', onPress: () => this._onProviderSelect('google') }, */
            { name: 'Twitter', onPress: () => this._onProviderSelect('twitter') },
            { name: 'Reddit', onPress: () => this._onProviderSelect('reddit') },
            { name: 'Discord', onPress: () => this._onProviderSelect('discord') }
        ];
        return (react_1.default.createElement(react_native_1.ScrollView, { style: [styles_1.default.View, styles_1.default.iosPad] },
            react_1.default.createElement(react_native_1.View, null,
                react_1.default.createElement(react_native_1.Text, { style: styles_1.default.selectTitle }, 'Choose auth provider.'),
                react_1.default.createElement(ButtonList_1.default, { listItems: listItems }))));
    }
}
exports.AuthView = AuthView;
class AuthWebView extends react_1.Component {
    render() {
        return (react_1.default.createElement(react_native_1.WebView, { source: {
                uri: `https://www.destiny.gg/login?authProvider=${this.props.navigation.state.params.authProvider}&rememberme=on`,
                method: 'POST'
            }, style: { backgroundColor: '#000' }, onNavigationStateChange: e => {
                if (e.loading == false && e.url && e.url.indexOf('destiny.gg/profile') != -1) {
                    this.props.navigation.dispatch(react_navigation_1.NavigationActions.reset({
                        index: 0,
                        actions: [
                            react_navigation_1.NavigationActions.navigate({ routeName: 'InitView' })
                        ]
                    }));
                }
            } }));
    }
}
exports.AuthWebView = AuthWebView;
