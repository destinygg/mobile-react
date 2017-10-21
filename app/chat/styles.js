import { StyleSheet } from 'react-native';
import { inheritedStyles } from '../styles';

const styles = StyleSheet.create({
    ...inheritedStyles,
    ChatView: {
        flex: 1,
        paddingTop: 0,
        paddingBottom: 10,
        paddingRight: 2,
        paddingLeft: 2,
    },
    ChatViewList: {
        flex: 1
    },
    ChatMessage: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    MsgText: {
        color: '#ccc',
        fontSize: 12,
        marginLeft: 2,
        height: 15
    },
    'msg-chat': {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    subscriber: {
        color: '#488ce7'
    },
    'flair-3': {
        color: '#0060ff'
    },
    UserBadge: {
       fontWeight: '600',
       color: '#cacaca',
       fontSize: 12
    },
    Subscriber: {
        color: '#488ce7'
    },
    ChatInput: {
        fontSize: 12,
        color: "#ccc",
        borderRadius: 3,
        borderColor: '#222',
        borderWidth: StyleSheet.hairlineWidth,
        padding: 8,
    },
    Emote: {
        marginTop: 7
    },
    Flair: {
        marginTop: -1,
    },
    Time: {
        fontSize: 10,
        color: '#414141',
        fontWeight: '200'
    }
});

export default styles;