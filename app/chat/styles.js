import { StyleSheet, Platform } from 'react-native';
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
        flex: 1,
    },
    ChatMessage: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    MsgText: {
        color: '#ccc',
        fontSize: 12,
        lineHeight: 18               
    },
    'msg-chat': {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: 'transparent',
        minHeight: 18       
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
       fontSize: 12,
       marginLeft: 10
    },
    Subscriber: {
        color: '#488ce7'
    },
    ChatInput: {
        flex: 1,
        fontSize: 12,
        color: "#ccc",
        borderRadius: 15,
        borderColor: '#222',
        borderWidth: (Platform.OS === 'ios') ? StyleSheet.hairlineWidth : 0,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        marginLeft: 5,
    },
    Emote: {
        marginTop: 3,
        height: 15,
        width: 15,
        paddingLeft: 5,
        paddingRight: 5,
        resizeMode: 'cover',
        overflow: 'visible'
    },
    EmoteDirectory: {
        position: 'absolute',
        bottom: 60,
        left: 10,
        width: '75%',
        height: '50%',
        zIndex: 1000,
        backgroundColor: '#111',
        borderRadius: 10,
        borderColor: '#888',
        borderWidth: StyleSheet.hairlineWidth
    },
    EmoteMenuItem: {
        height: 25,
        width: 25
    },
    Flair: {
        height: 10,
        width: 10,
        resizeMode: 'contain'
    },
    Time: {
        fontSize: 10,
        color: '#888',
        fontWeight: '200',
    },
    PinnedFooter: {
        color: '#444', 
        bottom: -25, 
        position: 'absolute',
        alignSelf: 'center'
    }
});

export default styles;