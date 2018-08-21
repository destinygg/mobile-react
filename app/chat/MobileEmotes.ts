import css from "jotform-css.js";

import { AsyncStorage } from "react-native";
import UpstreamAsset from "./UpstreamAsset";

export interface IEmote {
    x: number;
    y: number;
    width: number;
    height: number;
    marginTop: number;
}

enum UpstreamEmotePaths {
    styles = "assets/emotes/emoticons.scss",
    spriteSheet = "assets/emotes/emoticons.png"
}

export default class MobileEmotes {
    static emoticons: { [name: string]: IEmote } = {};
    static async generateMobileEmotes(): Promise<{ [name: string]: IEmote }> {
        const emoteStyle: any = new css().parseCSS(await UpstreamAsset.fetchText(UpstreamEmotePaths.styles));

        const emoticons: { [name: string]: IEmote } = {};

        for (let each of emoteStyle) {
            const s: string[] = each.selector.split(",");
            if (s.length > 1) {
                // throw out the all-emotes obj
                continue;
            }

            const name = s[0].trim().split("-").slice(-1)[0];
            let emote: IEmote = {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                marginTop: 0
            }

            for (let r of each.rules) {
                switch (r.directive) {
                    case "background-position":
                        const xy = r.directive.split(" ");
                        emote.x = Number.parseInt(xy[0].slice(0, -2));
                        emote.y = Number.parseInt(xy[1].slice(0, -2));
                        break;
                    case "width":
                        emote.width = Number.parseInt(r.directive.slice(0, -2));
                        break;
                    case "height":
                        emote.height = Number.parseInt(r.directive.slice(0, -2));
                        break;
                    case "margin-top":
                        emote.marginTop = Number.parseInt(r.directive.slice(0, -2));
                        break;
                }
            }

            if (name === undefined ||
                name === "" ||
                emote.x === 0 ||
                emote.y === 0 ||
                emote.width === 0 ||
                emote.marginTop === 0
            ) {
                throw new Error("invalid emote: \n\n" + JSON.stringify(emote));
            }

            emoticons[name] = emote;
        }

        UpstreamAsset.downloadToCache(UpstreamEmotePaths.spriteSheet, "emoticons.png");

        return emoticons;
    }

    static async init() {
        const currentSha = await AsyncStorage.getItem("emoteSha");
        const upstreamSha = await UpstreamAsset.getShaSum(UpstreamEmotePaths.spriteSheet);

        console.log("current emote sha: " + currentSha);
        console.log("upstream emote sha: " + upstreamSha);

        if (currentSha === undefined || currentSha === null || currentSha !== upstreamSha) {
            try {
                const e = await MobileEmotes.generateMobileEmotes();
                MobileEmotes.emoticons = e;
                AsyncStorage.multiSet([["emoteSha", upstreamSha], ["emotes", JSON.stringify(e)]])
            } catch (e) {
                console.log("error generating emotes: ");
                console.log(e);
            }
        } else {
            const e = await AsyncStorage.getItem("emotes");
            MobileEmotes.emoticons = e === null ? [] : JSON.parse(e);
        }
    }
}
