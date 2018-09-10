require("jotform-css.js");

import { StyleSheet, AsyncStorage } from 'react-native';
import { Palette } from 'assets/constants';
import UpstreamAsset from './UpstreamAssets';

const UpstreamChatStylePath = "assets/chat/css/style.scss";
const UpstreamChatColorPath = "assets/common.scss";

export class MobileChatFlairColors {
    static colors: { [className: string]: string } = {};

    static async generateMobileColors(): Promise<{ [className: string]: string }> {
        const parser = new cssjs();
        const styles: any = parser.parseCSS(await UpstreamAsset.fetchText(UpstreamChatStylePath));
        const colorText = await UpstreamAsset.fetchText(UpstreamChatColorPath);
        const lines = colorText.split(/[\r\n]+/g);

        const upstreamColors: { [name: string]: string } = {}; 
        
        lines.forEach(l => {
            if (l.indexOf("$") === 0) {
                const kv = l.split(":");
                const value = kv[1].trim().slice(0, -1);
                console.log(value);
                upstreamColors[kv[0]] = value;
            }
        });

        const colors: { [className: string]: string } = {};

        for (let each of styles) {
            for (let s of each.selector.split(",")) {
                s = s.trim();
                if (s.indexOf("a.") === 0) {
                    const c = (each.rules).find((r: any) => r.directive === "color")
                    if (c !== undefined && c.value !== undefined) {
                        colors[s.slice(2)] = upstreamColors[c.value];
                    }
                }
            }
        }

        return colors;
    }

    static async init() {
        if (__DEV__) {
            const e = await AsyncStorage.getItem("mobileChatColors");
            MobileChatFlairColors.colors = e === null ? [] : JSON.parse(e);
            console.log(this.colors);
            return;
        }
        const currentSha = await AsyncStorage.getItem("mobileChatColorsSha");
        const upstreamSha = await UpstreamAsset.getShaSum(UpstreamChatStylePath);

        console.log("current colors sha: " + currentSha);
        console.log("upstream colors sha: " + upstreamSha);

        if (currentSha === undefined || currentSha === null || currentSha !== upstreamSha) {
            try {
                const e = await MobileChatFlairColors.generateMobileColors();
                MobileChatFlairColors.colors = e;
                AsyncStorage.multiSet([["mobileChatColorsSha", upstreamSha], ["mobileChatColors", JSON.stringify(e)]])
            } catch (e) {
                console.log("error generating colors: ");
                console.log(e);
            }
        } else {
            const e = await AsyncStorage.getItem("mobileChatColors");
            MobileChatFlairColors.colors = e === null ? [] : JSON.parse(e);
        }
    }
}

export const styles = StyleSheet.create({
    'msg-chat': {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: 'transparent',
        minHeight: 18
    },
    'msg-own': {
        //TODO
    },
    'msg-broadcast': {
        color: '#edea12'
    },
    greenText: {
        color: '#6ca528'
    },
    subscriber: {
        color: '#488ce7'
    },
    Subscriber: {
        color: '#488ce7'
    },
    mention: {
        backgroundColor: 'rgba(0, 122, 255, 0.5)',
        borderRadius: 2
    },
    Link: {
        color: Palette.link
    },
    ComboCount: {
        color: Palette.title,
        fontWeight: '700',
        marginLeft: 5
    },
    ComboX: {
        color: Palette.title,
        fontWeight: '500'
    },
    ComboCombo: {
        color: '#ccc',
        fontSize: 10
    },
    MediaModal: {
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center'
    },
    MediaModalInner: {
        height: '50%',
        borderRadius: 15        
    }
});
