import React, { Component } from 'react';
import { TabNavigator } from 'react-navigation';

class AccountTab extends Component {

}

class SubscriptionTab extends Component {

}

class AddressTab extends Component {

}

class SocialTab extends Component {

}

const ProfileView = TabNavigator({
    Account: { screen: AccountTab },
    Subscription: { screen: SubscriptionTab },
    Address: { screen: AddressTab },
    Social: { screen: SocialTab }
});

export default ProfileView;