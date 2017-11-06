import React, { Component } from 'react';
import moment from 'moment';
import { SafeAreaView, View, FlatList, Text, TouchableHighlight, TextInput, StyleSheet } from 'react-native';
import styles from './styles';

class UserMessage extends Component {
    constructor() {
        super();
        this.isSelf = (this.props.item.from === this.props.screenProps.chat.me.user);
    }
    render() {
        return (
            <View style={styles.UserMessage}>
                <Text style={[styles.UserMessageText, (this.isSelf) ? styles.OurMessage : styles.TheirMessage]}>
                    {item.message}
                </Text>
            </View>
        );
    }
}

class UserView extends Component {
    constructor(props) {
        super(props);
        this.user = this.props.navigation.state.params.user;
        this.state = { messages: [], extraData: false, nextIndex: 10};
        fetch(`https://www.destiny.gg/api/messages/usr/${this.user}/inbox`).then((messages) => {
            messages.json().then((json) => {
                this.setState({messages: json, extraData: !this.state.extraData});
            });
        });
    }

    _addOurMessage(text) {
        this.textInput.clear();
        this.setState({
            messages: [
                ...this.state.messages,
                {
                    message: text,
                    from: this.props.screenProps.chat.me.user,
                    to: this.user
                }
            ],
            nextIndex: this.state.nextIndex + 1
        });        
    }

    sendMessage(text) {
        fetch(`https://www.destiny.gg/profile/messages/send`, {
            message: text,
            'recipients[]': this.user 
        }).then((response) => {
            if (response.ok) {
                this._addOurMessage(text);
            } else {
                Alert.alert('Error', 'Unable to send message.  Try again later.');
            }
        });
    }
    
    render() {
        return (
            <SafeAreaView>
                <FlatList 
                    data={this.state.messages}
                    extraData={this.state.extraData}
                    keyExtractor={(item) => item.id}
                    renderItem={(item) => <UserMessage item={item} />}
                    getItemLayout={(data, index) => (
                        {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
                    )}
                    onEndReached={(info) => this.loadMoreItems()}
                    onEndReachedThreshold={500}
                    inverted={true}
                />
                <TextInput />
            </SafeAreaView>
        )
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
                            <Text style={styles.messagePreview}>{moment(this.props.item.timestamp).calendar()}</Text>
                            <Text style={styles.arrow}>></Text>
                        </View>
                    </View>
                    <Text numberOfLines={1} style={styles.messagePreview}>{this.props.item.message}</Text>
                </View>
            </TouchableHighlight>
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

export default class MessageView extends Component {
    constructor() {
        super();
        this.state = { inbox: [], extraData: false, nextIndex: 25};
        fetch("https://www.destiny.gg/api/messages/inbox").then((inbox) => {
            inbox.json().then((json) => {
                this.setState({inbox: json, extraData: !this.state.extraData});
            });
        });   
        this.itemHeight = 75 + StyleSheet.hairlineWidth;
    }

    loadMoreItems() {
        /*fetch(`https://www.destiny.gg/api/messages/inbox?s=${this.state.nextIndex}`).then((inbox) => {
            inbox.json().then((json) => {
                this.setState({
                    inbox: [...this.state.inbox, ...json], 
                    extraData: !this.state.extraData,
                    nextIndex: this.state.nextIndex + 25
                });
            });
        });*/
    }

    openItem(item) {
        this.props.navigation.dispatch(NavigationActions.navigate('UserView', {user: item.user}));
    }

    render() {
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
                    onEndReachedThreshold={500}
                />
            </SafeAreaView>
        )
    }
}