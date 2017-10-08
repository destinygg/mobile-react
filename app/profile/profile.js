import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { ProfileListItem, FormItem } from '../components.js';
import styles from './styles.js';

const countries = require("../../lib/assets/countries.json");
const countryOptions = countries.map((item) => {
    return ({ itemName: item['name'], itemValue: item['alpha-2'] })
});

let PROFILEDATA = {
    username: "Destiny",
    email: "steven.bonnell.ii@gmail.com",
    allowGifting: "1",
    country: "US"
};

class ProfileList extends Component {
    _onPressItem(itemTarget) {
        this.props.navigation.navigate(itemTarget);
    }
    _renderItem({ item }) {
        return (
            <ProfileListItem
                itemText={item.itemText}
                itemTarget={item.itemTarget}
                onPress={this._onPressItem.bind(this)}
            />
        )
    }
    render() {
        return(
            <FlatList
                data={this.props.listItems}
                renderItem={this._renderItem.bind(this)}
            />
        )
    }
}

class ProfileForm extends Component {
    render() {
        return (
            <View style={styles.ProfileForm}>
                {this.props.children}
            </View>
        )
    }
}

class AccountView extends Component {
    constructor() {
        super();
        this.formItems = [
            { 
                itemValue: PROFILEDATA.username,
                itemPlaceholder: "Username", 
                itemName: "username",
                itemType: "text"
            },
            {
                itemValue: PROFILEDATA.email,
                itemPlaceholder: "Email",
                itemName: "email",
                itemType: "text"
            },
            {
                itemValue: PROFILEDATA.country,
                itemPlaceholder: "Nationality",
                itemName: "country",
                itemType: "select",
                selectOptions: countryOptions
            },
            {
                itemValue: PROFILEDATA.allowGifting,
                itemPlaceholder: "Accept Gifts",
                itemName: "allowGifting",
                itemType: "select",
                selectOptions: [
                    { itemName: "Yes, I accept gifts", itemValue: "1" },
                    { itemName: "No, I do not accept gifts", itemValue: "0" }
                ]
            },
        ].map((item) => 
            <FormItem 
                type={item.itemType} 
                name={item.itemName}
                value={item.itemValue} 
                placeholder={item.itemPlaceholder}
                selectOptions={item.selectOptions}
                key={item.itemName}
            />
        );
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
            <View />
        )
    }
}

class AddressView extends Component {
    constructor() {
        super();
        this.formItems = [
            {
                itemValue: PROFILEDATA.fullName,
                itemPlaceholder: "Full Name",
                itemName: "fullName",
                itemType: "text"
            },
            {
                itemValue: PROFILEDATA.line1,
                itemPlaceholder: "Address Line 1",
                itemName: "line1",
                itemType: "text"
            },
            {
                itemValue: PROFILEDATA.line2,
                itemPlaceholder: "Address Line 2",
                itemName: "line2",
                itemType: "text"
            },
            {
                itemValue: PROFILEDATA.city,
                itemPlaceholder: "City",
                itemName: "city",
                itemType: "text"
            },
            {
                itemValue: PROFILEDATA.region,
                itemPlaceholder: "Region",
                itemName: "region",
                itemType: "text"
            },
            {
                itemValue: PROFILEDATA.zip,
                itemPlaceholder: "Postal Code",
                itemName: "zip",
                itemType: "text"
            },
            {
                itemValue: PROFILEDATA.country,
                itemPlaceholder: "Country",
                itemName: "country",
                itemType: "select",
                selectOptions: countryOptions
            }
        ].map((item) =>
            <FormItem
                type={item.itemType}
                name={item.itemName}
                value={item.itemValue}
                placeholder={item.itemPlaceholder}
            />
        );
    }
    render() {
        return (
            <ProfileForm>
                {this.formItems}
            </ProfileForm>
        )
    }
}

class DiscordView extends Component {
    constructor() {
        super();
        this.formItems = [
            {
                itemValue: PROFILEDATA.discordname,
                itemPlaceholder: "Discord name and ID (e.g., Destiny#123)",
                itemName: "discordname",
                itemType: "text"
            }
        ].map((item) =>
            <FormItem
                type={item.itemType}
                name={item.itemName}
                value={item.itemValue}
                placeholder={item.itemPlaceholder}
            />
        );
    }
    render() {
        return (
            <ProfileForm>
                {this.formItems}
            </ProfileForm>
        )
    }
}

class MinecraftView extends Component {
    constructor() {
        super();
        this.formItems = [
            {
                itemValue: PROFILEDATA.minecraftname,
                itemPlaceholder: "Minecraft name",
                itemName: "minecraftname",
                itemType: "text"
            }
        ].map((item) =>
            <FormItem
                type={item.itemType}
                name={item.itemName}
                value={item.itemValue}
                placeholder={item.itemPlaceholder}
            />
        );
    }
    render() {
        return (
            <ProfileForm>
                {this.formItems}
            </ProfileForm>
        )
    }
}

class ProfileView extends Component {
    constructor() {
        super();
        this.state = { loaded: false };
        this.listItems = [
            { itemText: 'Account', itemTarget: 'Account' },
            { itemText: 'Subscription', itemTarget: 'Subscription' },
            { itemText: 'Address', itemTarget: 'Address' },
            { itemText: 'Minecraft', itemTarget: 'Minecraft' },
            { itemText: 'Discord', itemTarget: 'Discord' },
        ];
        /*
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
        });*/
    }
    render() {
        /*if (!this.state.loaded) {
            return ( <LoadingView /> );
        }
        if (this.error) {
            return ( <ErrorView /> );
        }*/
        return (
            <View style={styles.ProfileView}>
                <View style={styles.ProfileHeader}>
                    <Text style={styles.ProfileName}>{this.state.profileName}</Text>
                    <Text style={styles.ProfileCreation}>{this.state.creationDate}</Text>
                </View>
                <ProfileList listItems={this.listItems} navigation={this.props.navigation}/>
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