import { StyleSheet } from 'react-native';

export const inheritedStyles = {
    title: {
        color: "#FFF",
        fontSize: 36,
        fontWeight: "300"
    },
    subtitle: {
        color: "#888",
        fontSize: 16
    },
    text: {
        color: "#888"
    },
    highlight: {
        color: "#B5B69C"
    },
    ListItemText: {
        color: "#FFF"
    },
    Navigation: {
        backgroundColor: "#181818",
        borderColor: "#303030",
        borderStyle: "solid"
    },
    NavigationHeaderTitle: {
        color: "#FFF"
    },
    ListItem: {
        padding: 10,
        backgroundColor: "#171717",
        borderColor: "#1F1F1F",
        borderStyle: "solid"
    },
    SelectModal: {
        height: '50%',
        bottom: 0
    },
    View: {
        flex: 1,
        backgroundColor: "#0D0D0D"
    }
}

const styles = StyleSheet.create({
    ...inheritedStyles
});

export default styles;