import React, { Component } from 'react';
import { Animated, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import Interactable from 'react-native-interactable';
import { Palette } from 'assets/constants';

interface BottomDrawerProps {
    posSpy: Animated.Value;
    onOpen: {(): any};
    onClose: {(): any};
    style: ViewStyle;
}

export class BottomDrawer extends Component<BottomDrawerProps, {
    onTop: boolean,
    open: boolean,
    fixed: boolean,
}> {
    open: boolean;
    interactable: Component<Interactable.IInteractableView> | null = null;
    scrollY: Animated.Value;

    constructor(props: BottomDrawerProps) {
        super(props);
        this.state = {onTop: false, open: false, fixed: false};
        this.open = false;
        this.scrollY = this.props.posSpy;
    }

    openDrawer() {
        if (this.interactable !== null) {
            this.setState({ open: true });
            (this.interactable as any).snapTo({index: 1});
        }
        this.props.onOpen();
    }

    closeDrawer() {
        if (this.interactable !== null) {
            (this.interactable as any).snapTo({ index: 0 });
            setTimeout(() => this.setState({ open: false }), 200);
        }
        this.props.onClose();
    }

    toTop() {
        this.setState({ fixed: true });
    }

    toBottom() {
        this.setState({ fixed: false });        
    }

    render() {
        return (
            <Interactable.View
                verticalOnly={true}
                snapPoints={[{y: 0}, {y: -265}]}
                boundaries={{top: -325}}
                style={this.props.style} 
                dragEnabled={!this.state.fixed}
                animatedValueY={this.props.posSpy}
                ref={r => this.interactable = r}
                onSnap={(e) => {
                    if (e.nativeEvent.index === 1) {
                        this.setState({ open: true });
                        this.props.onOpen();
                    } else if (e.nativeEvent.index === 0) {
                        this.setState({ open: false });
                        this.props.onClose();
                    }
                }}
            >      
                {this.props.children}
            </Interactable.View>
        )
    }
}