import RNFS from "react-native-fs";

enum GithubEndpoints {
    metadata = "https://api.github.com/repositories/108987755/contents/",
    download = "https://raw.githubusercontent.com/destinygg/chat-gui/master/",
}

/** no leading slash for paths */
export default class UpstreamAsset { 
    
    static async fetchText(repoPath: string): Promise<string> {
        const f = await fetch(GithubEndpoints.download + repoPath);
        if (!f.ok) {
            throw new Error(f.statusText);
        }
        return await f.text();
    }

    static async getShaSum(repoPath: string) {
        const parts = repoPath.split(',');
        const lastPart = parts.pop();
        const f = await fetch(GithubEndpoints.metadata + parts.join(","));
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

    static downloadToCache(repoPath: string, outName: string) {
        return RNFS.downloadFile({
            fromUrl: GithubEndpoints.download + repoPath,
            toFile: RNFS.CachesDirectoryPath + outName
        });
    }
}
