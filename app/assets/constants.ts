import { Dimensions } from 'react-native';

export const shortDimension = (() => {
    const dim = Dimensions.get('window');
    return ((dim.height > dim.width ? dim.width : dim.height));
})();

export const h1 = (shortDimension > 320) ? 36 : 30;
export const h2 = (shortDimension > 320) ? 24 : 20;
export const h3 = (shortDimension > 320) ? 16 : 14;

export const Palette = {
    text: "#888",
    highlight: "#B5B69C",
    title: "#fff",
    disabled: "#888",
    border: "#222",
    inner: "#181818",
    innerDark: "#171717",
    background: "#0D0D0D",
    link: '#FB952B',
    drawerBg: "#151515",
    messageText: "#ccc",
    handleLine: "#444",
    navBorder: "#333"
}