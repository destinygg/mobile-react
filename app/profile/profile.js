import React, { Component } from 'react';
import { View, Text, FlatList, SafeAreaView, ScrollView, Button, Platform, ActivityIndicator, Alert, TouchableHighlight } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { NavList, NavListItem, FormItem } from '../components';
import styles from './styles';

const countries = require("../../lib/assets/countries.json");
const countryOptions = countries.map((item) => {
    return ({ name: item['name'], value: item['alpha-2'] })
});

class ProfileForm extends Component {
    render() {
        const children = this.props.formItems.map((item, index, array) =>
            <FormItem
                item={item}
                value={this.props.formState[item.name]}
                key={item.name}
                first={index === 0}
                last={index === (array.length - 1)}
                onChange={(name, value) => this.props.onChange(name, value)}
            />
        );

        return (
            <View style={[styles.View, styles.List, { marginTop: 15 }]}>
                {children}
            </View>
        )
    }
}

class FormSaveBtn extends Component {
    render() {
        return(
            <View style={{ marginRight: 10 }}>
                <Button title='Save' onPress={this.props.onSave} />
            </View>
        )
    }
}

class FormView extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;

        return {
            headerRight: (params.isSaving) ? 
                <ActivityIndicator /> :
                <FormSaveBtn onSave={params.saveHandler ? params.saveHandler : () => null} />   
        }
    };

    constructor(props) {
        super(props);
        this.me = JSON.parse(JSON.stringify(this.props.screenProps.chat.me)); // deep clone
    }
    _onChange(name, value) {
        let updatedState = {};

        updatedState[name] = value;

        this.setState(updatedState);
    }
    save() {
        const formData = new FormData();
        for (let key in this.state) {
            formData.append(key, this.state[key]);
        }
        this.props.navigation.setParams({ isSaving: true });

        const req = new Request(`https://www.destiny.gg/${this.endpoint}`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        fetch(req).then((response) => {
            if (response.ok) {
                this.props.navigation.goBack();
            } else {
                console.log(response);
                this.showFailAlert();
            }
            this.props.navigation.setParams({ isSaving: false });
        }).catch((error) => {
            this.showFailAlert();
            this.props.navigation.setParams({ isSaving: false });
        });
    }

    showFailAlert() {
        Alert.alert(
            'Account update failed.',
            'Please try again later.',
            [ {text: 'OK', onPress: () => this.props.navigation.goBack()} ],
            { cancelable: false }
        );
    }

    componentDidMount() {
        this.props.navigation.setParams({ saveHandler: () => this.save() });
    }

    render() {
        return (
            <ScrollView style={styles.View}>
                <ProfileForm formItems={this.formItems} onChange={(name, value) => this._onChange} />
            </ScrollView>
        )
    }
}

class AccountView extends FormView {
    constructor(props) {
        super(props);
        this.endpoint = 'profile/update';
        this.state = {
            username: this.me.username,
            email: this.me.email,
            country: this.me.country
        }
        this.formItems = [
            { 
                placeholder: "Username", 
                name: "username",
                type: "text",
                readOnly: true      // need 'changes available' added to /api/me
            },
            {
                placeholder: "Email",
                name: "email",
                type: "text",
            },
            {
                placeholder: "Nationality",
                name: "country",
                type: "select",
                selectOptions: countryOptions,
            },
            /* need this added to /api/me
            {
                placeholder: "Accept Gifts",
                name: "allowGifting",
                type: "select",
                selectOptions: [
                    { name: "Yes, I accept gifts", value: "1" },
                    { name: "No, I do not accept gifts", value: "0" }
                ]
            },*/
        ]; 
    }
    render() {
        return (
            <ScrollView style={styles.View}>
                <ProfileForm formItems={this.formItems} formState={this.state} onChange={(name, value) => this._onChange(name, value)} />
            </ScrollView>
        )
    }
}

class SubscriptionItem extends Component {
    static navigationOptions = {
        title: 'Subscription',
    };

    constructor(props) {
        super(props);
        this.state = {press: false};
    }

