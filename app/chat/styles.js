import { StyleSheet } from 'react-native';
import { inheritedStyles } from '../styles.js';

const styles = StyleSheet.create({
    ...inheritedStyles,
    ChatView: {
        flex: 1,
        paddingTop: 25,
        paddingBottom: 10,
        paddingRight: 10,
        paddingLeft: 10,
    },
    ChatViewList: {
        flex: 1
    },
    ChatMessage: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    MessageText: {
        color: '#ccc',
        fontSize: 13,
        marginLeft: 2
    },
    UserText: {
       fontWeight: '600' 
    },
    Subscriber: {
        color: '#488ce7'
    },
    ChatInput: {
        fontSize: 13,
        color: "#ccc",
        borderRadius: 3,
        borderColor: '#222',
        borderWidth: StyleSheet.hairlineWidth,
        padding: 8,
    },
    Emote: {
        marginTop: -7
    },
    Flair: {
        marginTop: -1,
    }
});

export default styles;