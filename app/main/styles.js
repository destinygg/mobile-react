import { StyleSheet } from 'react-native';
import { inheritedStyles } from '../styles';

const styles = StyleSheet.create({
    ...inheritedStyles,
    MainView: {
        flex: 1,
        backgroundColor: '#000'
    },
    TwitchView: {
        flex: 1,
        backgroundColor: '#000',
        overflow: 'hidden',
        paddingLeft: 0,
        marginLeft: 0,
        borderLeftWidth: 0
    }
});

export default styles;