    render() {
        const tierColor = 
            (this.props.displayName === "Tier IV") ?
                '#a427d6' :
            (this.props.displayName === "Tier III") ?
                '#0060ff' :
            (this.props.displayName === "Tier II") ?
                '#488ce7' :
            (this.props.displayName === "Tier I") ?
                '#488ce7' :
                null;
        return (
            <TouchableHighlight
                onPress={() => this.props.onSelect(this.props.subId)}
                style={[styles.SubscriptionItem, {borderColor: tierColor}]}
                onPressIn={() => this.setState({press: true})} 
                onPressOut={() => this.setState({press: false})} 
                delayPressOut={100}
                underlayColor={tierColor}
            >
                <View style={{alignItems: 'flex-start', justifyContent:'space-between', flex: 1}}>
                    <View style={{alignItems: 'flex-start'}}>
                        <Text style={[styles.SubscriptionTitle, (this.state.press) ? {color: '#000'} : null]}>{this.props.displayName}</Text>
                        <Text style={[styles.SubscriptionSubtitle, (this.props.duration === '3mo') ? styles.ThreeMonth : null, (this.state.press) ? {color: '#000', borderColor: '#000'} : null ]}>{this.props.duration}</Text>
                    </View>
                    <Text style={[styles.SubscriptionPrice, (this.state.press) ? {color: '#000'} : null]}>{this.props.price}</Text>
                </View>
            </TouchableHighlight>
        )
    }
}

class SubscriptionView extends Component {
    static navigationOptions = {
        title: 'Subscription',
    };

    _onSelect(subId) {
        this.props.navigation.dispatch(NavigationActions.navigate('SubscriptionMessageView', {subId: subId}));
    }

    render() {
        return (
            <SafeAreaView>
                <ScrollView style={styles.SubscriptionView}>
                    <Text style={styles.ChooseTitle}>Choose subscription.</Text>
                    <View style={styles.SubscriptionRow}>
                        <SubscriptionItem subId="1-MONTH-SUB4" displayName="Tier IV" duration="1mo" price="$40" onSelect={this._onSelect} />
                        <SubscriptionItem subId="3-MONTH-SUB4" displayName="Tier IV" duration="3mo" price="$96" onSelect={this._onSelect} />
                    </View>
                    <View style={styles.SubscriptionRow}>
                        <SubscriptionItem subId="1-MONTH-SUB3" displayName="Tier III" duration="1mo" price="$20" onSelect={this._onSelect} />
                        <SubscriptionItem subId="3-MONTH-SUB3" displayName="Tier III" duration="3mo" price="$48" onSelect={this._onSelect} />
                    </View>
                    <View style={styles.SubscriptionRow}>
                        <SubscriptionItem subId="1-MONTH-SUB2" displayName="Tier II" duration="1mo" price="$10" onSelect={this._onSelect} />
                        <SubscriptionItem subId="3-MONTH-SUB2" displayName="Tier II" duration="3mo" price="$24" onSelect={this._onSelect} />
                    </View>
                    <View style={styles.SubscriptionRow}>
                        <SubscriptionItem subId="1-MONTH-SUB" displayName="Tier I" duration="1mo" price="$5" onSelect={this._onSelect} />
                        <SubscriptionItem subId="3-MONTH-SUB" displayName="Tier I" duration="3mo" price="$12" onSelect={this._onSelect} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

class SubscriptionMessageView extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;

        return {
            headerRight: <View style={{ marginRight: 10 }}>
                            <Button title='Continue' onPress={params.saveHandler ? params.saveHandler : () => null} />
                        </View>   
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            message: "",
            gift: "",
            giftBool: false,
            renew: false
        }
    }

    _onChange(name, value) {
        let updatedState = {};

        updatedState[name] = value;

        if (name === 'giftBool' && value === false && this.state.gift !== "") {
            updatedState['gift'] = "";
        } else if (name === 'giftBool' && value === true) {
            Alert.alert('Warning', 'If the giftee has a subscription by the time this payment\
                is completed the subscription will be marked as failed, but your payment will\
                still go through.');
        }

        this.setState(updatedState);
    }

    save() {
        let params = {
            subId: this.props.navigation.state.params.subId,
            message: this.state.message
        }

        if (this.state.giftBool) {
            params['gift'] = this.state.gift;
        } else {
            params['gift'] = "";
        }

        this.props.navigation.dispatch(
            NavigationActions.navigate('SubscriptionWebView', params)
        )
    }

    render() {
        this.formItems = [
            { 
                placeholder: "Subscription message", 
                name: "message",
                type: "text",
                multiline: true,
                spacer: true
            },
            {
                tag: 'Renew',
                name: 'renew',
                type: 'switch',
                spacer: true
            },
            {
                tag: 'Gift',
                name: 'giftBool',
                type: 'switch'
            }
        ];

        if (this.state.giftBool) {
            this.formItems.splice(2, 0, {
                placeholder: "Username",
                name: "gift",
                type: "text"
            });
        }

        return (
            <SafeAreaView>
                <ScrollView>
                    <ProfileForm formItems={this.formItems} formState={this.state} onChange={(name, value) => this._onChange(name, value)} />
                    <Text style={styles.SubscriptionTerms}>
                        By clicking the "Continue" button, you are confirming that this purchase is 
                        what you wanted and that you have read the <Text onPress={_showUserAgreement}>user agreement.</Text> 
                    </Text>
                </ScrollView>
            </SafeAreaView>
        )
    }

    componentDidMount() {
        this.props.navigation.setParams({ saveHandler: () => this.save() });
    }
}

class SubscriptionWebView extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { navigation } = this.props;        
        const formData = new FormData();
        formData.append('subscription', navigation.state.params.subId);
        formData.append('gift', navigation.state.params.gift);
        formData.append('sub-message', navigation.state.params.message);
        formData.append('renew', navigation.state.params.renew);

