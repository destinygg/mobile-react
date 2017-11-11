import { StyleSheet, Platform } from 'react-native';
import { inheritedStyles, h2 } from '../styles';

const styles = StyleSheet.create({
    ...inheritedStyles,
    AboutHeader: {
        color: '#888',
        fontSize: h2,
        fontWeight: '600',
        marginTop: 15
    },
    AboutBody: {
        color: '#888'
    },
    AboutDev: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        width: 200,
        alignSelf: 'flex-end',
        marginBottom: 25,
        marginTop: 75,
        marginRight: 10
    },
    AboutDevInner: {
        borderWidth: 3,
        borderColor: '#000',
        padding: 15
    },
    AboutDevBody: {
        color: '#000',
        fontWeight: '300',
        width: 100
    },
    AboutDevHeader: {
        color: '#000',
        fontSize: 36,
        fontWeight: '400',
        marginBottom: 10
    },
    badgePressed: {
        color: '#fff'
    },
    badgePressedBorder: {
        borderColor: '#fff'        
    }
});

export default styles;