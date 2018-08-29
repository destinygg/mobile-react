import RNFS from "react-native-fs";

import UpstreamAssets, { IImageAsset } from "./UpstreamAssets";
import { Image } from "react-native";

export default class MobileIcons {
    static icons: { [name: string]: IImageAsset } = {};

    static async init() {
        if (__DEV__) {
            const files = await RNFS.readDir("file://" + RNFS.CachesDirectoryPath + "/icons");
            for (let f of files) {
                Image.getSize("file://" + f.path,
                    (w,h) => {
                        MobileIcons.icons[f.name.split(".")[0]] = {
                            uri: "file://" + f.path,
                            width: w,
                            height: h
                        };
                    },
                    () => true
                );
            }
            return;
        }
        const files = await UpstreamAssets.sync("icons");

        for (let f of files) {
            const name = f.split(".")[0];
            const path = "file://" + RNFS.CachesDirectoryPath + "/icons/" + f;
            Image.getSize(path,
                (w,h) => {
                    MobileIcons.icons[name] = {
                        uri: path,
                        width: w,
                        height: h
                    };
                },
                () => true
            );
        }
    }
}
