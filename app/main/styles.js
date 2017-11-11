import { StyleSheet, Platform } from 'react-native';
import { inheritedStyles } from '../styles';

const styles = StyleSheet.create({
    ...inheritedStyles,
    MainView: {
        flex: 1,
        backgroundColor: '#000'
    },
    TwitchViewOuter: {
        flex: 0,
        height: 250,
        backgroundColor: '#000'
    },
    TwitchViewInner: {
        flex: 1,
        backgroundColor: '#000',
        overflow: 'hidden',
    },
    TwitchViewDivider: {
        height: 2,
        backgroundColor: 'transparent',
    },
    DividerResizing: {
        backgroundColor: '#444',
        opacity: .5
    },
    TwitchViewDividerHandle: {
        height: (Platform.OS === 'ios') ? 8 : 16,
        marginTop: (Platform.OS === 'ios') ? -8 : -16,
        top: (Platform.OS === 'ios') ? 4 : 8,
        zIndex: 1000,
        width: (Platform.OS === 'ios') ? 8 : 24,
        borderRadius: (Platform.OS === 'ios') ? 4 : 8,
        backgroundColor: '#222',
        alignSelf: 'center',
    }
});

export default styles;