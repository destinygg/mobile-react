import { StyleSheet, Platform } from 'react-native';
import { Palette } from 'assets/constants';

const styles = StyleSheet.create({
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
    Subscriber: {
        color: '#488ce7'
    },
    mention: {
        backgroundColor: 'rgba(0, 122, 255, 0.5)',
        borderRadius: 2
    },
    Link: {
        color: 'Palette.link'
    },
    ComboCount: {
        color: Palette.title,
        fontWeight: '700',
        marginLeft: 5
    },
    ComboX: {
        color: Palette.title,
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
} as any);

export default styles;