        return (
            <WebView
                source={{
                    uri: `https://www.destiny.gg/subscription/create`,
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                }}
                style={{ backgroundColor: '#000' }}
                onNavigationStateChange={e => {
                    console.log(e);
                    if (e.loading == false && e.url.indexOf('destiny.gg') != -1) {
                        if (e.url.indexOf('error') != -1) {
                            Alert.alert('Error', 'Could not complete subscription. \
                                                  Try again later.');
                            this.props.navigation.dispatch(NavigationActions.back());                                                                                
                        } else if (e.url.indexOf('complete') != -1) {
                            Alert.alert('Success', 'Subscription complete.');
                            this.props.navigation.dispatch(NavigationActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({ routeName: 'ProfileView'}),
                                ]
                            }));                                                    
                        }
                    }
                }}
            />
        );
    }
}

class DiscordView extends FormView {
    static navigationOptions = {
        title: 'Discord',
    };
    constructor(props) {
        super(props);
        this.endpoint = 'profile/discord/update';        
        this.formItems = [
            {
                placeholder: "Discord name and ID (e.g., Destiny#123)",
                name: "discordname",
                type: "text"
            }
        ];
    }
}

class ProfileView extends Component {
    static navigationOptions = {
        title: 'Profile',
    };
    render() {
        this.listItems = [
            { itemText: 'Account', itemTarget: 'Account' },
            { itemText: 'Subscription', itemTarget: 'Subscription' },
            { itemText: 'Discord', itemTarget: 'Discord' }
        ];
        return (
            <ScrollView style={styles.View}>
                <View style={styles.ProfileHeader}>
                    <Text style={styles.ProfileName}>{this.props.screenProps.chat.user.username}</Text>
                </View>
                <NavList listItems={this.listItems} navigation={this.props.navigation}/>
            </ScrollView>
        )
    }
}

const ProfileNav = StackNavigator({
    Profile: { screen: ProfileView },
    Account: { screen: AccountView },
    Subscription: { screen: SubscriptionView },
    SubscriptionMessageView: { screen: SubscriptionMessageView },
    SubscriptionWebView: { screen: SubscriptionWebView },
    Discord: { screen: DiscordView },
}, {
    initialRouteName: 'Profile',
    navigationOptions: {
        headerStyle: styles.Navigation,
        headerTitleStyle: styles.NavigationHeaderTitle,
        headerTintColor: (Platform.OS === 'android') ? '#fff' : undefined
    },
    cardStyle: styles.View
});

export default ProfileNav;