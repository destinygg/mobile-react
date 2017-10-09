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
    FormItem: {
        color: "#888",
        backgroundColor: "#171717",
        paddingLeft: 15,
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 15, 
        borderColor: "#222",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderTopWidth: StyleSheet.hairlineWidth
    },
    ListItemText: {
        color: "#FFF",
        fontSize: 16
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
        backgroundColor: "#171717",             
        paddingLeft: 15,
        paddingTop: 10,
        paddingBottom: 10, 
        paddingRight: 15,       
        borderColor: "#222",
        borderTopWidth: StyleSheet.hairlineWidth,        
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    SelectModalOuter: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    SelectModalInner: {
        backgroundColor: "#181818",
    },
    SelectModalHeader: {
        marginTop: 5,
        marginRight: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end'
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