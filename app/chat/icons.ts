import css from "css";
import { AsyncStorage } from "react-native";

import RNFS from "react-native-fs";

export interface IIcon {
    x: number;
    y: number;
    width: number;
    height: number;
    marginTop: number;
}

export class MobileIcons {
    static icons: { [name: string]: IIcon } = {};

    static async fetchIconStyles(): Promise<string> {
        const f = await fetch("https://github.com/destinygg/chat-gui/blob/master/assets/icons/icons.scss");
        if (!f.ok) {
            throw new Error(f.statusText);
        }
        return await f.text();
    }

    static async fetchLatestIconHash() {
        const f = await fetch("https://api.github.com/repositories/108987755/contents/assets/icons");
        if (!f.ok) {
            throw new Error(f.statusText);
        }

        const j = await f.json();

        for (let file of j) {
            if (file.name === "icons.png") {
                return file.sha
            }
        }

        throw new Error("Unable to find file in github payload.")
    }

    static fetchLatestSpritesheet() {
        return RNFS.downloadFile({
            fromUrl: "https://raw.githubusercontent.com/destinygg/chat-gui/master/assets/icons/icons.png",
            toFile: RNFS.DocumentDirectoryPath + "/icons.png"
        });
    }

    static async generateMobileIcons(): Promise<{ [name: string]: IIcon }> {
        const iconStyle = css.parse(await MobileIcons.fetchIconStyles());

        const icons: { [name: string]: IIcon } = {};

        for (let rule of (iconStyle.stylesheet!.rules as css.Rule[])) {
            if (rule.selectors!.length > 1) {
                // throw out the all-icons rule
                continue;
            }

            const name = rule.selectors![0].split("-").slice(-1)[0];
            let icon: IIcon = {
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
                icon.x === 0 ||
                icon.y === 0 ||
                icon.width === 0 ||
                icon.marginTop === 0
            ) {
                throw new Error("invalid icon: \n\n" + JSON.stringify(icon));
            }

            icons[name] = icon;
        }

        await MobileIcons.fetchLatestSpritesheet();

        return icons;
    }

    static async init() {
        const currentSha = await AsyncStorage.getItem("iconSha");
        const upstreamSha = await MobileIcons.fetchLatestIconHash();

        console.log("current icon sha: " + currentSha);
        console.log("upstream icon sha: " + upstreamSha);

        if (currentSha === undefined || currentSha === null || currentSha !== upstreamSha) {
            try {
                const e = await MobileIcons.generateMobileIcons();
                MobileIcons.icons = e;
                AsyncStorage.multiSet([["iconSha", upstreamSha], ["icons", JSON.stringify(e)]])
            } catch (e) {
                console.log("error generating icons: ");
                console.log(e);
            }
        } else {
            const e = await AsyncStorage.getItem("icons");
            MobileIcons.icons = JSON.parse(e);
        }
    }
}
