import RNFS from "react-native-fs";

import UpstreamAssets, { IImageAsset } from "./UpstreamAssets";

export default class MobileIcons {
    static icons: { [name: string]: IImageAsset } = {};

    static async init() {
        if (__DEV__) {
            const files = await RNFS.readDir("file://" + RNFS.CachesDirectoryPath + "/icons");
            for (let f of files) {
                const asset = await UpstreamAssets.getImageSize("file://" + f.path);
                MobileIcons.icons[f.name.split(".")[0]] = asset;
            }
            return;
        }
        const files = await UpstreamAssets.sync("icons");

        for (let f of files) {
            const name = f.split(".")[0];
            const path = "file://" + RNFS.CachesDirectoryPath + "/icons/" + f;

            const asset = await UpstreamAssets.getImageSize(path);
            MobileIcons.icons[name] = asset;
        }
    }
}
