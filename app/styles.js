import { StyleSheet, Platform, Dimensions } from 'react-native';

export const shortDimension = (() => {
    const dim = Dimensions.get('window');
    return ((dim.height > dim.width ? dim.width : dim.height));
})();

export const h1 = (shortDimension > 320) ? 36 : 30;
export const h2 = (shortDimension > 320) ? 24 : 20;
export const h3 = (shortDimension > 320) ? 16 : 14;

export const inheritedStyles = {
    text: {
        color: "#888"
    },
    highlight: {
        color: "#B5B69C"
    },
    iosPad: {
        paddingTop: (Platform.OS === 'ios' ? 20 : 0)                
    },
    selectTitle: {
        fontSize: h2,
        fontWeight: '700',
        color: "#fff",
        marginTop: 100,
        marginBottom: 10,        
        marginLeft: 15        
    },
    FormItem: {
        color: "#FFF",
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 15, 
        borderColor: "#222",
        borderBottomWidth: (Platform.OS === 'ios') ? StyleSheet.hairlineWidth : 0,
        fontSize: h3
    },
    FormItemDisabled: {
        color: '#888'
    },
    ListItemText: {
        color: "#FFF",
        fontSize: h3
    },
    ListSwitch: {
        justifyContent: 'space-between',
    },
    Navigation: {
        backgroundColor: "#181818",
        borderColor: "#303030",
        borderStyle: "solid"
    },
    NavigationHeaderTitle: {
        color: "#FFF"
    },
    ListItemOuter: {
        backgroundColor: "#171717",             
        paddingLeft: 15,      
        borderColor: "#222",
    },
    ListItemInner: {
        paddingTop: 10,
        paddingRight: 15, 
        paddingBottom: 10,         
        borderColor: "#222",
        borderBottomWidth: StyleSheet.hairlineWidth        
    },
    firstInList: {
        borderTopWidth: StyleSheet.hairlineWidth,                
    },
    lastInList: {
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    innerLastInList: {
        borderBottomWidth: 0
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