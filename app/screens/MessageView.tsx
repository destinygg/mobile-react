import moment from 'moment';
import React, { Component } from 'react';
import {
    Alert,
    AppState,
    AsyncStorage,
    Button,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    HeaderBackButton,
    NavigationScreenProp,
    NavigationScreenProps,
    SafeAreaView,
    createStackNavigator,
} from 'react-navigation';
import TextInputListItem from 'components/forms/TextInputListItem';
import { Palette, h3 } from 'assets/constants';

const { MobileChat } = require("../chat/chat"); 

const MOMENT_FORMAT = {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'DD/MM/YYYY'
};

interface UserMessageItem {
    from: string;
    to: string;
    id: number;
    message: string;
}

interface UserMessageProps {
    item: UserMessageItem
    isSelf?: boolean;
}

class UserMessage extends Component<UserMessageProps> {
    constructor(props: UserMessageProps) {
        super(props);
    }
    render() {
        return (
            <View style={{
                flexDirection: 'row',
                marginBottom: 10,
                marginLeft: 15,
                marginRight: 15,
                alignSelf: (this.props.isSelf) ? "flex-end" : undefined
            }}>
                <View style={{
                    maxWidth: '80%',
                    borderRadius: 16,
                    flexDirection: 'row',
                    paddingTop: 8,
                    paddingBottom: 8,
                    paddingLeft: 12,
                    paddingRight: 12,
                    backgroundColor: (this.props.isSelf) ? Palette.border : Palette.inner
                }}>
                    <Text style={{
                        color: Palette.title,
                    }}>
                        {this.props.item.message}
                    </Text>
                </View>
            </View>
        );
    }
}

interface UserViewProps {
    navigation: NavigationScreenProp<{params: {user: string}}>
}

interface UserViewState {
    messages: UserMessageItem[];
    extraData: boolean;
    nextIndex: number;
    allMessagesReceived: boolean;
    input: string;
}

class UserView extends Component<UserViewProps, UserViewState> {
    user: string;
    static navigationOptions = ({ navigation }: {navigation: NavigationScreenProp<{params: {user: string}}>}) => {
        return ({
            title: navigation.state.params.user,
            drawerLockMode: 'locked-closed'
        });
    }
    constructor(props: UserViewProps) {
        super(props);
        this.user = this.props.navigation.state.params.user;
        this.state = { messages: [], extraData: false, nextIndex: 10, allMessagesReceived: false, input: "" };
        fetch(`https://www.destiny.gg/api/messages/usr/${this.user}/inbox`).then((messages) => {
            messages.json().then((json) => {
                this.setState({ messages: json, extraData: !this.state.extraData });
            });
        });
    }

    _addOurMessage(text: string) {
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

    addTheirMessage(text: string) {
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
                    } else {
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
            } else {
                response.json().then((json) => {
                    Alert.alert('Error', json.message);
                })
            }
        });
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <KeyboardAvoidingView
                    behavior='padding'
                    style={{flex: 1}}
                    keyboardVerticalOffset={(Platform.OS === 'android') ? -400 : 65}
                >
                    <FlatList
                        data={this.state.messages}
                        extraData={this.state.extraData}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => <UserMessage item={item} isSelf={item.from === MobileChat.current.me.username} />}
                        onEndReached={(info) => this.loadMoreItems()}
                        onEndReachedThreshold={.1}
                        inverted={true}
                    />
                    <TextInput
                        style={{
                            borderRadius: 15,
                            paddingTop: 8,
                            paddingBottom: 8,
                            paddingLeft: 12,
                            paddingRight: 12,
                            marginLeft: 5,
                            marginRight: 5,
                            marginBottom: 5,
                            fontSize: 12,
                            color: Palette.messageText,
                            borderColor: Palette.border,
                            borderWidth: (Platform.OS === 'ios') ? StyleSheet.hairlineWidth : 0,
                        }}
                        placeholder={'Direct message'}
                        placeholderTextColor={Palette.text}
                        onChangeText={(text) => this.setState({ input: text })}
                        onSubmitEditing={() => this.sendMessage()}
                        underlineColorAndroid={Palette.border}
                        value={this.state.input}
                        keyboardAppearance='dark'
                        autoCorrect={true}
                    />
                </KeyboardAvoidingView>
            </SafeAreaView>
        )
    }

    componentDidMount() {
        MobileChat.current.mobilePmWindow = this;
    }

    componentWillUnmount() {
        MobileChat.current.mobilePmWindow = null;
    }
}

interface MessageListItemProps {
    onPress: {(msg: any): any};
    item: any;
}

class MessageListItem extends Component<MessageListItemProps> {
    render() {
        return (
            <TouchableHighlight
                style={{
                    height: 75,
                    marginLeft: 15,
                    marginRight: 15,
                    justifyContent: 'center'
                }}
                onPress={() => this.props.onPress(this.props.item)}
            >
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{
                            color: Palette.title,
                            fontSize: h3,
                            fontWeight: '500'
                        }}>
                            {this.props.item.user}
                        </Text>
                        <View>
                            <Text style={{
                                color: Palette.text
                            }}>
                                {moment(this.props.item.timestamp).calendar(this.props.item.timestamp, MOMENT_FORMAT)}
                            </Text>
                        </View>
                    </View>
                    <Text 
                        numberOfLines={1} 
                        style={{
                            color: Palette.text
                        }}
                    >
                        {this.props.item.message}
                    </Text>
                </View>
            </TouchableHighlight>
        )
    }
}

