import { AppRegistry } from 'react-native';
import App from './app/App';
import { Client } from 'bugsnag-react-native';

global.bugsnag = new Client();

AppRegistry.registerComponent('destinyapp', () => App);
