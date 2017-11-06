import { StyleSheet, Platform } from 'react-native';
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
        backgroundColor: '#222'
    },
    username: {
        color: '#fff',
        fontSize: h3,
        fontWeight: '500'
    },
    messagePreview: {
        color: '#888'
    },
    UserMessage: {
        flexDirection: 'row',
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 15,
    },
    OurMessage: {
        alignSelf: 'flex-end'
    },
    UserMessageInner: {
        maxWidth: '80%',                        
        borderRadius: 16,
        backgroundColor: '#181818',
        flexDirection: 'row',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
    },
    OurMessageInner: {
        backgroundColor: '#222'
    },
    UserMessageText: {
        color: "#fff",
    },
    TextInput: {
        fontSize: 12,
        color: "#ccc",
        borderRadius: 3,
        borderColor: '#222',
        borderWidth: (Platform.OS === 'ios') ? StyleSheet.hairlineWidth : 0,
        padding: 8,
    },
});

export default styles;