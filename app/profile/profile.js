import React, { Component } from 'react';
import { TabNavigator } from 'react-navigation';
import { ProfileListItem } from '../components.js';

let PROFILEDATA;

class ProfileList extends Component {
    _onPressItem(itemTarget) {
        this.props.navigation.navigate({ routeName: itemTarget });
    }
    _renderItem(item) {
        return (
            <ProfileListItem
                itemText={item.itemText}
                onPress={() => _onPressItem(item.itemTarget)}
            />
        )
    }
    render() {
        return(
            <FlatList
                data={this.props.listItems}
                renderItem={this._renderItem}
            />
        )
    }
}

class ProfileForm extends Component {
    
}

class AccountView extends Component {
    constructor() {
        super();
        this.formItems = [
            { 
                itemPlaceholder: PROFILEDATA.username || "Username", 
                itemName: "username",
                itemType: "text"
            },
            {
                itemPlaceholder: PROFILEDATA.email || "Email",
                itemName: "email",
                itemType: "text"
            },
            {
                itemPlaceholder: PROFILEDATA.country || "Nationality",
                itemName: "country",
                itemType: "select"
            },
            {
                itemPlaceholder: PROFILEDATA.allowGifting || "Accept Gifts",
                itemName: "allowGifting",
                itemType: "select"
            },
        ].map((item) => 
            <FormItem 
                type={item.itemType} 
                name={item.itemName} 
                placeholder={item.itemPlaceholder}
            />
        )
    }
    render() {
        return (
            <ProfileForm>
                {this.formItems}
            </ProfileForm>
        )
    }
}

class SubscriptionView extends Component {
    render() {
        return (

        )
    }
}

class AddressView extends Component {
    render() {
        return (

        )
    }
}

class DiscordView extends Component {
    render() {
        return (

        )
    }
}

class MinecraftView extends Component {
    render() {
        return (

        )
    }
}

class ProfileView extends Component {
    constructor() {
        this.state = { loaded: false };
        this.listItems = [
            { itemText: 'Account', itemTarget: 'Account' },
            { itemText: 'Subscription', itemTarget: 'Subscription' },
            { itemText: 'Address', itemTarget: 'Address' },
            { itemText: 'Minecraft', itemTarget: 'Minecraft' },
            { itemText: 'Discord', itemTarget: 'Discord' },
        ];
        fetch("https://www.destiny.gg/api/profile").then((result) => {
            if (response.status !== 200) {
                this.error = true;
            }
            response.json().then((payload) => {
                PROFILEDATA = payload;
                this.setState({ 
                    loaded: true,
                    profileName: payload.profileName,
                    creationDate: payload.creationDate
                });
            })
        }, (error) => {
            this.error = true;
        });
    }
    render() {
        if (!this.state.loaded) {
            return ( <LoadingView/> );
        }
        if (this.error) {
            return ( <ErrorView/> );
        }
        return (
            <View style={styles.ProfileView}>
                <View style={styles.ProfileHeader}>
                    <Text style={styles.ProfileName}>{this.state.profileName}</Text>
                    <Text style={styles.ProfileCreation}>{this.state.creationDate}</Text>
                </View>
                <ProfileList listItems={this.listItems}/>
            </View>
        )
    }
}

const ProfileNav = StackNavigator({
    Profile: { screen: ProfileView },
    Account: { screen: AccountView },
    Subscription: { screen: SubscriptionView },
    Address: { screen: AddressView },
    Discord: { screen: DiscordView },
    Minecraft: { screen: MinecraftView }
}, {
    initialRouteName: 'Profile'
});

export default ProfileNav;