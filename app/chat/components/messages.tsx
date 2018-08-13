import React, { Component, PureComponent } from 'react';
import { Image, Text, TextStyle, ViewStyle } from 'react-native';
import styles from "./styles";
import { MobileEmotes } from '../emotes';
import RNFS from "react-native-fs";
import { MobileIcons } from '../icons';

const { UserFeatures } = require('../../lib/assets/chat/js/features');
const { EmoteFormatter, GreenTextFormatter, UrlFormatter } = require('./formatters');

export const MessageTypes = {
    STATUS: 'STATUS',
    ERROR: 'ERROR',
    INFO: 'INFO',
    COMMAND: 'COMMAND',
    BROADCAST: 'BROADCAST',
    UI: 'UI',
    CHAT: 'CHAT',
    USER: 'USER',
    EMOTE: 'EMOTE'
}

const formatters = new Map()
formatters.set('green', new GreenTextFormatter())
formatters.set('emote', new EmoteFormatter())
formatters.set('url', new UrlFormatter())
//formatters.set('mentioned', new MentionedUserFormatter())

/* Chat elements do not use Views so as to use Text's inline-block-style layout.
   This means that elements may have spaces hard-coded, as Text does not allow
   for much layout control. */

export class UserFlair extends Component<{name: string}> {
    render() {
        const icon = MobileIcons.icons[this.props.name];

        if (icon === undefined) {
            return null;
        }

        return (
            <Image 
                style={{
                    width: icon.width,
                    height: icon.height,
                    top: -icon.x,
                    left: -icon.y
                }} 
                source={{ uri: "file://" + RNFS.DocumentDirectoryPath + "/icons.png" }}
            />
        );
    }
}

export class Time extends Component {
    render() {
        return (
            <Text style={styles.Time}>{this.props.children} </Text>
        )
    }
}

export class UserBadge extends Component<{user: any, onPress: {(user: string): any}}> {
    style: ViewStyle[];
    constructor(props: {user: any, onPress: {(user: string): any}}) {
        super(props);
        this.style = [styles.UserBadge];
        let admin = false;
        for (let i = 0; i < this.props.user.features.length; i++) {
            if (this.props.user.features[i] == UserFeatures.ADMIN) {
                admin = true;
            } else {
                this.style.push(styles[this.props.user.features[i]]);                
            }
        }
        if (admin) this.style.push(styles['admin']);
    }
    render() {
        return (
            <Text onPress={() => this.props.onPress(this.props.user.username)}>
                {this.props.children}
                <Text key='userBadgeText' style={this.style}>{this.props.user.username}</Text>
            </Text>
        )
    }
}

export class Emote extends Component<{name: string, emoteMenu?: boolean}> {
    image: Image | null = null;
    render() {
        const emote = MobileEmotes.emoticons[this.props.name];
        if (emote === undefined)
            return null;
        return (
            <Image 
                style={{
                    width: emote.width,
                    height: emote.height,
                    top: -emote.x,
                    left: -emote.y
                }} 
                source={{uri: "file://" + RNFS.DocumentDirectoryPath + "/emoticons.png"}} 
            />
        );
    }
}

interface MsgTextProps {
    greenText?: boolean;
    link?: string;
    // parent chat window
    emit?: any;
}

class MsgText extends Component<MsgTextProps> {
    constructor(props: MsgTextProps) {
        super(props);
    }
    render() {
        let msgStyles = [styles.MsgText];

        if (this.props.greenText) {
            msgStyles.push(styles.greenText);
        }

        if (this.props.link) {
            msgStyles.push(styles.Link);
        }

        if(this.props.link) {
            return (
                    <Text 
                        onPress={() => {
                            if (this.props.emit) {
                                this.props.emit.openLink(this.props.link);
                            }
                        }}
                        style={msgStyles}
                    >
                        {this.props.link + ' '}
                    </Text>
            )
        } else {
            return (
                <Text style={msgStyles}>{this.props.children}</Text>
            )
        }
    }
}

interface MobileChatMessageProps {
    text: any[];
    msg: any;
    time: number;
    user: string;
    ctrl: string;
}

export class MobileChatMessage extends PureComponent<MobileChatMessageProps> {
    formatted: JSX.Element[];
    constructor(props: MobileChatMessageProps) {
        super(props);
        this.formatted = [];
        for (let i = 0; i < this.props.text.length; i++) {
            if ('string' in this.props.text[i]) {
                this.formatted.push(<MsgText 
                                        key={i} 
                                        greenText={this.props.text[i].greenText}
                                    >
                                        {this.props.text[i].string}
                                    </MsgText>
                );
                continue;
            } else if ('emote' in this.props.text[i]) {
                this.formatted.push(<Emote key={i} name={this.props.text[i].emote} />);
                continue;
            } else if ('url' in this.props.text[i]) {
                this.formatted.push(
                    <MsgText
                        key={i}
                        link={this.props.text[i].url}
                        emit={this.props.msg.window}                        
                    />
                );
            }
        }
    }
    render() {
        return (
            <Text style={this.props.msg.classes} onLayout={(e) => {
                    this.props.msg.height = e.nativeEvent.layout.height;
            }}>
                {this.props.time}
                {this.props.user}
                <Text>{this.props.ctrl}</Text>
                {this.formatted}
            </Text>
        );
    }
}

interface MobileChatEmoteMessageProps {
    msg: any;
    time: number;
    emote: Emote;
    count: number;
}

interface MobileChatEmoteMessageState {
    combo: number;
    comboClass?: TextStyle;
}

export class MobileChatEmoteMessage extends PureComponent<MobileChatEmoteMessageProps, MobileChatEmoteMessageState> {
    constructor(props: MobileChatEmoteMessageProps) {
        super(props);
        this.state = {combo: this.props.count};
    }
    render() {
        let combo = [];
        if (this.state.combo > 1) {
            combo.push(<Text key='ComboCount' style={[this.state.comboClass, styles.ComboCount]}>{this.state.combo}</Text>);
            combo.push(<Text key='ComboX' style={[this.state.comboClass, styles.ComboX]}>x</Text>);
            combo.push(<Text key='ComboCombo' style={styles.ComboCombo}> C-C-C-COMBO</Text>);
        }
        return (
            <Text onLayout={(e) => {
                this.props.msg.height = e.nativeEvent.layout.height
            }}>
                {this.props.time}{this.props.emote}{combo}
            </Text>
        )
    }
}

