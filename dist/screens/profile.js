"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_navigation_1 = require("react-navigation");
const ButtonList_1 = require("../components/forms/ButtonList");
const FormView_1 = __importStar(require("../components/forms/FormView"));
const NavList_1 = require("../components/NavList");
const UserAgreement_1 = require("../components/UserAgreement");
const styles_1 = __importDefault(require("../styles"));
const about_1 = __importDefault(require("./about"));
const countries = require("../../lib/assets/countries.json");
const countryOptions = countries.map((item) => {
    return ({ name: item['name'], value: item['alpha-2'] });
});
const { MobileChat } = require("../chat/chat");
class AccountView extends FormView_1.default {
    constructor(props) {
        super(props);
        this.endpoint = 'profile/update';
        this.formState = { items: {
                username: MobileChat.current.me.username,
                email: MobileChat.current.me.email,
                country: MobileChat.current.me.country
            } };
        this.formItems = [
            {
                placeholder: "Username",
                name: "username",
                type: "text",
                readOnly: true // need 'changes available' added to /api/me
            },
            {
                placeholder: "Email",
                name: "email",
                type: "text",
            },
            {
                placeholder: "Nationality",
                name: "country",
                type: "select",
                selectOptions: countryOptions,
            },
        ];
    }
    render() {
        return (react_1.default.createElement(react_navigation_1.SafeAreaView, { style: styles_1.default.View },
            react_1.default.createElement(react_native_1.ScrollView, { style: styles_1.default.View },
                react_1.default.createElement(FormView_1.ProfileForm, { formItems: this.formItems, formState: this.state, onChange: this._onChange.bind(this) }))));
    }
}
class SubscriptionItem extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = { press: false };
    }
    render() {
        const tierColor = (this.props.displayName === "Tier IV") ?
            '#a427d6' :
            (this.props.displayName === "Tier III") ?
                '#0060ff' :
                (this.props.displayName === "Tier II") ?
                    '#488ce7' :
                    (this.props.displayName === "Tier I" || this.props.displayName === "Twitch") ?
                        '#488ce7' :
                        undefined;
        return (react_1.default.createElement(react_native_1.TouchableHighlight, { onPress: () => this.props.onSelect &&
                this.props.subId &&
                this.props.onSelect(this.props.subId, this.props.displayName, this.props.duration), style: [styles_1.default.SubscriptionItem, { borderColor: tierColor }], onPressIn: () => this.setState({ press: true }), onPressOut: () => this.setState({ press: false }), delayPressOut: 100, underlayColor: tierColor },
            react_1.default.createElement(react_native_1.View, { style: { alignItems: 'flex-start', justifyContent: 'space-between', flex: 1 } },
                react_1.default.createElement(react_native_1.View, { style: { alignItems: 'flex-start' } },
                    react_1.default.createElement(react_native_1.Text, { style: [styles_1.default.SubscriptionTitle, (this.state.press) ? { color: '#000' } : null] }, this.props.displayName),
                    react_1.default.createElement(react_native_1.Text, { style: [
                            styles_1.default.SubscriptionSubtitle,
                            (this.props.duration === '3mo' || this.props.alreadySubscribed) ? styles_1.default.ThreeMonth : null,
                            (this.state.press) ? { color: '#000', borderColor: '#000' } : null
                        ] }, this.props.duration)),
                !this.props.alreadySubscribed &&
                    react_1.default.createElement(react_native_1.Text, { style: [styles_1.default.SubscriptionPrice, (this.state.press) ? { color: '#000' } : null] }, this.props.price))));
    }
}
SubscriptionItem.navigationOptions = {
    title: 'Subscription',
};
class SubscriptionView extends react_1.Component {
    _onSelect(subId, subName, subDuration) {
        this.props.navigation.navigate('SubscriptionMessageView', { subId: subId, subName: subName, subDuration: subDuration });
    }
    render() {
        const features = this.props.screenProps.chat.me.features;
        if (features.indexOf('subscriber') === -1) {
            return (react_1.default.createElement(react_navigation_1.SafeAreaView, { style: styles_1.default.View },
                react_1.default.createElement(react_native_1.ScrollView, { style: styles_1.default.SubscriptionView },
                    react_1.default.createElement(react_native_1.Text, { style: styles_1.default.ChooseTitle }, "Choose subscription."),
                    react_1.default.createElement(react_native_1.View, { style: styles_1.default.SubscriptionRow },
                        react_1.default.createElement(SubscriptionItem, { subId: "1-MONTH-SUB4", displayName: "Tier IV", duration: "1mo", price: "$40", onSelect: (id, name, duration) => this._onSelect(id, name, duration) }),
                        react_1.default.createElement(SubscriptionItem, { subId: "3-MONTH-SUB4", displayName: "Tier IV", duration: "3mo", price: "$96", onSelect: (id, name, duration) => this._onSelect(id, name, duration) })),
                    react_1.default.createElement(react_native_1.View, { style: styles_1.default.SubscriptionRow },
                        react_1.default.createElement(SubscriptionItem, { subId: "1-MONTH-SUB3", displayName: "Tier III", duration: "1mo", price: "$20", onSelect: (id, name, duration) => this._onSelect(id, name, duration) }),
                        react_1.default.createElement(SubscriptionItem, { subId: "3-MONTH-SUB3", displayName: "Tier III", duration: "3mo", price: "$48", onSelect: (id, name, duration) => this._onSelect(id, name, duration) })),
                    react_1.default.createElement(react_native_1.View, { style: styles_1.default.SubscriptionRow },
                        react_1.default.createElement(SubscriptionItem, { subId: "1-MONTH-SUB2", displayName: "Tier II", duration: "1mo", price: "$10", onSelect: (id, name, duration) => this._onSelect(id, name, duration) }),
                        react_1.default.createElement(SubscriptionItem, { subId: "3-MONTH-SUB2", displayName: "Tier II", duration: "3mo", price: "$24", onSelect: (id, name, duration) => this._onSelect(id, name, duration) })),
                    react_1.default.createElement(react_native_1.View, { style: styles_1.default.SubscriptionRow },
                        react_1.default.createElement(SubscriptionItem, { subId: "1-MONTH-SUB", displayName: "Tier I", duration: "1mo", price: "$5", onSelect: (id, name, duration) => this._onSelect(id, name, duration) }),
                        react_1.default.createElement(SubscriptionItem, { subId: "3-MONTH-SUB", displayName: "Tier I", duration: "3mo", price: "$12", onSelect: (id, name, duration) => this._onSelect(id, name, duration) })))));
        }
        else {
            let subscribedItem;
            if (features.indexOf('flair8') != -1) {
                subscribedItem =
                    react_1.default.createElement(SubscriptionItem, { displayName: "Tier IV", duration: "Subscribed", alreadySubscribed: true });
            }
            else if (features.indexOf('flair3') != -1) {
                subscribedItem =
                    react_1.default.createElement(SubscriptionItem, { displayName: "Tier III", duration: "Subscribed", alreadySubscribed: true });
            }
            else if (features.indexOf('flair1') != -1) {
                subscribedItem =
                    react_1.default.createElement(SubscriptionItem, { displayName: "Tier II", duration: "Subscribed", alreadySubscribed: true });
            }
            else if (features.indexOf('flair13') != -1) {
                subscribedItem =
                    react_1.default.createElement(SubscriptionItem, { displayName: "Tier I", duration: "Subscribed", alreadySubscribed: true });
            }
            else if (features.indexOf('flair9') != -1) {
                subscribedItem =
                    react_1.default.createElement(SubscriptionItem, { displayName: "Twitch", duration: "Subscribed", alreadySubscribed: true });
            }
            return (react_1.default.createElement(react_navigation_1.SafeAreaView, { style: styles_1.default.View },
                react_1.default.createElement(react_native_1.ScrollView, { style: styles_1.default.SubscriptionView },
                    react_1.default.createElement(react_native_1.Text, { style: styles_1.default.ChooseTitle }, "Subscribed"),
                    react_1.default.createElement(react_native_1.Text, { style: styles_1.default.ChooseSubtitle }, "Visit site in browser to manage subscription."),
                    react_1.default.createElement(react_native_1.View, { style: styles_1.default.SubscribedTile }, subscribedItem))));
        }
    }
}
SubscriptionView.navigationOptions = {
    title: 'Subscription',
    drawerLockMode: 'locked-closed'
};
class SubscriptionMessageView extends react_1.Component {
    constructor(props) {
        super(props);
        this.formItems = [];
        this.state = {
            message: "",
            gift: "",
            giftBool: false,
            renew: false
        };
        this.subDisplayName = this.props.navigation.state.params.subName;
        this.subDuration = this.props.navigation.state.params.subDuration;
    }
    _onChange(name, value) {
        let updatedState = {};
        updatedState[name] = value;
        if (name === 'giftBool' && value === false && this.state.gift !== "") {
            updatedState['gift'] = "";
        }
        else if (name === 'giftBool' && value === true) {
            react_native_1.Alert.alert('Warning', `If the giftee has a subscription by the time this payment\
 is completed the subscription will be marked as failed, but your payment will\
 still go through.`);
        }
        this.setState(updatedState);
    }
    _showUserAgreement() {
        this.props.navigation.navigate('UserAgreement');
    }
    save() {
        let params = {
            subId: this.props.navigation.state.params.subId,
            message: this.state.message,
            renew: this.state.renew
        };
        if (this.state.giftBool) {
            params['gift'] = this.state.gift;
        }
        else {
            params['gift'] = "";
        }
        if (this.state.giftBool && this.state.gift === "") {
            react_native_1.Alert.alert('Missing field data.', 'No gift recipient specified.');
        }
        else {
            this.props.navigation.navigate('SubscriptionWebView', params);
        }
    }
    render() {
        this.formItems = [
            {
                placeholder: "Subscription message",
                name: "message",
                type: "text",
                multiline: true,
                spacer: true,
                maxLength: 250
            },
            {
                tag: 'Renew',
                name: 'renew',
                type: 'switch',
                spacer: true
            },
            {
                tag: 'Gift',
                name: 'giftBool',
                type: 'switch'
            }
        ];
        if (this.state.giftBool) {
            this.formItems.push({
                placeholder: "Username",
                name: "gift",
                type: "text"
            });
        }
        return (react_1.default.createElement(react_navigation_1.SafeAreaView, { style: styles_1.default.View },
            react_1.default.createElement(react_native_1.ScrollView, { style: [styles_1.default.View, { paddingTop: 25 }] },
                react_1.default.createElement(react_native_1.View, { style: { marginLeft: 15 } },
                    react_1.default.createElement(react_native_1.Text, { style: styles_1.default.SubscriptionTitle }, this.subDisplayName),
                    react_1.default.createElement(react_native_1.Text, { style: styles_1.default.SubscriptionSubtitle }, this.subDuration)),
                react_1.default.createElement(FormView_1.ProfileForm, { formItems: this.formItems, formState: this.state, onChange: (name, value) => this._onChange(name, value) }),
                react_1.default.createElement(react_native_1.Text, { style: styles_1.default.SubscriptionTerms },
                    "By clicking the \"Pay\" button, you are confirming that this purchase is what you wanted and that you have read the ",
                    react_1.default.createElement(react_native_1.Text, { onPress: () => this._showUserAgreement(), style: styles_1.default.Link }, "user agreement.")))));
    }
}
SubscriptionMessageView.navigationOptions = ({ navigation }) => {
    const params = navigation.state.params;
    return {
        headerRight: react_1.default.createElement(react_native_1.View, { style: styles_1.default.navbarRight },
            react_1.default.createElement(react_native_1.Button, { title: 'Pay', onPress: params.saveHandler ? params.saveHandler : () => null })),
        drawerLockMode: 'locked-closed'
    };
};
class SubscriptionWebView extends react_1.Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const formData = {
            subscription: navigation.state.params.subId,
            gift: navigation.state.params.gift,
            'sub-message': navigation.state.params.message,
            'renew': navigation.state.params.renew
        };
        /* fetch() + pass html string into webview doesn't work, as
           paypal doesn't like the change in useragent.  construct
           formdata manually.
        */
        this.body = Object.keys(formData).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(formData[key]);
        }).join('&').replace(/%20/g, '+');
    }
    render() {
        return (react_1.default.createElement(react_native_1.WebView, { source: {
                uri: `https://www.destiny.gg/subscription/create`,
                method: 'POST',
                body: this.body
            }, startInLoadingState: true, style: { backgroundColor: '#000' }, onNavigationStateChange: e => {
                if (e.url && e.loading == false && e.url.indexOf('destiny.gg') != -1) {
                    if (e.url.indexOf('error') != -1) {
                        react_native_1.Alert.alert('Error', 'Could not complete subscription. \
                                                  Try again later.');
                        this.props.navigation.goBack();
                    }
                    else if (e.url.indexOf('complete') != -1) {
                        react_native_1.Alert.alert('Success', 'Subscription complete.');
                        this.props.navigation.dispatch(react_navigation_1.NavigationActions.reset({
                            index: 0,
                            actions: [
                                react_navigation_1.NavigationActions.navigate({ routeName: 'ProfileView' }),
                            ]
                        }));
                    }
                }
            } }));
    }
}
SubscriptionWebView.navigationOptions = {
    drawerLockMode: 'locked-closed'
};
class SettingsView extends FormView_1.default {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, MobileChat.current.mobileSettings);
        console.log(this.state);
        this.formItems = [
            {
                tag: "Show chat timestamp",
                name: "chatTimestamp",
                type: "switch",
            },
            {
                tag: "Open media in modal",
                name: "mediaModal",
                type: "switch",
            },
            {
                tag: "Close emote drawer on select",
                name: "emoteDirLoseFocus",
                type: "switch",
            },
            {
                tag: "Control menu drawer with button",
                name: "menuDrawerButton",
                type: "switch"
            }
        ];
    }
    _onChange(name, value) {
        let updatedState = {};
        updatedState[name] = value;
        this.setState(updatedState);
        MobileChat.current.setMobileSetting(name, value);
    }
    render() {
        return (react_1.default.createElement(react_navigation_1.SafeAreaView, { style: styles_1.default.View },
            react_1.default.createElement(react_native_1.ScrollView, { style: styles_1.default.View },
                react_1.default.createElement(FormView_1.ProfileForm, { formItems: this.formItems, formState: this.state, onChange: (name, value) => this._onChange(name, value) }))));
    }
    componentWillUnmount() {
        MobileChat.current.saveMobileSettings();
    }
}
SettingsView.navigationOptions = ({ navigation }) => {
    return { title: "Settings" };
};
class ProfileView extends react_1.Component {
    constructor(props) {
        super(props);
        this.listItems = [
            { name: 'Account' },
        ];
        if (react_native_1.Platform.OS != 'ios') {
            this.listItems.push({ name: 'Subscription' });
        }
        this.listItems.push({ name: 'Settings' });
    }
    render() {
        const created = moment_1.default(MobileChat.current.me.createdDate);
        return (react_1.default.createElement(react_navigation_1.SafeAreaView, { style: styles_1.default.View },
            react_1.default.createElement(react_native_1.ScrollView, { contentContainerStyle: [styles_1.default.View] },
                react_1.default.createElement(react_native_1.View, { style: styles_1.default.ProfileHeader },
                    react_1.default.createElement(react_native_1.Text, { style: styles_1.default.ProfileName }, MobileChat.current.user.username),
                    react_1.default.createElement(react_native_1.Text, { style: styles_1.default.ProfileCreated }, 'Member since: ' + created.format('dddd, D MMMM YYYY'))),
                react_1.default.createElement(NavList_1.NavList, { listItems: this.listItems, onPress: (item) => {
                        this.props.navigation.navigate(item.name);
                    } }),
                react_1.default.createElement(ButtonList_1.ListButton, { name: 'About', first: true, last: true, onPress: () => this.props.navigation.navigate('About'), style: { marginTop: 50 } }))));
    }
}
ProfileView.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
        title: 'Profile',
        headerLeft: react_1.default.createElement(react_navigation_1.HeaderBackButton, { title: 'Back', onPress: () => params.backHandler(null) }),
        headerTintColor: "#ccc"
    };
};
const ProfileNav = react_navigation_1.StackNavigator({
    Profile: { screen: ProfileView },
    Account: { screen: AccountView },
    Subscription: { screen: SubscriptionView },
    SubscriptionMessageView: { screen: SubscriptionMessageView },
    SubscriptionWebView: { screen: SubscriptionWebView },
    UserAgreement: { screen: UserAgreement_1.UserAgreement },
    Settings: { screen: SettingsView },
    About: { screen: about_1.default }
}, {
    initialRouteName: 'Profile',
    navigationOptions: {
        headerStyle: styles_1.default.Navigation,
        headerTitleStyle: styles_1.default.NavigationHeaderTitle,
        headerTintColor: (react_native_1.Platform.OS === 'android') ? '#fff' : undefined
    },
    cardStyle: styles_1.default.View
});
exports.default = ProfileNav;
