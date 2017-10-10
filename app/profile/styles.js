import { StyleSheet } from 'react-native';
import { inheritedStyles } from '../styles.js';

const styles = StyleSheet.create({
    ...inheritedStyles,
    ProfileHeader: {
        marginLeft: 15,
        marginBottom: 20,
        marginTop: 10
    }
});

export default styles;