class ComposeView extends Component<NavigationScreenProps, {recipients: string, body: string}> {
    static navigationOptions = ({ navigation }: {navigation: NavigationScreenProp<{params: {sendHandler: {(): any}}}>}) => {
        const params = navigation.state.params;
        return ({
            title: 'Compose',
            drawerLockMode: 'locked-closed',
            headerRight: <View style={{
                            marginRight: (Platform.OS == 'ios') ? 5 : 15
                        }}>
                            <Button title='Send' onPress={params.sendHandler ? params.sendHandler : () => null} />
                        </View>
        });
    }

    constructor(props: NavigationScreenProps) {
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
                    this.props.navigation.state.params!.messageView.shouldRefresh = true;
                    this.props.navigation.goBack();
                } else {
                    Alert.alert('Error', json.message);
                }
            });
        });
    }

    componentDidMount() {
        this.props.navigation.setParams({ sendHandler: () => this.send() });
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <ScrollView style={{ paddingTop: 25 }}>
                    <TextInputListItem
                        name='recipients'
                        value={this.state.recipients}
                        placeholder='Recipients (space separated)'
                        onChange={(name, value) => this.setState({ recipients: value })}
                        key='recipient'
                        first={true}
                    />
                    <TextInputListItem
                        name='body'
                        value={this.state.body}
                        placeholder='Write your message!'
                        onChange={(name, value) => this.setState({ body: value })}
                        key='body'
                        last={true}
                        multiline={true}
                    />
                </ScrollView>
            </SafeAreaView>
        );
    }
}

class ComposeButton extends Component<{onPress: {(): any}}> {
    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                style={{ marginRight: 15 }}
            >
                <Text style={{ fontFamily: 'ionicons', color: '#037aff', fontSize: 28 }}>&#xf417;</Text>
            </TouchableOpacity>
        )
    }
}

class Separator extends Component {
    render() {
        return (
            <View style={{
                marginLeft: 15,
                marginRight: 15,
                height: StyleSheet.hairlineWidth,
                backgroundColor: Palette.border
            }} />
        )
    }
}

class MessageView extends Component<NavigationScreenProps, {
    inbox: any[], 
    extraData: boolean, 
    nextIndex: number, 
    loading: boolean
}> {
    itemHeight: number;
    shouldRefresh: boolean;
    static navigationOptions = ({ navigation }: {navigation: NavigationScreenProp<{params: {backHandler: any, composeHandler: any}}>}) => {
        const params = navigation.state.params;
        return ({
            title: 'Messages',
            headerLeft: <HeaderBackButton tintColor={Palette.title} title='Back' onPress={() => params.backHandler(null)} />,
            headerRight: <ComposeButton onPress={params.composeHandler ? params.composeHandler : () => null} />,
            headerTintColor: Palette.messageText
        });
    }
    constructor(props: NavigationScreenProps) {
        super(props);
        this.state = { inbox: [], extraData: false, nextIndex: 25, loading: false };
        fetch("https://www.destiny.gg/api/messages/inbox").then((inbox) => {
            inbox.json().then((json) => {
                this.setState({ inbox: json, extraData: !this.state.extraData });
            });
        });
        this.itemHeight = 75 + StyleSheet.hairlineWidth;
        this.shouldRefresh = false;
    }

    _handleAppStateChange = (nextState: string) => {
        if (nextState === 'background') {
            AsyncStorage.setItem('InitRoute', 'Messages');
        }
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
        this.setState({ loading: true })
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

    openItem(item: any) {
        this.props.navigation.navigate('UserView', { user: item.user, inbox: this });
    }

    componentDidMount() {
        this.props.navigation.setParams({ composeHandler: () => this.compose() });
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    render() {
        if (this.shouldRefresh) {
            this.shouldRefresh = false;
            this.refreshInbox();
        }
        return (
            <SafeAreaView style={{flex: 1}}>
                <FlatList
                    data={this.state.inbox}
                    extraData={this.state.extraData}
                    keyExtractor={(item) => item.userid}
                    renderItem={({ item, index, separators }) => <MessageListItem item={item} onPress={(item) => this.openItem(item)} />}
                    ItemSeparatorComponent={Separator}
                    getItemLayout={(data, index) => (
                        { length: this.itemHeight, offset: this.itemHeight * index, index }
                    )}
                    onEndReached={(info) => this.loadMoreItems()}
                    onEndReachedThreshold={0.3}
                    onRefresh={() => this.refreshInbox()}
                    refreshing={this.state.loading}
                />
            </SafeAreaView>
        )
    }
}

const MessageNav = createStackNavigator({
    MessageView: { screen: MessageView },
    UserView: { screen: UserView },
    ComposeView: { screen: ComposeView }
}, {
        initialRouteName: 'MessageView',
        navigationOptions: {
            headerStyle: {
                backgroundColor: Palette.inner,
                borderColor: Palette.navBorder,
                borderStyle: "solid"
            },
            headerTitleStyle: {color: Palette.text},
            headerTintColor: (Platform.OS === 'android') ? Palette.text : undefined
        },
        cardStyle: {flex: 1}
    });

export default MessageNav;