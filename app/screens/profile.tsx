import { IFormItem } from 'components/forms/FormItem';
import moment from 'moment';
import React, { Component } from 'react';
import { Alert, Button, Platform, ScrollView, Text, TouchableHighlight, View, WebView } from 'react-native';
import {
    HeaderBackButton,
    NavigationActions,
    NavigationScreenProp,
    NavigationScreenProps,
    SafeAreaView,
    StackNavigator,
} from 'react-navigation';

import { ListButton, ListButtonProps } from 'components/forms/ButtonList';
import FormView, { FormViewProps, FormViewState, ProfileForm } from 'components/forms/FormView';
import { NavList } from 'components/NavList';
import { UserAgreement } from 'components/UserAgreement';
import AboutView from './AboutView';
import { h3, Palette, shortDimension, h2, h1 } from 'assets/constants';

const countries = require("../../lib/assets/countries.json");
const countryOptions = countries.map((item: any) => {
    return ({ name: item['name'], value: item['alpha-2'] })
});

const { MobileChat } = require("../chat/chat"); 

class AccountView extends FormView {
    endpoint: string;
    formState: FormViewState;
    formItems: IFormItem[];
    constructor(props: FormViewProps) {
        super(props);
        this.endpoint = 'profile/update';
        this.formState = {items: {
            username: MobileChat.current.me.username,
            email: MobileChat.current.me.email,
            country: MobileChat.current.me.country
        }};
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
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: Palette.background
            }}>
                <ScrollView style={{
                flex: 1,
                backgroundColor: Palette.background
            }}>
                    <ProfileForm formItems={this.formItems} formState={this.state} onChange={this._onChange.bind(this)} />
                </ScrollView>
            </SafeAreaView>
        )
    }
}

interface SubscriptionItemProps {
    displayName: string;
    subId?: string;
    price?: string;
    duration: string;
    alreadySubscribed?: boolean;
    onSelect?: {(subId: string, displayName: string, duration: string): any};
}

class SubscriptionItem extends Component<SubscriptionItemProps, {press: boolean}> {
    static navigationOptions = {
        title: 'Subscription',
    };

    constructor(props: SubscriptionItemProps) {
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
            (this.props.displayName === "Tier I" || this.props.displayName === "Twitch") ?
                '#488ce7' :
                undefined;
        return (
            <TouchableHighlight
                onPress={() => this.props.onSelect && 
                    this.props.subId &&
                    this.props.onSelect(this.props.subId, this.props.displayName, this.props.duration)}
                style={{
                    flex: 1,
                    borderRadius: 5,
                    borderWidth: 2,
                    height: (shortDimension-48)/2*.9,  // surrounding margins
                    margin: 8,                        // divided by half, adjusted for perception
                    padding: 10,
                    borderColor: tierColor
                }}
                onPressIn={() => this.setState({press: true})} 
                onPressOut={() => this.setState({press: false})} 
                delayPressOut={100}
                underlayColor={tierColor}
            >
                <View style={{alignItems: 'flex-start', justifyContent:'space-between', flex: 1}}>
                    <View style={{alignItems: 'flex-start'}}>
                        <Text style={{
                            alignContent: 'center',
                            marginTop: 25,
                            elevation: 4,
                            shadowColor: '#000',
                            shadowOpacity: 0.7,
                            shadowRadius: 5,
                            color: this.state.press ? '#000' : undefined
                        }}>
                            {this.props.displayName}
                        </Text>
                        <Text style={[{
                            fontSize: h3,
                            marginTop: 5,
                            fontWeight: '300',
                            color: this.state.press ? '#000' : '#fff',
                            borderColor: this.state.press ? '#000' : undefined
                        },
                        (this.props.duration === '3mo' || this.props.alreadySubscribed) 
                            ? {
                                color: '#FB952B',
                                borderColor: '#FB952B',
                                borderRadius: 5,
                                borderWidth: 1,
                                paddingTop: 2,
                                paddingBottom: 2,
                                paddingLeft: 5,
                                paddingRight: 5
                            }: undefined
                        ]}>
                            {this.props.duration}
                        </Text>
                    </View>
                    {!this.props.alreadySubscribed &&
                        <Text style={{
                            fontSize: h2,
                            fontWeight: '700',
                            color: this.state.press ? "#000" : '#fff',
                            alignSelf: 'flex-end'
                        }}>
                            {this.props.price}
                        </Text>                    
                    }
                </View>
            </TouchableHighlight>
        )
    }
}

