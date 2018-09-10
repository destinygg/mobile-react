import RNFS from "react-native-fs";

import { Image } from "react-native";

const UpstreamEmotePath = "assets/emotes/emoticons";
const UpstreamIconPath = "assets/icons/icons";

const GithubMetadataPath = "https://api.github.com/repositories/108987755/contents/";
const GithubDownloadPath = "https://raw.githubusercontent.com/destinygg/chat-gui/master/";

export interface IImageAsset {
    uri: string;
    width: number;
    height: number;
}

/** no leading slash for paths */
export default class UpstreamAssets { 
    static async fetchText(repoPath: string): Promise<string> {
        const f = await fetch(GithubDownloadPath + repoPath);
        if (!f.ok) {
            throw new Error(f.statusText);
        }
        return await f.text();
    }

    static async getShaSum(repoPath: string) {
        const parts = repoPath.split('/');
        const lastPart = parts.pop();
        const f = await fetch(GithubMetadataPath + parts.join("/"));
        if (!f.ok) {
            throw new Error(f.statusText);
        }

        const j = await f.json();

        for (let file of j) {
            if (file.name === lastPart) {
                return file.sha
            }
        }

        throw new Error("Unable to find file in parent github dir.")
    }

    static async sync(assetType: "emotes" | "icons"): Promise<string[]> {
        const dir = assetType === "emotes" ? UpstreamEmotePath : UpstreamIconPath;
        const f = await fetch(GithubMetadataPath + dir);
        if (!f.ok) {
            throw new Error(f.statusText);
        }

        const j = await f.json();

        const targetDir = RNFS.CachesDirectoryPath + "/" + assetType;

        await RNFS.mkdir(targetDir, {
            NSURLIsExcludedFromBackupKey: true
        });

        const existing = await RNFS.readDir(targetDir);

        const names: string[] = [];

        for (let file of j) {
            const e = existing.find(f => f.name === file.name);
            if (e === undefined || e.size !== file.size) {
                await RNFS.downloadFile({
                    fromUrl: file.download_url,
                    toFile: targetDir + "/" + file.name
                }).promise;
            }
            names.push(file.name);
        }

        return names
    }

    static getImageSize(uri: string): Promise<IImageAsset> {
        return new Promise((resolve, reject) => {
            Image.getSize(uri,
                (w, h) => {
                    resolve({
                        uri: uri,
                        width: w,
                        height: h
                    });
                },
                () => reject()
            );
        })
    }
}
