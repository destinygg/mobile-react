import React, { Component } from 'react';
import { View, Text, TextInput, Picker, Modal, Button, TouchableHighlight, StyleSheet, Platform, Switch, WebView } from 'react-native';
import styles from './styles';

export class BottomDrawer extends Component {
    constructor(props) {
        super(props);
        this.lastVelocity = 0;
        this.contentY = null;
    }
    _onDrag(nativeEvent) {
        if (nativeEvent.contentOffset.y < this.minOpenDragY &&
          nativeEvent.velocity.y < this.minOpenDragVelocity) {
            this.openDrawer();
        } else {
            this.closeDrawer();
        }
    }
    _onMomentum(nativeEvent) {
        if (nativeEvent.contentOffset.y < this.minOpenMomentumY &&
          nativeEvent.velocity.y < this.minOpenMomentumVelocity) {
              this.openDrawer(nativeEvent.velocity.y);
        } else {
            this.closeDrawer(nativeEvent.velocity.y);            
        }
    }
    _onStart(nativeEvent) {
        if (this.contentY !== null && 
          nativeEvent.contentOffset.y < this.contentY) {
            return false;
        } else {
            return true;            
        }
    }
    openDrawer(velocity) {
        if (velocity === undefined) {
            velocity = (this.props.defaultVelocity === undefined) ? 
                    1.25 :
                    this.props.defaultVelocity;
        }
        this.scrollView.scrollTo({y: this.openY, velocity: velocity});
    }
    closeDrawer(velocity) {
        if (velocity === undefined) {
            velocity = this.defaultVelocity;
        }
        this.scrollView.scrollTo({y: this.openY, velocity: velocity});
    }
    render() {
        return (
            <ScrollView
                scrollEnabled={this.props.locked}
                scrollsToTop={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                onMomentumScrollBegin={(e) => this._onMomentum(e.nativeEvent)}
                onScrollEndDrag={(e) => this._onDrag(e.nativeEvent)}
                onContentSizeChange={(width, height) => {
                    this.contentY = height;
                }}
                onStartShouldSetResponder={(e) => this._onStart(e.nativeEvent)}
                contentContainerStyle={{paddingTop: this.contentY - this.props.showingOffset}}
            >
                {this.props.children}
            </ScrollView>
        )
    }
}

export class ListButton extends Component {
    render() {
        let outerStyle = [styles.ListItemOuter];
        let innerStyle = [styles.ListItemInner];

        if (this.props.first) { 
            outerStyle.push(styles.firstInList); 
        }

        if (this.props.last) { 
            outerStyle.push(styles.lastInList); 
            innerStyle.push(styles.innerLastInList); 
        }

        if (this.props.style) {
            outerStyle.push(this.props.style);
        }

        return (
            <TouchableHighlight onPress={() => this.props.onPress()} style={outerStyle}>
                <View style={innerStyle}>
                    <Text style={styles.ListItemText}>
                        {this.props.text}
                    </Text>
                </View>
            </TouchableHighlight>
        )
    }
}

export class TextInputListItem extends Component {
    constructor(props) {
        super(props);
        this.state = { value: this.props.value };
    }
    render() {
        let outerStyle = [styles.ListItemOuter];
        let innerStyle = [styles.FormItem];

        if (this.props.first) {
            outerStyle.push(styles.firstInList);
        }

        if (this.props.last) {
            outerStyle.push(styles.lastInList);
            innerStyle.push(styles.innerLastInList);
        }

        if (this.props.readOnly) {
            innerStyle.push(styles.FormItemDisabled);
        }

        if (this.props.multiline) {
            innerStyle.push({minHeight: 100});
        }

        return (
            <View style={outerStyle}>
                <TextInput
                    style={innerStyle}
                    value={this.state.value}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={'#888'}
                    editable={(this.props.readOnly) === true ? false : true}
                    onChangeText={(value) => {
                        this.setState({ value: value });
                        this.props.onChange(this.props.name, value);
                    }}
                    underlineColorAndroid='#222'
                    multiline={this.props.multiline}
                    keyboardAppearance='dark'
                    maxLength={this.props.maxLength}
                />
            </View>
        )
    }
}

export class ButtonList extends Component {
    render() {
        const children = this.props.listItems.map((item, index, array) => {
            return (
                <ListButton
                    text={item.itemText}
                    onPress={() => item.itemTarget()}
                    key={index}
                    first={index === 0}
                    last={index === (array.length - 1)}
                    style={this.props.listButtonStyle}
                />
            );
        });

        return (
            <View style={styles.List}>
                {children}
            </View>
        )
    }
}

export class NavList extends ButtonList {
    _onPressItem(itemTarget) {
        this.props.navigation.navigate(itemTarget);
    }
    render() {
        const children = this.props.listItems.map((item, index, array) => {
            return (
                <ListButton
                    text={item.itemText}
                    onPress={() => this._onPressItem(item.itemTarget)}
                    key={index}
                    first={index === 0}
                    last={index === (array.length - 1)}
                />
            );
        });

        return (
            <View style={styles.List}>
                {children}
            </View>
        )
    }
}

export class SelectModal extends Component {
    constructor(props) {
        super(props);
        this.state = { shown: false, value: this.props.value };
    }

