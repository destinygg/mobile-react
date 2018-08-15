import css from "css";
import { IEmote } from "./emotes";
import { AsyncStorage } from "react-native";
import RNFS from "react-native-fs";

export interface IEmote {
    x: number;
    y: number;
    width: number;
    height: number;
    marginTop: number;
}

export class MobileEmotes {
    static emoticons: { [name: string]: IEmote } = {};

    static async fetchEmoteStyles(): Promise<string> {
        const f = await fetch("https://github.com/destinygg/chat-gui/blob/master/assets/emotes/emoticons.scss");
        if (!f.ok) {
            throw new Error(f.statusText);
        }
        return await f.text();
    }

    static async fetchLatestEmoticonHash() {
        const f = await fetch("https://api.github.com/repositories/108987755/contents/assets/emotes");
        if (!f.ok) {
            throw new Error(f.statusText);
        }

        const j = await f.json();

        for (let file of j) {
            if (file.name === "emoticons.png") {
                return file.sha
            }
        }

        throw new Error("Unable to find file in github payload.")
    }

    static fetchLatestSpritesheet() {
        return RNFS.downloadFile({
            fromUrl: "https://raw.githubusercontent.com/destinygg/chat-gui/master/assets/emotes/emoticons.png",
            toFile: RNFS.DocumentDirectoryPath + "/emoticons.png"
        });
    }

    static async generateMobileEmotes(): Promise<{ [name: string]: IEmote }> {
        const emoteStyle = css.parse(await MobileEmotes.fetchEmoteStyles());

        const emoticons: { [name: string]: IEmote } = {};

        for (let rule of (emoteStyle.stylesheet!.rules as css.Rule[])) {
            if (rule.selectors!.length > 1) {
                // throw out the all-emotes rule
                continue;
            }

            const name = rule.selectors![0].split("-").slice(-1)[0];
            let emote: IEmote = {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                marginTop: 0
            }

            for (let d of (rule.declarations! as css.Declaration[])) {
                switch (d.property) {
                    case "background-position":
                        break;
                    case "width":
                        break;
                    case "height":
                        break;
                    case "marginTop":
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

        MobileEmotes.fetchLatestSpritesheet();

        return emoticons;
    }

    static async init() {
        const currentSha = await AsyncStorage.getItem("emoteSha");
        const upstreamSha = await MobileEmotes.fetchLatestEmoticonHash();

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
            MobileEmotes.emoticons = JSON.parse(e);
        }
    }
}