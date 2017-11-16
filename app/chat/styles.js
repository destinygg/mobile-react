import { StyleSheet, Platform } from 'react-native';
import { inheritedStyles } from '../styles';

const styles = StyleSheet.create({
    ...inheritedStyles,
    ChatView: {
        flex: 1,
        paddingTop: 0,
        paddingBottom: 10,
        paddingRight: 10,
        paddingLeft: 10,
        marginBottom: 60
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
        lineHeight: 18               
    },
    'msg-chat': {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: 'transparent',
        minHeight: 18
    },
    'msg-own': {
        //TODO
    },
    'msg-broadcast': {
        color: '#edea12'
    },
    greenText: {
        color: '#6ca528'
    },
    subscriber: {
        color: '#488ce7'
    },
    flair3: {
        color: '#0060ff'
    },
    flair8: {
        color: '#a427d6'
    },
    flair12: {
        color: '#00e5ff'
    },
    vip: {
        color: '#4db524'
    },
    admin: {
        color: '#b91010'
    },
    bot: {
        color: '#e79015'
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
        paddingLeft: 12,
        paddingRight: 12,
        marginLeft: 5,
        marginRight: 10,
    },
    ChatInputOuter: { 
        flexDirection: 'column', 
        paddingLeft: 10, 
        paddingRight: 10,
        paddingBottom: 10,
        marginTop: 5, 
        backgroundColor: '#151515',
        width: '100%',
        alignSelf: 'center',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    Emote: {
        marginTop: 2,
        height: (Platform.OS === 'ios') ? 15 : 25,
        width: 25,
        resizeMode: 'contain',
        overflow: 'visible'
    },
    EmoteDirectory: {
        zIndex: 1000,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        height: 0,
    },
    EmoteMenuItem: {
        resizeMode: 'contain',
        overflow: 'visible',
        height: (Platform.OS === 'ios') ? 25 : 20
    },
    Flair: {
        height: (Platform.OS === 'ios') ? 10 : 15,
        width: (Platform.OS === 'ios') ? 10 : 15,
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
    },
    ComboCount: {
        color: '#fff',
        fontWeight: '700',
        marginLeft: 5
    },
    ComboX: {
        color: '#fff',
        fontWeight: '500'
    },
    ComboCombo: {
        color: '#ccc',
        fontSize: 10
    }
});

export default styles;