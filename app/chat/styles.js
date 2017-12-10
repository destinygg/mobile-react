import { StyleSheet, Platform } from 'react-native';
import { inheritedStyles } from '../styles';

const styles = StyleSheet.create({
    ...inheritedStyles,
    ChatView: {
        flex: 1,
        paddingTop: 0,
        paddingRight: 10,
        paddingLeft: 10,
        marginBottom: 72
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
        backgroundColor: 'transparent',
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
       backgroundColor: 'transparent',
       fontSize: 12,
       marginLeft: 10
    },
    Subscriber: {
        color: '#488ce7'
    },
    mention: {
        backgroundColor: 'rgba(0, 122, 255, 0.5)',
        borderRadius: 2
    },
    ChatInput: {
        flex: 1,
        fontSize: 12,
        color: "#ccc",
        height: 34
    },
    ChatInputOuter: {
        flexDirection: 'row',
        zIndex: 2000,
        backgroundColor: '#151515',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingTop: 8,
        paddingLeft: 5,
        paddingRight: 5,
    },
    ChatInputInner: {
        flex: 1, 
        flexDirection: 'row',
        marginTop: 2
    },
    ChatInputInnerInner: {
        borderColor: "#222",
        backgroundColor: "#181818",
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: (Platform.OS === 'ios') ? 17 : 19,
        paddingLeft: 15,
        paddingRight: 15,
        marginLeft: 5,
        marginTop: 10,
        marginRight: 15,
        flex: 1,
        height: (Platform.OS === 'ios') ? 34 : 38
    },
    Emote: {
        marginTop: 2,
        height: (Platform.OS === 'ios') ? 15 : 25,
        width: 25,
        resizeMode: 'contain',
        overflow: 'visible',
        backgroundColor: 'transparent'
    },
    EmoteDirectoryOuter: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        height: 70,
        backgroundColor: '#151515'     
    },
    EmoteDirOuterOuter: {
        width: '100%', 
        paddingLeft: 5, 
        paddingRight: 5, 
    },
    EmoteDirectory: {
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 15
    },
    EmoteMenuItem: {
        resizeMode: 'contain',
        overflow: 'visible',
        height: (Platform.OS === 'ios') ? 25 : 20
    },
    Flair: {
        height: (Platform.OS === 'ios') ? 10 : 15,
        width: (Platform.OS === 'ios') ? 10 : 15,
        resizeMode: 'contain',
        backgroundColor: 'transparent'
    },
    Time: {
        fontSize: 10,
        color: '#888',
        fontWeight: '200',
        backgroundColor: 'transparent'
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
    },
    MediaModal: {
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center'
    },
    MediaModalInner: {
        height: '50%',
        borderRadius: 15        
    }
});

export default styles;