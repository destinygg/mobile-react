import css from "jotform-css.js";

import { AsyncStorage } from "react-native";

import UpstreamAsset from "./UpstreamAsset";

export interface IIcon {
    x: number;
    y: number;
    width: number;
    height: number;
}

enum UpstreamIconPaths {
    styles = "assets/icons/icons.scss",
    spriteSheet = "assets/icons/icons.png"
}

export default class MobileIcons {
    static icons: { [name: string]: IIcon } = {};

    static async generateMobileIcons(): Promise<{ [name: string]: IIcon }> {
        const iconStyle: any = new css().parseCSS(await UpstreamAsset.fetchText(UpstreamIconPaths.styles));

        const icons: { [name: string]: IIcon } = {};

        for (let each of iconStyle) {
            const s: string[] = each.selector.split(",");
            if (s.length > 1) {
                // throw out the all-icons obj
                continue;
            }

            const name = s[0].trim().split("-").slice(-1)[0];
            let icon: IIcon = {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            }

            for (let r of each.rules) {
                switch (r.directive) {
                    case "background-position":
                        const xy = r.directive.split(" ");
                        icon.x = Number.parseInt(xy[0].slice(0, -2));
                        icon.y = Number.parseInt(xy[1].slice(0, -2));
                        break;
                    case "width":
                        icon.width = Number.parseInt(r.directive.slice(0, -2));
                        break;
                    case "height":
                        icon.width = Number.parseInt(r.directive.slice(0, -2));
                        break;
                }
            }

            if (name === undefined ||
                name === "" ||
                icon.x === 0 ||
                icon.y === 0 ||
                icon.width === 0
            ) {
                throw new Error("invalid icon: \n\n" + JSON.stringify(icon));
            }

            icons[name] = icon;
        }

        await UpstreamAsset.downloadToCache(UpstreamIconPaths.spriteSheet, "icons.png");

        return icons;
    }

    static async init() {
        const currentSha = await AsyncStorage.getItem("iconSha");
        const upstreamSha = await UpstreamAsset.getShaSum(UpstreamIconPaths.spriteSheet);

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
            MobileIcons.icons = e === null ? [] : JSON.parse(e);
        }
    }
}
