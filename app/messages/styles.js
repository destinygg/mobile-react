import { StyleSheet } from 'react-native';
import { inheritedStyles, shortDimension, h1, h2, h3 } from '../styles';

const styles = StyleSheet.create({
    ...inheritedStyles,
    messageItem: {
        height: 75,
        marginLeft: 15,
        marginRight: 15,
        justifyContent: 'center'
    },
    separator: {
        marginLeft: 15,
        marginRight: 15,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#888'
    },
    username: {
        color: '#fff',
        fontSize: h3,
        fontWeight: '500'
    },
    messagePreview: {
        color: '#888'
    }
});

export default styles;