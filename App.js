import React, { Component } from 'react';
import InitNav from './app/navigation.js';

const emotes = require('./emotes.json');

class App extends Component {
    constructor() {
        super();
        this.chat = new MobileChat()
                          .withEmotes(emotes)
                          .withGui()
                          .withWhispers();
    }
    render() {
        return (
            <InitNav screenProps={{chat: this.chat}}/>
        );
    }
}