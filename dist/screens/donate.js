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
const TextInputListItem_1 = __importDefault(require("../components/forms/TextInputListItem"));
const UserAgreement_1 = require("../components/UserAgreement");
class DonateWebView extends react_1.Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const formData = {
            amount: navigation.state.params.amount,
            message: navigation.state.params.message,
        };
        this.state = { webViewHtml: Object.keys(formData).map((key) => {
                return encodeURIComponent(key) + '=' + encodeURIComponent(formData[key]);
            }).join('&').replace(/%20/g, '+')
        };
        /* fetch() + pass html string into webview doesn't work, as
           paypal doesn't like the change in useragent.  construct
           formdata manually.
        */
    }
    render() {
        return (react_1.default.createElement(react_native_1.WebView, { source: {
                uri: `https://www.destiny.gg/donate`,
                method: 'POST',
                body: this.state.webViewHtml
            }, startInLoadingState: true, style: { backgroundColor: '#000' }, onNavigationStateChange: e => {
                if (e.loading == false && e.url && e.url.indexOf('destiny.gg') != -1) {
                    if (e.url.indexOf('error') != -1) {
                        react_native_1.Alert.alert('Error', 'Could not complete donation. \
Try again later.');
                        this.props.navigation.goBack();
                    }
                    else if (e.url.indexOf('complete') != -1) {
                        react_native_1.Alert.alert('Success', 'Donation complete.');
                        this.props.navigation.dispatch(react_navigation_1.NavigationActions.reset({
                            index: 0,
                            actions: [
                                react_navigation_1.NavigationActions.navigate({ routeName: 'DonateView' }),
                            ]
                        }));
                    }
                }
            } }));
    }
}
DonateWebView.navigationOptions = {
    drawerLockMode: 'locked-closed'
};
class DonateView extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = { amount: "", message: "" };
    }
    send() {
        this.props.navigation.navigate('DonateWebView', { amount: this.state.amount, message: this.state.message });
    }
    componentDidMount() {
        this.props.navigation.setParams({
            sendHandler: () => this.send(),
            backHandler: this.props.navigation.state.params.backHandler
        });
    }
    _showUserAgreement() {
        this.props.navigation.navigate('UserAgreement');
    }
    render() {
        return (react_1.default.createElement(react_navigation_1.SafeAreaView, { style: styles_1.default.View },
            react_1.default.createElement(react_native_1.ScrollView, { style: { paddingTop: 25 } },
                react_1.default.createElement(TextInputListItem_1.default, { name: 'amount', value: this.state.amount, placeholder: 'Amount (USD)', onChange: (name, value) => this.setState({ amount: value }), key: 'amount', first: true }),
                react_1.default.createElement(TextInputListItem_1.default, { name: 'message', value: this.state.message, placeholder: 'Write your message!', onChange: (name, value) => this.setState({ message: value }), key: 'message', last: true, multiline: true, maxLength: 200 }),
                react_1.default.createElement(react_native_1.Text, { style: styles_1.default.SubscriptionTerms },
                    "By clicking the \"Pay\" button, you are confirming that this purchase is what you wanted and that you have read the ",
                    react_1.default.createElement(react_native_1.Text, { onPress: () => this._showUserAgreement(), style: styles_1.default.Link }, "user agreement.")))));
    }
}
DonateView.navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return ({
        title: 'Donate',
        headerLeft: react_1.default.createElement(react_navigation_1.HeaderBackButton, { title: 'Back', onPress: () => params.backHandler() }),
        headerRight: react_1.default.createElement(react_native_1.View, { style: styles_1.default.navbarRight },
            react_1.default.createElement(react_native_1.Button, { title: 'Pay', onPress: params.sendHandler ? params.sendHandler : () => null })),
        headerTintColor: "#ccc"
    });
};
const DonateNav = react_navigation_1.StackNavigator({
    DonateView: { screen: DonateView },
    DonateWebView: { screen: DonateWebView },
    UserAgreement: { screen: UserAgreement_1.UserAgreement }
}, {
    initialRouteName: 'DonateView',
    navigationOptions: {
        headerStyle: styles_1.default.Navigation,
        headerTitleStyle: styles_1.default.NavigationHeaderTitle,
        headerTintColor: (react_native_1.Platform.OS === 'android') ? '#fff' : undefined
    },
    cardStyle: styles_1.default.View
});
exports.default = DonateNav;
