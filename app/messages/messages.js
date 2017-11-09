import React, { Component } from 'react';
import moment from 'moment';
import { SafeAreaView, View, FlatList, Text, TouchableHighlight, Button, ScrollView, KeyboardAvoidingView, ActivityIndicator, TextInput, StyleSheet, Alert, Platform, TouchableOpacity } from 'react-native';
import { TextInputListItem } from '../components';
import { StackNavigator, NavigationActions } from 'react-navigation';
import styles from './styles';

const MOMENT_FORMAT = {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'DD/MM/YYYY'
};

class UserMessage extends Component {
    constructor(props) {
        super(props);
        this.isSelf = (this.props.item.from === this.props.screenProps.chat.me.username);
    }
    render() {
        return (
            <View style={[styles.UserMessage, (this.isSelf) ? styles.OurMessage : null]}>
                <View style={[styles.UserMessageInner, (this.isSelf) ? styles.OurMessageInner : null]}>
                    <Text style={styles.UserMessageText}>
                        {this.props.item.message}
                    </Text>
                </View>
            </View>
        );
    }
}

class UserView extends Component {
    static navigationOptions = ({ navigation }) => {
        return({
            title: navigation.state.params.user,
            drawerLockMode: 'locked-closed'
        });
    }
    constructor(props) {
        super(props);
        this.user = this.props.navigation.state.params.user;
        this.state = { messages: [], extraData: false, nextIndex: 10, allMessagesReceived: false, input: ""};
        fetch(`https://www.destiny.gg/api/messages/usr/${this.user}/inbox`).then((messages) => {
            messages.json().then((json) => {
                this.setState({messages: json, extraData: !this.state.extraData});
            });
        });
    }

    _addOurMessage(text) {
        this.setState({
            messages: [
                {
                    message: text,
                    from: this.props.screenProps.chat.me.username,
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
                    to: this.props.screenProps.chat.me.username,
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
                        this.setState({allMessagesReceived: true});
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
            <SafeAreaView style={styles.View}>
                <KeyboardAvoidingView
                    behavior='padding'
                    style={styles.View}
                    keyboardVerticalOffset={(Platform.OS === 'android') ? -400 : 65}
                >
                    <FlatList 
                        data={this.state.messages}
                        extraData={this.state.extraData}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <UserMessage item={item} screenProps={this.props.screenProps} />}
                        onEndReached={(info) => this.loadMoreItems()}
                        onEndReachedThreshold={.1}
                        inverted={true}
                    />
                    <TextInput
                        style={styles.TextInput}
                        placeholder={'Direct message'}
                        placeholderTextColor="#888"
                        onChangeText={(text) => this.setState({input: text})}
                        onSubmitEditing={() => this.sendMessage()}
                        underlineColorAndroid='#222'
                        value={this.state.input}
                        keyboardAppearance='dark'
                    />
                </KeyboardAvoidingView>
            </SafeAreaView>
        )
    }

    componentDidMount() {
        this.props.screenProps.chat.mobilePmWindow = this;
    }

    componentWillUnmount() {
        this.props.screenProps.chat.mobilePmWindow = null;
    }
}

class MessageListItem extends Component {
    render() {
        return (
            <TouchableHighlight
                style={styles.messageItem}
                onPress={() => this.props.onPress(this.props.item)}
            >
                <View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={styles.username}>{this.props.item.user}</Text>
                        <View>
                            <Text style={styles.messagePreview}>{moment(this.props.item.timestamp).calendar(null, MOMENT_FORMAT)}</Text>
                        </View>
                    </View>
                    <Text numberOfLines={1} style={styles.messagePreview}>{this.props.item.message}</Text>
                </View>
            </TouchableHighlight>
        )
    }
}

class ComposeView extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return ({
            title: 'Compose',
            drawerLockMode: 'locked-closed',
            headerRight: <Button title='Send' onPress={params.sendHandler ? params.sendHandler : () => null} />
        });
    }

    constructor(props) {
        super(props);
        this.state = {recipients: "", body: ""};
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
            <SafeAreaView style={styles.View}>
                <ScrollView style={{paddingTop: 25}}>
                    <TextInputListItem
                        name='recipients'
                        placeholder='Recipients (space separated)'
                        onChange={(name, value) => this.setState({recipients: value})} 
                        key='recipient'
                        first={true}
                    />
                    <TextInputListItem
                        name='body'
                        placeholder='Write your message!'
                        onChange={(name, value) => this.setState({body: value})}
                        key='body'
                        last={true}
                        multiline={true}
                    />
                </ScrollView>
            </SafeAreaView>
        );
    }
}

class ComposeButton extends Component {
    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                underlayColor={'#fff'}
                style={{marginRight: 15}}
            >
                <Text style={{ fontFamily: 'ionicons', color: '#037aff', fontSize: 28 }}>&#xf417;</Text>
            </TouchableOpacity>
        )
    }
}

class Separator extends Component {
    render() {
        return (
            <View style={styles.separator} />
        )
    }
}

class MessageView extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {}, routeName } = navigation.state;
        return ({
            title: 'Messages',
            headerRight: <ComposeButton onPress={params.composeHandler ? params.composeHandler : () => null} />
        });
    }
    constructor(props) {
        super(props);
        this.state = { inbox: [], extraData: false, nextIndex: 25, loading: false};
        fetch("https://www.destiny.gg/api/messages/inbox").then((inbox) => {
            inbox.json().then((json) => {
                this.setState({inbox: json, extraData: !this.state.extraData});
            });
        });   
        this.itemHeight = 75 + StyleSheet.hairlineWidth;
        this.shouldRefresh = false;
    }

    compose() {
        this.props.navigation.navigate('ComposeView', {messageView: this});
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
        this.setState({loading: true})
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
        this.props.navigation.navigate('UserView', {user: item.user, inbox: this});
    }

    componentDidMount() {
        this.props.navigation.setParams({ composeHandler: () => this.compose() });
    }

    render() {
        if (this.shouldRefresh) {
            this.shouldRefresh = false;
            this.refreshInbox();
        }        
        return (
            <SafeAreaView style={styles.View}>
                <FlatList 
                    data={this.state.inbox}
                    extraData={this.state.extraData}
                    keyExtractor={(item) => item.userid}
                    renderItem={({item, index, separators}) => <MessageListItem item={item} onPress={(item) => this.openItem(item)} />}
                    ItemSeparatorComponent={Separator}
                    getItemLayout={(data, index) => (
                        {length: this.itemHeight, offset: this.itemHeight * index, index}
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

const MessageNav = StackNavigator({
    MessageView: { screen: MessageView },
    UserView: { screen: UserView },
    ComposeView: { screen: ComposeView }
}, {
    initialRouteName: 'MessageView',
    navigationOptions: {
        headerStyle: styles.Navigation,
        headerTitleStyle: styles.NavigationHeaderTitle,
        headerTintColor: (Platform.OS === 'android') ? '#fff' : undefined
    },
    cardStyle: styles.View
});

export default MessageNav;