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
const styles_1 = __importStar(require("styles"));
const TextInputListItem_1 = __importDefault(require("../components/forms/TextInputListItem"));
const { MobileChat } = require("../chat/chat");
const MOMENT_FORMAT = {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'DD/MM/YYYY'
};
class UserMessage extends react_1.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (react_1.default.createElement(react_native_1.View, { style: {
                flexDirection: 'row',
                marginBottom: 10,
                marginLeft: 15,
                marginRight: 15,
                alignSelf: (this.props.isSelf) ? "flex-end" : undefined
            } },
            react_1.default.createElement(react_native_1.View, { style: {
                    maxWidth: '80%',
                    borderRadius: 16,
                    flexDirection: 'row',
                    paddingTop: 8,
                    paddingBottom: 8,
                    paddingLeft: 12,
                    paddingRight: 12,
                    backgroundColor: (this.props.isSelf) ? "#222" : '#181818'
                } },
                react_1.default.createElement(react_native_1.Text, { style: {
                        color: "#fff",
                    } }, this.props.item.message))));
    }
}
class UserView extends react_1.Component {
    constructor(props) {
        super(props);
        this.user = this.props.navigation.state.params.user;
        this.state = { messages: [], extraData: false, nextIndex: 10, allMessagesReceived: false, input: "" };
        fetch(`https://www.destiny.gg/api/messages/usr/${this.user}/inbox`).then((messages) => {
            messages.json().then((json) => {
                this.setState({ messages: json, extraData: !this.state.extraData });
            });
        });
    }
    _addOurMessage(text) {
        this.setState({
            messages: [
                {
                    message: text,
                    from: MobileChat.current.me.username,
                    to: this.user,
                    id: Date.now()
                },
                ...this.state.messages
            ],
            nextIndex: this.state.nextIndex + 1,
            input: ""
        });
    }
    addTheirMessage(text) {
        this.setState({
            messages: [
                {
                    message: text,
                    from: this.user,
                    to: MobileChat.current.me.username,
                    id: Date.now()
                },
                ...this.state.messages
            ],
            nextIndex: this.state.nextIndex + 1,
            input: ""
        });
    }
    loadMoreItems() {
        if (this.state.allMessagesReceived === false) {
            this.setState({
                nextIndex: this.state.nextIndex + 10
            });
            fetch(`https://www.destiny.gg/api/messages/usr/${this.user}/inbox?s=${this.state.nextIndex}`).then((inbox) => {
                inbox.json().then((json) => {
                    if (json.length < 1) {
                        this.setState({ allMessagesReceived: true });
                    }
                    else {
                        this.setState({
                            messages: [...this.state.messages, ...json],
                            extraData: !this.state.extraData,
                        });
                    }
                });
            });
        }
    }
    sendMessage() {
        const text = this.state.input;
        const formData = new FormData();
        formData.append('message', text);
        formData.append('recipients[]', this.user);
        fetch(`https://www.destiny.gg/profile/messages/send`, {
            credentials: 'include',
            method: 'POST',
            body: formData
        }).then((response) => {
            if (response.ok) {
                this._addOurMessage(text);
            }
            else {
                response.json().then((json) => {
                    react_native_1.Alert.alert('Error', json.message);
                });
            }
        });
    }
    render() {
        return (react_1.default.createElement(react_navigation_1.SafeAreaView, { style: styles_1.default.View },
            react_1.default.createElement(react_native_1.KeyboardAvoidingView, { behavior: 'padding', style: styles_1.default.View, keyboardVerticalOffset: (react_native_1.Platform.OS === 'android') ? -400 : 65 },
                react_1.default.createElement(react_native_1.FlatList, { data: this.state.messages, extraData: this.state.extraData, keyExtractor: (item) => String(item.id), renderItem: ({ item }) => react_1.default.createElement(UserMessage, { item: item, isSelf: item.from === MobileChat.current.me.username }), onEndReached: (info) => this.loadMoreItems(), onEndReachedThreshold: .1, inverted: true }),
                react_1.default.createElement(react_native_1.TextInput, { style: {
                        borderRadius: 15,
                        paddingTop: 8,
                        paddingBottom: 8,
                        paddingLeft: 12,
                        paddingRight: 12,
                        marginLeft: 5,
                        marginRight: 5,
                        marginBottom: 5,
                        fontSize: 12,
                        color: "#ccc",
                        borderColor: '#222',
                        borderWidth: (react_native_1.Platform.OS === 'ios') ? react_native_1.StyleSheet.hairlineWidth : 0,
                    }, placeholder: 'Direct message', placeholderTextColor: "#888", onChangeText: (text) => this.setState({ input: text }), onSubmitEditing: () => this.sendMessage(), underlineColorAndroid: '#222', value: this.state.input, keyboardAppearance: 'dark', autoCorrect: true }))));
    }
    componentDidMount() {
        MobileChat.current.mobilePmWindow = this;
    }
    componentWillUnmount() {
        MobileChat.current.mobilePmWindow = null;
    }
}
UserView.navigationOptions = ({ navigation }) => {
    return ({
        title: navigation.state.params.user,
        drawerLockMode: 'locked-closed'
    });
};
class MessageListItem extends react_1.Component {
    render() {
        return (react_1.default.createElement(react_native_1.TouchableHighlight, { style: {
                height: 75,
                marginLeft: 15,
                marginRight: 15,
                justifyContent: 'center'
            }, onPress: () => this.props.onPress(this.props.item) },
            react_1.default.createElement(react_native_1.View, null,
                react_1.default.createElement(react_native_1.View, { style: { flexDirection: 'row', justifyContent: 'space-between' } },
                    react_1.default.createElement(react_native_1.Text, { style: {
                            color: '#fff',
                            fontSize: styles_1.h3,
                            fontWeight: '500'
                        } }, this.props.item.user),
                    react_1.default.createElement(react_native_1.View, null,
                        react_1.default.createElement(react_native_1.Text, { style: {
                                color: '#888'
                            } }, moment_1.default(this.props.item.timestamp).calendar(this.props.item.timestamp, MOMENT_FORMAT)))),
                react_1.default.createElement(react_native_1.Text, { numberOfLines: 1, style: {
                        color: '#888'
                    } }, this.props.item.message))));
    }
}
class ComposeView extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = { recipients: "", body: "" };
    }
    send() {
        const recipients = this.state.recipients.toLowerCase().split(" ");
        const formData = new FormData();
        formData.append('message', this.state.body);
        for (let i = 0; i < recipients.length; i++) {
            formData.append('recipients[]', recipients[i]);
        }
        fetch(`https://www.destiny.gg/profile/messages/send`, {
            credentials: 'include',
            method: 'POST',
            body: formData
        }).then((response) => {
            response.json().then((json) => {
                if (json.success) {
                    this.props.navigation.state.params.messageView.shouldRefresh = true;
                    this.props.navigation.goBack();
                }
                else {
                    react_native_1.Alert.alert('Error', json.message);
                }
            });
        });
    }
    componentDidMount() {
        this.props.navigation.setParams({ sendHandler: () => this.send() });
    }
    render() {
        return (react_1.default.createElement(react_navigation_1.SafeAreaView, { style: styles_1.default.View },
            react_1.default.createElement(react_native_1.ScrollView, { style: { paddingTop: 25 } },
                react_1.default.createElement(TextInputListItem_1.default, { name: 'recipients', value: this.state.recipients, placeholder: 'Recipients (space separated)', onChange: (name, value) => this.setState({ recipients: value }), key: 'recipient', first: true }),
                react_1.default.createElement(TextInputListItem_1.default, { name: 'body', value: this.state.body, placeholder: 'Write your message!', onChange: (name, value) => this.setState({ body: value }), key: 'body', last: true, multiline: true }))));
    }
}
ComposeView.navigationOptions = ({ navigation }) => {
    const params = navigation.state.params;
    return ({
        title: 'Compose',
        drawerLockMode: 'locked-closed',
        headerRight: react_1.default.createElement(react_native_1.View, { style: styles_1.default.navbarRight },
            react_1.default.createElement(react_native_1.Button, { title: 'Send', onPress: params.sendHandler ? params.sendHandler : () => null }))
    });
};
class ComposeButton extends react_1.Component {
    render() {
        return (react_1.default.createElement(react_native_1.TouchableOpacity, { onPress: this.props.onPress, style: { marginRight: 15 } },
            react_1.default.createElement(react_native_1.Text, { style: { fontFamily: 'ionicons', color: '#037aff', fontSize: 28 } }, "\uF417")));
    }
}
class Separator extends react_1.Component {
    render() {
        return (react_1.default.createElement(react_native_1.View, { style: {
                marginLeft: 15,
                marginRight: 15,
                height: react_native_1.StyleSheet.hairlineWidth,
                backgroundColor: '#222'
            } }));
    }
}
class MessageView extends react_1.Component {
    constructor(props) {
        super(props);
        this._handleAppStateChange = (nextState) => {
            if (nextState === 'background') {
                react_native_1.AsyncStorage.setItem('InitRoute', 'Messages');
            }
        };
        this.state = { inbox: [], extraData: false, nextIndex: 25, loading: false };
        fetch("https://www.destiny.gg/api/messages/inbox").then((inbox) => {
            inbox.json().then((json) => {
                this.setState({ inbox: json, extraData: !this.state.extraData });
            });
        });
        this.itemHeight = 75 + react_native_1.StyleSheet.hairlineWidth;
        this.shouldRefresh = false;
    }
    compose() {
        this.props.navigation.navigate('ComposeView', { messageView: this });
    }
    loadMoreItems() {
        fetch(`https://www.destiny.gg/api/messages/inbox?s=${this.state.nextIndex}`).then((inbox) => {
            inbox.json().then((json) => {
                this.setState({
                    inbox: [...this.state.inbox, ...json],
                    extraData: !this.state.extraData,
                    nextIndex: this.state.nextIndex + 25
                });
            });
        });
    }
    refreshInbox() {
        this.setState({ loading: true });
        fetch(`https://www.destiny.gg/api/messages/inbox`).then((inbox) => {
            inbox.json().then((json) => {
                this.setState({
                    inbox: json,
                    extraData: !this.state.extraData,
                    nextIndex: 25,
                    loading: false
                });
            });
        });
    }
    openItem(item) {
        this.props.navigation.navigate('UserView', { user: item.user, inbox: this });
    }
    componentDidMount() {
        this.props.navigation.setParams({ composeHandler: () => this.compose() });
        react_native_1.AppState.addEventListener('change', this._handleAppStateChange);
    }
    componentWillUnmount() {
        react_native_1.AppState.removeEventListener('change', this._handleAppStateChange);
    }
    render() {
        if (this.shouldRefresh) {
            this.shouldRefresh = false;
            this.refreshInbox();
        }
        return (react_1.default.createElement(react_navigation_1.SafeAreaView, { style: styles_1.default.View },
            react_1.default.createElement(react_native_1.FlatList, { data: this.state.inbox, extraData: this.state.extraData, keyExtractor: (item) => item.userid, renderItem: ({ item, index, separators }) => react_1.default.createElement(MessageListItem, { item: item, onPress: (item) => this.openItem(item) }), ItemSeparatorComponent: Separator, getItemLayout: (data, index) => ({ length: this.itemHeight, offset: this.itemHeight * index, index }), onEndReached: (info) => this.loadMoreItems(), onEndReachedThreshold: 0.3, onRefresh: () => this.refreshInbox(), refreshing: this.state.loading })));
    }
}
MessageView.navigationOptions = ({ navigation }) => {
    const params = navigation.state.params;
    return ({
        title: 'Messages',
        headerLeft: react_1.default.createElement(react_navigation_1.HeaderBackButton, { title: 'Back', onPress: () => params.backHandler(null) }),
        headerRight: react_1.default.createElement(ComposeButton, { onPress: params.composeHandler ? params.composeHandler : () => null }),
        headerTintColor: "#ccc"
    });
};
const MessageNav = react_navigation_1.StackNavigator({
    MessageView: { screen: MessageView },
    UserView: { screen: UserView },
    ComposeView: { screen: ComposeView }
}, {
    initialRouteName: 'MessageView',
    navigationOptions: {
        headerStyle: styles_1.default.Navigation,
        headerTitleStyle: styles_1.default.NavigationHeaderTitle,
        headerTintColor: (react_native_1.Platform.OS === 'android') ? '#fff' : undefined
    },
    cardStyle: styles_1.default.View
});
exports.default = MessageNav;
