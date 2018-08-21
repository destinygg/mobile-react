import { AppRegistry } from 'react-native';
import App from './app/App';
import { Client } from 'bugsnag-react-native';

global.bugsnag = new Client('413c4e2656ea74f74409aeaad0c8b619');

AppRegistry.registerComponent('destinyapp', () => App);
