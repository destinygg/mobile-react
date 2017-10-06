import React, { Component } from 'react';
import { TabNavigator } from 'react-navigation';

class ProfileStack extends Component {
    render() {

    }
}

class AccountTab extends Component {
    render() {
        return (

        )
    }
}

class SubscriptionTab extends Component {
    render() {
        return (

        )
    }
}

class AddressTab extends Component {
    render() {
        return (

        )
    }
}

class SocialTab extends Component {
    render() {
        return (

        )
    }
}

const ProfileView = TabNavigator({
    Account: { screen: AccountTab },
    Subscription: { screen: SubscriptionTab },
    Address: { screen: AddressTab },
    Social: { screen: SocialTab }
});

export default ProfileView;