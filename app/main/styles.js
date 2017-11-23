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
        height: (Platform.OS === 'ios') ? 12 : 16,
        marginTop: (Platform.OS === 'ios') ? -12 : -16,
        top: (Platform.OS === 'ios') ? 6 : 8,
        zIndex: 1000,
        width: (Platform.OS === 'ios') ? 24 : 30,
        borderRadius: (Platform.OS === 'ios') ? 8 : 10,
        backgroundColor: '#151515',
        alignSelf: 'center',
    },
    CardDrawer: {
        minHeight: 300,
        zIndex: 2000,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        position: 'absolute',
        marginTop: -110
    },
    CardDrawerNavList: {
        backgroundColor: '#151515',
        paddingTop: 20,
        paddingBottom: 100,
        marginTop: -5
    },
    DrawerHandle: {
        position: 'absolute',
        height: 4,
        width: 100,
        backgroundColor: '#888',
        borderRadius: 2,
        top: 55,
        alignSelf: 'center',
        zIndex: 3000
    },
    DrawerUnderlay: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        zIndex: 1500,
        backgroundColor: '#000',
        opacity: 0
    }
});

export default styles;