class SubscriptionView extends Component<NavigationScreenProps> {
    static navigationOptions = {
        title: 'Subscription',
        drawerLockMode: 'locked-closed'        
    };

    _onSelect(subId: string, subName: string, subDuration: string) {
        this.props.navigation.navigate('SubscriptionMessageView', {subId: subId, subName: subName, subDuration: subDuration});
    }

    render() {
        const features = this.props.screenProps!.chat.me.features;

        if (features.indexOf('subscriber') === -1) {
            return (
                <SafeAreaView style={{
                flex: 1,
                backgroundColor: Palette.background
            }}>
                    <ScrollView style={{flex: 1}}>
                        <Text style={{
                            fontSize: h2,
                            fontWeight: '700',
                            color: Palette.title,
                            marginTop: 25,
                            marginBottom: 10,        
                            marginLeft: 15     
                        }}>
                            Choose subscription.
                        </Text>
                        <View style={ {
                            flex: 1,
                            flexDirection: 'row',
                            marginLeft: 8,
                            marginRight: 8,
                            marginTop: 0,
                            marginBottom: 0,
                        }}>
                            <SubscriptionItem
                                subId="1-MONTH-SUB4" 
                                displayName="Tier IV"
                                duration="1mo" 
                                price="$40"
                                onSelect={(id, name, duration) => this._onSelect(id, name, duration)}
                            />
                            <SubscriptionItem
                                subId="3-MONTH-SUB4" 
                                displayName="Tier IV"
                                duration="3mo" 
                                price="$96"
                                onSelect={(id, name, duration) => this._onSelect(id, name, duration)}
                            />
                        </View>
                        <View style={ {
                            flex: 1,
                            flexDirection: 'row',
                            marginLeft: 8,
                            marginRight: 8,
                            marginTop: 0,
                            marginBottom: 0,
                        }}>
                            <SubscriptionItem
                                subId="1-MONTH-SUB3" 
                                displayName="Tier III"
                                duration="1mo" 
                                price="$20"
                                onSelect={(id, name, duration) => this._onSelect(id, name, duration)}
                            />
                            <SubscriptionItem
                                subId="3-MONTH-SUB3" 
                                displayName="Tier III"
                                duration="3mo" 
                                price="$48"
                                onSelect={(id, name, duration) => this._onSelect(id, name, duration)}
                            />
                        </View>
                        <View style={ {
                            flex: 1,
                            flexDirection: 'row',
                            marginLeft: 8,
                            marginRight: 8,
                            marginTop: 0,
                            marginBottom: 0,
                        }}>
                            <SubscriptionItem
                                subId="1-MONTH-SUB2" 
                                displayName="Tier II"
                                duration="1mo" 
                                price="$10"
                                onSelect={(id, name, duration) => this._onSelect(id, name, duration)}
                            />
                            <SubscriptionItem
                                subId="3-MONTH-SUB2" 
                                displayName="Tier II"
                                duration="3mo" 
                                price="$24"
                                onSelect={(id, name, duration) => this._onSelect(id, name, duration)}
                            />
                        </View>
                        <View style={ {
                            flex: 1,
                            flexDirection: 'row',
                            marginLeft: 8,
                            marginRight: 8,
                            marginTop: 0,
                            marginBottom: 0,
                        }}>
                            <SubscriptionItem
                                subId="1-MONTH-SUB" 
                                displayName="Tier I"
                                duration="1mo" 
                                price="$5"
                                onSelect={(id, name, duration) => this._onSelect(id, name, duration)}
                            />
                            <SubscriptionItem
                                subId="3-MONTH-SUB" 
                                displayName="Tier I"
                                duration="3mo" 
                                price="$12"
                                onSelect={(id, name, duration) => this._onSelect(id, name, duration)}
                            />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            )
        } else {
            let subscribedItem;

            if (features.indexOf('flair8') != -1) {
                subscribedItem = 
                    <SubscriptionItem 
                        displayName="Tier IV"
                        duration="Subscribed" alreadySubscribed={true}
                    />;
            } else if (features.indexOf('flair3') != -1) {
                subscribedItem = 
                    <SubscriptionItem 
                        displayName="Tier III"
                        duration="Subscribed" alreadySubscribed={true}
                    />;
            } else if (features.indexOf('flair1') != -1) {
                subscribedItem = 
                    <SubscriptionItem 
                        displayName="Tier II"
                        duration="Subscribed" alreadySubscribed={true}
                    />;
            } else if (features.indexOf('flair13') != -1) {
                subscribedItem = 
                    <SubscriptionItem 
                        displayName="Tier I"
                        duration="Subscribed" alreadySubscribed={true}
                    />;
            } else if (features.indexOf('flair9') != -1) {
                subscribedItem = 
                    <SubscriptionItem 
                        displayName="Twitch"
                        duration="Subscribed" alreadySubscribed={true}
                    />;
            }
            return (
                <SafeAreaView style={{
                flex: 1,
                backgroundColor: Palette.background
            }}>
                    <ScrollView style={{flex: 1}}>
                        <Text style={{
                            fontSize: h2,
                            fontWeight: '700',
                            color: Palette.title,
                            marginTop: 25,
                            marginBottom: 10,        
                            marginLeft: 15     
                        }}>
                            Subscribed
                        </Text>
                        <Text style={{
                            fontWeight: '500',
                            color: Palette.title,
                            marginTop: 10,
                            marginLeft: 15
                        }}>
                            Visit site in browser to manage subscription.
                        </Text>
                        <View style={{
                            alignContent: 'center',
                            marginTop: 25,
                            elevation: 4,
                            shadowColor: '#000',
                            shadowOpacity: 0.7,
                            shadowRadius: 5
                        }}>
                            {subscribedItem}
                        </View>  
                    </ScrollView>
                </SafeAreaView>
            )
        }
    }
}

