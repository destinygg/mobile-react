import { StyleSheet } from 'react-native';
import { inheritedStyles } from '../styles';

const styles = StyleSheet.create({
    ...inheritedStyles,
    ProfileHeader: {
        marginLeft: 15,
        marginBottom: 20,
        marginTop: 10
    },
    SubscriptionItem: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderRadius: 5,
        borderWidth: 2,
        height: 150,
        margin: 8,
        padding: 10
    },
    SubscriptionRow: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 8,
        marginRight: 8,
        marginTop: 0,
        marginBottom: 0,
    },
    SubscriptionTitle: {
        fontSize: 36,
        fontWeight: '700',
        color: '#fff'
    },
    SubscriptionSubtitle: {
        fontSize: 18,
        marginTop: 5,
        fontWeight: '300',
        color: '#fff'
    },
    Tier4Sub: {
        borderColor: '#a427d6'
    },
    Tier3Sub: {
        borderColor: '#0060ff'
    },
    Tier2Sub: {
        borderColor: '#488ce7'
    },
    Tier1Sub: {
        borderColor: '#488ce7'
    },
    ThreeMonth: {
        color: '#FB952B',
        borderColor: '#FB952B',
        borderRadius: 5,
        borderWidth: 1,
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 5,
        paddingRight: 5
    }
});

export default styles;