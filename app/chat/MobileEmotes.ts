import RNFS from "react-native-fs";
import UpstreamAssets, { IImageAsset } from "./UpstreamAssets";

export default class MobileEmotes {
    static emoticons: { [name: string]: IImageAsset } = {};

    static init() {
        return new Promise(async resolve => {
            if (__DEV__) {
                const files = await RNFS.readDir("file://" + RNFS.CachesDirectoryPath + "/emotes");
                for (let f of files) {
                    const asset = await UpstreamAssets.getImageSize("file://" + f.path);
                    
                    MobileEmotes.emoticons[f.name.split(".")[0]] = asset;
                }
                return;
            }
            const files = await UpstreamAssets.sync("emotes");
    
            for (let f of files) {
                const name = f.split(".")[0];
                const path = "file://" + RNFS.CachesDirectoryPath + "/emotes/" + f;

                const asset = await UpstreamAssets.getImageSize(path);

                MobileEmotes.emoticons[name] = asset;
            }
        })
    }
}