interface SubscriptionMessageViewProps {
    navigation: NavigationScreenProp<{params: any}>
}

interface SubscriptionMessageViewState {
    message: string;
    gift: string;
    giftBool: boolean;
    renew: boolean;
}

class SubscriptionMessageView extends Component<SubscriptionMessageViewProps, SubscriptionMessageViewState> {
    subDisplayName: string;
    subDuration: string;
    formItems: IFormItem[] = [];

    static navigationOptions = ({ navigation }: {navigation: NavigationScreenProp<{params: any}>}) => {
        const params = navigation.state.params;

        return {
            headerRight: <View style={{
                            marginRight: (Platform.OS == 'ios') ? 5 : 15
                        }}>
                            <Button title='Pay' onPress={params.saveHandler ? params.saveHandler : () => null} />
                        </View>,
            drawerLockMode: 'locked-closed'            
        }
    };

    constructor(props: SubscriptionMessageViewProps) {
        super(props);

        this.state = {
            message: "",
            gift: "",
            giftBool: false,
            renew: false
        }

        this.subDisplayName = this.props.navigation.state.params.subName;
        this.subDuration = this.props.navigation.state.params.subDuration;
    }

    _onChange(name: string, value: any) {
        let updatedState: any = {};

        updatedState[name] = value;

        if (name === 'giftBool' && value === false && this.state.gift !== "") {
            updatedState['gift'] = "";
        } else if (name === 'giftBool' && value === true) {
            Alert.alert('Warning', `If the giftee has a subscription by the time this payment\
 is completed the subscription will be marked as failed, but your payment will\
 still go through.`);
        }

        this.setState(updatedState);
    }

