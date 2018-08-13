"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
exports.shortDimension = (() => {
    const dim = react_native_1.Dimensions.get('window');
    return ((dim.height > dim.width ? dim.width : dim.height));
})();
exports.h1 = (exports.shortDimension > 320) ? 36 : 30;
exports.h2 = (exports.shortDimension > 320) ? 24 : 20;
exports.h3 = (exports.shortDimension > 320) ? 16 : 14;
exports.inheritedStyles = {
    text: {
        color: "#888"
    },
    highlight: {
        color: "#B5B69C"
    },
    iosPad: {
        paddingTop: (react_native_1.Platform.OS === 'ios' ? 20 : 0)
    },
    selectTitle: {
        fontSize: exports.h2,
        fontWeight: '700',
        color: "#fff",
        marginTop: 100,
        marginBottom: 10,
        marginLeft: 15
    },
    BottomDrawer: {
        position: 'absolute',
        top: 0,
        height: '100%',
        width: '100%',
    },
    FormItem: {
        color: "#FFF",
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 15,
        borderColor: "#222",
        borderBottomWidth: (react_native_1.Platform.OS === 'ios') ? react_native_1.StyleSheet.hairlineWidth : 0,
        fontSize: exports.h3
    },
    FormItemDisabled: {
        color: '#888'
    },
    ListItemText: {
        color: "#FFF",
        fontSize: exports.h3
    },
    ListSwitch: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
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
        borderBottomWidth: react_native_1.StyleSheet.hairlineWidth
    },
    firstInList: {
        borderTopWidth: react_native_1.StyleSheet.hairlineWidth,
    },
    lastInList: {
        borderBottomWidth: react_native_1.StyleSheet.hairlineWidth,
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
    },
    SubscriptionTerms: {
        color: '#444',
        fontSize: 12,
        margin: 15
    },
    Link: {
        color: '#FB952B'
    },
    navbarRight: {
        marginRight: (react_native_1.Platform.OS == 'ios') ? 5 : 15
    },
    DrawerHandle: {
        height: 4,
        width: 100,
        backgroundColor: '#888',
        borderRadius: 2,
        alignSelf: 'center',
        zIndex: 3000,
        top: 10
    }
};
const styles = react_native_1.StyleSheet.create(exports.inheritedStyles);
exports.default = styles;
