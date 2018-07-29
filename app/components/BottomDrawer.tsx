import React, { Component } from 'react';
import { Animated, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import Interactable from 'react-native-interactable';
import styles from 'styles';

interface BottomDrawerProps {
    posSpy: Animated.Value;
    onOpen: {(): any};
    onClose: {(): any};
    paddingHeight: number;
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
    scrollViewHeight = 500;
    handleTopBinding: Animated.AnimatedInterpolation;
    handleWidthBinding: Animated.AnimatedInterpolation;
    opacityBinding: Animated.AnimatedInterpolation;

    constructor(props: BottomDrawerProps) {
        super(props);
        this.state = {onTop: false, open: false, fixed: false};
        this.open = false;
        this.scrollY = this.props.posSpy;
        this.handleTopBinding = this.scrollY.interpolate({
            inputRange: [
                0,
                265
            ],
            outputRange: [0, 10]
        });
        this.handleWidthBinding = this.scrollY.interpolate({
            inputRange: [
                0,
                265
            ],
            outputRange: [0.6, 1]
        });
        this.opacityBinding = this.scrollY.interpolate({
            inputRange: [
                0,
                265
            ],
            outputRange: [0.4, 1]
        })
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
            <KeyboardAvoidingView 
                style={Object.assign({
                    top: -(this.props.paddingHeight), 
                    zIndex: 6000                   
                }, this.props.style)}
                behavior={'position'}
            >
                    <Interactable.View
                        verticalOnly={true}
                        snapPoints={[{y: 0, tension: 0, damping: 1}, {y: 265, tension: 0, damping: 1}]}
                        style={{
                            height: this.scrollViewHeight,
                            width: '100%',
                        }} 
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
                        <TouchableWithoutFeedback 
                            onPress={() => Keyboard.dismiss()}
                        >
                            <View style={{ height: this.props.paddingHeight }} />
                        </TouchableWithoutFeedback>
                        <Animated.View style={[
                            styles.DrawerHandle, 
                            {
                                opacity: this.opacityBinding,
                                transform: [
                                    {
                                        translateY: this.handleTopBinding,
                                    },
                                    {
                                        scaleX: this.handleWidthBinding
                                    },
                                ]
                            }
                        ]} 
                        />
                        {this.props.children}
                    </Interactable.View>
            </KeyboardAvoidingView>
        )
    }
}