import { StyleSheet, Platform } from 'react-native';
import { inheritedStyles } from '../styles';

const styles = StyleSheet.create({
    ...inheritedStyles,
    MainView: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: (Platform.OS === 'ios' ? 20 : 0)
    },
    TwitchView: {
        flex: 1,
        backgroundColor: '#000',
        overflow: 'hidden',
    },
    TwitchViewDivider: {
        height: 2,
        zIndex: 1000,        
        backgroundColor: 'transparent',
    },
    DividerResizing: {
        backgroundColor: '#444',
        opacity: .5
    },
    TwitchViewDividerHandle: {
        height: 8,
        width: 8,
        top: -2,        
        borderRadius: 4,
        backgroundColor: '#222',
        alignSelf: 'center',
    }
});

export default styles;