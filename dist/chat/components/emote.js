"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const css_1 = __importDefault(require("css"));
const react_native_1 = require("react-native");
const react_native_fast_image_1 = __importDefault(require("react-native-fast-image"));
class MobileEmotes {
    static fetchEmoteStyles() {
        return __awaiter(this, void 0, void 0, function* () {
            const f = yield fetch("https://github.com/destinygg/chat-gui/blob/master/assets/emotes/emoticons.scss");
            if (!f.ok) {
                throw new Error(f.statusText);
            }
            return yield f.text();
        });
    }
    static fetchLatestEmoticonHash() {
        return __awaiter(this, void 0, void 0, function* () {
            const f = yield fetch("https://api.github.com/repositories/108987755/contents/assets/emotes");
            if (!f.ok) {
                throw new Error(f.statusText);
            }
            const j = yield f.json();
            return j.sha;
        });
    }
    static fetchLatestSpritesheet() {
        // replace this with fetch, react-native-fs, and add a spritesheet
        // implementation
        react_native_fast_image_1.default.preload([
            {
                uri: "https://raw.githubusercontent.com/destinygg/chat-gui/master/assets/emotes/emoticons.png",
                cache: "web"
            }
        ]);
    }
    static generateMobileEmotes() {
        return __awaiter(this, void 0, void 0, function* () {
            const emoteStyle = css_1.default.parse(yield MobileEmotes.fetchEmoteStyles());
            const emoticons = {};
            for (let rule of emoteStyle.stylesheet.rules) {
                if (rule.selectors.length > 1) {
                    // throw out the all-emotes rule
                    continue;
                }
                const name = rule.selectors[0].split("-").slice(-1)[0];
                let emote = {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                    marginTop: 0
                };
                for (let d of rule.declarations) {
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
                    emote.marginTop === 0) {
                    throw new Error("invalid emote: \n\n" + JSON.stringify(emote));
                }
                emoticons[name] = emote;
            }
            MobileEmotes.fetchLatestSpritesheet();
            return emoticons;
        });
    }
    static runEmoteJob() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentSha = yield react_native_1.AsyncStorage.getItem("emoteSha");
            const upstreamSha = yield MobileEmotes.fetchLatestEmoticonHash();
            console.log("current emote sha: " + currentSha);
            console.log("upstream emote sha: " + upstreamSha);
            if (currentSha === undefined || currentSha === null || currentSha !== upstreamSha) {
                try {
                    const e = MobileEmotes.generateMobileEmotes();
                    react_native_1.AsyncStorage.multiSet([["emoteSha", upstreamSha], ["emotes", JSON.stringify(e)]]);
                }
                catch (e) {
                    console.log("error generating emotes: ");
                    console.log(e);
                }
            }
        });
    }
}
MobileEmotes.emoticons = {};
exports.MobileEmotes = MobileEmotes;
