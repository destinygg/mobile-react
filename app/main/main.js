import React, { Component } from 'react';
import Chat from '../chat/chat.js';
import styles from './styles.js';

class MainView extends Component {
    constructor() {
        super();
        // view: "main", "chatExpand", and "chatOnly"
        this.state = {view: "main"};
    }
}