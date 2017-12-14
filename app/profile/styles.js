import { StyleSheet } from 'react-native';
import { inheritedStyles, shortDimension, h1, h2, h3 } from '../styles';

const styles = StyleSheet.create({
    ...inheritedStyles,
    ProfileHeader: {
        marginLeft: 15,
        marginBottom: 25,
        marginTop: 25
    },
    ProfileName: {
        color: "#fff",
        fontSize: h1,
    },
    SubscriptionItem: {
        flex: 1,
        borderRadius: 5,
        borderWidth: 2,
        height: (shortDimension-48)/2*.9,  // logical width - surrounding margins
        margin: 8,                        // divided by half, adjusted for perception
        padding: 10
    },
    ChooseTitle: {
        fontSize: h2,
        fontWeight: '700',
        color: "#fff",
        marginTop: 25,
        marginBottom: 10,        
        marginLeft: 15     
    },
    ChooseSubtitle: {
        fontWeight: '500',
        color: '#fff',
        marginTop: 10,
        marginLeft: 15
    },
    SubscribedTile: {
        alignContent: 'center',
        marginTop: 25,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.7,
        shadowRadius: 5
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
        fontSize: h1,
        fontWeight: '700',
        color: '#fff'
    },
    SubscriptionSubtitle: {
        fontSize: h3,
        marginTop: 5,
        fontWeight: '300',
        color: '#fff'
    },
    SubscriptionPrice: {
        fontSize: h2,
        fontWeight: '700',
        color: '#fff',
        alignSelf: 'flex-end'
    },
    ProfileCreated: {
        fontSize: h3,
        color: '#888'
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