import RNFS from "react-native-fs";
import UpstreamAssets, { IImageAsset } from "./UpstreamAssets";
import { Image } from "react-native";

export default class MobileEmotes {
    static emoticons: { [name: string]: IImageAsset } = {};

    static init() {
        return new Promise(async resolve => {
            if (__DEV__) {
                const files = await RNFS.readDir("file://" + RNFS.CachesDirectoryPath + "/emotes");
                for (let f of files) {
                    Image.getSize("file://" + f.path,
                        (w,h) => {
                            MobileEmotes.emoticons[f.name.split(".")[0]] = {
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
            const files = await UpstreamAssets.sync("emotes");
    
            const successes: boolean[] = [];
    
            for (let f of files) {
                const name = f.split(".")[0];
                const path = "file://" + RNFS.CachesDirectoryPath + "/emotes/" + f;
                Image.getSize(path,
                    (w,h) => {
                        MobileEmotes.emoticons[name] = {
                            uri: path,
                            width: w,
                            height: h
                        };
                        successes.push(true);
                        if (successes.length === files.length) {
                            resolve();
                        }
                    },
                    () => {
                        successes.push(false);
                        if (successes.length === files.length) {
                            resolve();
                        }
                    },
                );
            }
        })
    }
}
