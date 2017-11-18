import UserFeatures from '../../lib/assets/chat/js/features'

const emoteDir = require('../../lib/assets/emotes.json');

const destinyEmotes = Array.from(emoteDir['destiny']);
const twitchEmotes = Array.from(emoteDir['twitch']);

const gemoteregex = new RegExp(`\b`);
let twitchemoteregex;

const urlregex = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);

export class UrlFormatter {
    format(chat, msg, message = null) {
        const self = this;
        const regex  = urlregex;
        let formatted = [];
        let extraclass = undefined;

        if (/\b(?:NSFL)\b/i.test(msg))
            extraclass = 'nsfl-link';
        else if (/\b(?:NSFW|SPOILER)\b/i.test(msg))
            extraclass = 'nsfw-link';

        for (let i = 0; i < msg.length; i++) {
            if (msg[i].string) {
                let searchIndex = msg[i].string.search(regex);
                while (searchIndex != -1) {
                    const before = msg[i].string.slice(0, searchIndex);
                    const [url, after] = msg[i].string.slice(searchIndex).split(' ');

                    if (before.length > 0) {
                        formatted.push({'string': before, greenText: msg[i].greenText});
                    }
                    formatted.push({ 'url': url, class: extraclass });  

                    msg[i].string = after;
                    
                    if (after === undefined || after.length < 1) {
                        break;
                    } 
                    searchIndex = msg[i].string.search(regex); 
                }
                if (msg[i].string != undefined && msg[i].string.length > 0) {
                    formatted.push(msg[i]);
                }
            } else {
                formatted.push(msg[i]);
            }
        }
        return formatted;
    }

}

export class EmoteFormatter {
    format(chat, msg, message = null) {
        if (!gemoteregex || !twitchemoteregex) {
            const emoticons = destinyEmotes.join('|');
            const twitchemotes = twitchEmotes.join('|');
            gemoteregex = new RegExp(`\b${emoticons}\b`);
            twitchemoteregex = new RegExp(`\b${twitchemotes}\b`);
        }
        let regex = gemoteregex;
        let result;
        let formatted = [];
        let match = false;

        while ((result = regex.exec(msg)) !== null) {
            match = true;
            const before = msg.substring(0, result.index);

            if (before !== "") {
                formatted.push({ "string": before, "greenText": message.greenText });
            }

            formatted.push({ "emote": result[0] });

            msg = msg.substring(result.index + result[0].length);
        }
        
        if (msg.length > 0) {
            formatted.push({ "string": msg, "greenText": message.greenText });            
        }

        return formatted;
    }
}

export class MentionedUserFormatter {

    format(chat, msg, message = null) {
        if (message && message.mentioned && message.mentioned.length > 0) {
            let formatted = [];

            for (let i = 0; i < msg.length; i++) {
                if (!('string' in msg[i])) {
                    formatted.push(msg[i]);
                    continue;
                }
                let regex = new RegExp(`\b${message.mentioned.join('|')}\b`)
                let result;
                let match = false;

                while ((result = regex.exec(msg[i])) !== null) {
                    match = true;
                    const before = msg[i].substring(0, result.index);

                    if (before !== "") {
                        formatted.push({ string: before, greenText: message.greenText });
                    }

                    formatted.push({ mention: result[0] });
                    msg[i] = msg[i].substring(result.index + result[0].length);
                }

                if (!match) {
                    formatted.push(msg[i]);
                }
            }
            return formatted;
        }
        return msg;
    }
}

export class GreenTextFormatter {

    format(chat, msg, message = null) {
        if (message.user && msg.indexOf('>') === 0) {
            if (message.user.hasAnyFeatures(
                UserFeatures.SUBSCRIBER,
                UserFeatures.SUBSCRIBERT0,
                UserFeatures.SUBSCRIBERT1,
                UserFeatures.SUBSCRIBERT2,
                UserFeatures.SUBSCRIBERT3,
                UserFeatures.SUBSCRIBERT4,
                UserFeatures.NOTABLE,
                UserFeatures.TRUSTED,
                UserFeatures.CONTRIBUTOR,
                UserFeatures.COMPCHALLENGE,
                UserFeatures.ADMIN,
                UserFeatures.MODERATOR
            )) {
                message.greenText = true;                
            }
        }
        return msg;
    }

}