    _onSelect() {
        this.props.onSelect(this.props.name, this.state.value);
        this.setState({ shown: false });
    }

    show() {
        this.setState({ shown: true });
    }

    hide() {
        this.setState({ shown: false });
    }

    render() {
        const selectOptions = this.props.selectOptions.map((item) =>
            <Picker.Item label={item.name} value={item.value} key={item.value} />
        );
        return (
            <Modal 
                animationType='slide' 
                transparent={ true } 
                visible={ this.state.shown } 
                onRequestClose= {() => this.hide() } 
            >
                <View style={ styles.SelectModalOuter }>
                    <View style={ styles.SelectModalInner }>
                        <View style={ styles.SelectModalHeader }>
                            <Button
                                onPress={()=> this._onSelect(this.props.name, this.state.value)}
                                title='Done'
                            />
                        </View>
                        <Picker
                            selectedValue={this.state.value}
                            onValueChange={(itemValue, itemIndex) => {
                                this.setState({ value: itemValue });
                            }}
                            style={(Platform.OS == 'android') ? {color: '#fff'} : null}
                            itemStyle={styles.text}
                        >
                            {selectOptions}
                        </Picker>
                    </View>
                </View>
            </Modal>
        )
    }
}

class LoadingOverlay extends Component {
    render() {
        return(
            <View style={{ width: '100%', height: '100%', position: 'absolute', alignItems: 'center' }}>
                <View style={{ marginTop: '40%', width: 110, height: 100, borderRadius: 10, backgroundColor: 'rgba(25,25,25,.5)', alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size='large' />
                    <Text style={{ color: "#888", fontWeight: '500', marginTop: 15 }}>Loading...</Text>
                </View>
            </View>
        )
    }
}

class ListSwitch extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let outerStyle = [styles.ListItemOuter];
        let innerStyle = [styles.ListItemInner];

        if (this.props.first) { 
            outerStyle.push(styles.firstInList); 
        }

        if (this.props.last) { 
            outerStyle.push(styles.lastInList); 
            innerStyle.push(styles.innerLastInList); 
        }
        return (
            <View style={outerStyle}>
                <View style={[innerStyle, styles.ListSwitch]}>
                    <Text style={styles.ListItemText}>{this.props.text}</Text>
                    <Switch onValueChange={(value) => this.props.onChange(this.props.name, value)} value={this.props.value} />
                </View>
            </View>
        )
    }
}

export class FormItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let children = [];

        if (this.props.item.type === "text") {
            children.push(
                <TextInputListItem
                    name={this.props.item.name}                
                    value={this.props.value}
                    readOnly={this.props.item.readOnly}
                    placeholder={this.props.item.placeholder}
                    onChange={(name, value) => this.props.onChange(name, value)}
                    key={this.props.item.name}
                    first={this.props.first}
                    last={this.props.last}  
                    multiline={this.props.item.multiline}
                    maxLength={this.props.item.maxLength}
                />
            )
        } else if (this.props.item.type === "select") {
            const displayText = this.props.item.selectOptions.filter((item) => {
                return item.value === this.props.value;
            });
            children.push(
                <ListButton
                    text={displayText[0].name}
                    onPress={() => this.selectModal.show()}
                    key={this.props.item.name}
                    first={this.props.first}
                    last={this.props.last}                    
                />
            );
            children.push(
                <SelectModal
                    name={this.props.item.name}                                
                    ref={(component) => this.selectModal = component}
                    selectOptions={this.props.item.selectOptions}
                    onSelect={this.props.onChange}
                    value={this.props.value}
                    key={this.props.item.name + "Modal"}                    
                />
            );
        } else if (this.props.item.type == "switch") {
            children.push(
                <ListSwitch
                    text={this.props.item.tag}
                    name={this.props.item.name}
                    value={this.props.value}
                    onChange={this.props.onChange}
                    key={this.props.item.name}
                    first={this.props.first}
                    last={this.props.last}
                />
            )
        }

        if (this.props.item.spacer == true) { 
            children.push(<View style={{ height: 15 }} key={this.props.item.name + "After"} />);
        }

        return (
            <View>
                {children}
            </View>
        )
    }
}

export class UserAgreement extends Component {
    static navigationOptions = {
        title: 'User Agreement',
        drawerLockMode: 'locked-closed'
    }
    render() {
        return (
            <WebView source={{ url: 'https://www.destiny.gg/agreement' }} />
        )
    }
}