    _showUserAgreement() {
        this.props.navigation.navigate('UserAgreement');
    }

    save() {
        let params: any = {
            subId: this.props.navigation.state.params.subId,
            message: this.state.message,
            renew: this.state.renew
        }

        if (this.state.giftBool) {
            params['gift'] = this.state.gift;
        } else {
            params['gift'] = "";
        }

        if (this.state.giftBool && this.state.gift === "") {
            Alert.alert('Missing field data.', 'No gift recipient specified.');
        } else {
            this.props.navigation.navigate('SubscriptionWebView', params);            
        }
    }

    render() {
        this.formItems = [
            { 
                placeholder: "Subscription message", 
                name: "message",
                type: "text",
                multiline: true,
                spacer: true,
                maxLength: 250
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
            this.formItems.push({
                placeholder: "Username",
                name: "gift",
                type: "text"
            });
        }

        return (
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: Palette.background
            }}>
                <ScrollView style={[{
                flex: 1,
                backgroundColor: Palette.background
            }, {paddingTop: 25}]}>
                    <View style={{marginLeft: 15}}>
                        <Text style={ {
                            fontSize: h1,
                            fontWeight: '700',
                            color: Palette.title
                        }}>{this.subDisplayName}</Text>
                        <Text style={{
                            fontSize: h3,
                            marginTop: 5,
                            fontWeight: '300',
                            color: Palette.title
                        }}>
                            {this.subDuration}
                        </Text>
                    </View>
                    <ProfileForm formItems={this.formItems} formState={this.state} onChange={(name, value) => this._onChange(name, value)} />
                    <Text style={{
                        color: Palette.handleLine,
                        fontSize: 12,
                        margin: 15
                    }}>
                        By clicking the "Pay" button, you are confirming that this purchase is 
                        what you wanted and that you have read the 
                        <Text 
                            onPress={() => this._showUserAgreement()} 
                            style={{color: Palette.link}}
                        >
                            user agreement.
                        </Text> 
                    </Text>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

interface SubscriptionWebViewProps {
    navigation: NavigationScreenProp<{params: any}>;
}

class SubscriptionWebView extends Component<SubscriptionWebViewProps> {
    body: string;

    static navigationOptions = {
        drawerLockMode: 'locked-closed'        
    };
    constructor(props: SubscriptionWebViewProps) {
        super(props);
        const { navigation } = this.props;   

        const formData: any = {
            subscription: navigation.state.params.subId,
            gift: navigation.state.params.gift,
            'sub-message': navigation.state.params.message,
            'renew': navigation.state.params.renew
        };
        
        /* fetch() + pass html string into webview doesn't work, as
           paypal doesn't like the change in useragent.  construct
           formdata manually.
        */
        this.body = Object.keys(formData).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(formData[key]);
        }).join('&').replace(/%20/g, '+');
    }
    render() {
        return (
            <WebView
                source={{
                    uri: `https://www.destiny.gg/subscription/create`,
                    method: 'POST',
                    body: this.body
                }}
                startInLoadingState={true}
                style={{ backgroundColor: '#000' }}
                onNavigationStateChange={e => {
                    if (e.url && e.loading == false && e.url.indexOf('destiny.gg') != -1) {
                        if (e.url.indexOf('error') != -1) {
                            Alert.alert('Error', 'Could not complete subscription. \
                                                  Try again later.');
                            this.props.navigation.goBack();                                                                                
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

class SettingsView extends FormView {
    formItems: IFormItem[];

    static navigationOptions: any = ({ navigation }: {
        navigation: NavigationScreenProp<{ params: any, routeName: any }>
    }) => {
        return {title: "Settings"};
    };

    constructor(props: FormViewProps) {
        super(props);
        this.state = Object.assign({}, MobileChat.current.mobileSettings);
        console.log(this.state);
        this.formItems = [
            {
                tag: "Show chat timestamp",
                name: "chatTimestamp",
                type: "switch",
            },
            {
                tag: "Open media in modal",
                name: "mediaModal",
                type: "switch",
            },
            {
                tag: "Close emote drawer on select",
                name: "emoteDirLoseFocus",
                type: "switch",
            },
            {
                tag: "Control menu drawer with button",
                name: "menuDrawerButton",
                type: "switch"
            }
        ];
    }
    _onChange(name: string, value: any) {
        let updatedState: any = {};
        updatedState[name] = value;
        this.setState(updatedState);

        MobileChat.current.setMobileSetting(name, value);
    }
    render() {
        return (
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: Palette.background
            }}>
                <ScrollView style={{
                flex: 1,
                backgroundColor: Palette.background
            }}>
                    <ProfileForm formItems={this.formItems} formState={this.state} onChange={(name, value) => this._onChange(name, value)} />
                </ScrollView>
            </SafeAreaView>
        )
    }

    componentWillUnmount() {
        MobileChat.current.saveMobileSettings();
    }
}

class ProfileView extends Component<NavigationScreenProps> {
    listItems: ListButtonProps[];
    static navigationOptions = ({ navigation }: any) => {
        const { params = {} } = navigation.state;

        return {
            title: 'Profile',        
            headerLeft: <HeaderBackButton title='Back' onPress={() => params.backHandler(null)} />,
            headerTintColor: Palette.navBorder
        }
    };

    constructor(props: NavigationScreenProps) {
        super(props);
        
        this.listItems = [
            { name: 'Account' },
        ];
        if (Platform.OS != 'ios') {
            this.listItems.push({ name: 'Subscription' });
        }
        this.listItems.push({ name: 'Settings' });
    }

    render() {
        const created = moment(MobileChat.current.me.createdDate);

        return (
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: Palette.background
            }}>
                <ScrollView contentContainerStyle={[{
                flex: 1,
                backgroundColor: Palette.background
            }]}>
                    <View style={{
                        marginLeft: 15,
                        marginBottom: 25,
                        marginTop: 25
                    }}>
                        <Text style={{
                            color: Palette.title,
                            fontSize: h1,
                        }}>
                            {MobileChat.current.user.username}
                        </Text>
                        <Text style={{
                            fontSize: h3,
                            color: '#888'
                        }}>
                            {'Member since: ' + created.format('dddd, D MMMM YYYY')}
                        </Text>
                    </View>
                    <NavList listItems={this.listItems} onPress={(item) => {
                        this.props.navigation.navigate(item.name)
                    }}/>
                    <ListButton 
                        name='About'
                        first={true} 
                        last={true} 
                        onPress={() => this.props.navigation.navigate('About')} 
                        style={{marginTop: 50}}
                    />
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const ProfileNav = StackNavigator({
    Profile: { screen: ProfileView },
    Account: { screen: AccountView },
    Subscription: { screen: SubscriptionView },
    SubscriptionMessageView: { screen: SubscriptionMessageView },
    SubscriptionWebView: { screen: SubscriptionWebView },
    UserAgreement: { screen: UserAgreement },
    Settings: { screen: SettingsView },
    About: { screen: AboutView }
}, {
    initialRouteName: 'Profile',
    navigationOptions: {
        headerStyle: {
            backgroundColor: Palette.inner,
            borderColor: Palette.navBorder,
            borderStyle: "solid"
        },
        headerTitleStyle: {
            color: Palette.title
        },
        headerTintColor: (Platform.OS === 'android') ? '#fff' : undefined
    },
    cardStyle: {
                flex: 1,
                backgroundColor: Palette.background
            }
});

export default ProfileNav;