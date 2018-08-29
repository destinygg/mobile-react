import React, { Component } from 'react';
import { Animated, ViewStyle } from 'react-native';
import Interactable, { IDragEvent } from 'react-native-interactable';

interface BottomDrawerProps {
    posSpy: Animated.Value;
    onOpen: {(): any};
    onDrag: {(e: IDragEvent): any};
    onClose: {(): any};
    style: ViewStyle;
}

export class BottomDrawer extends Component<BottomDrawerProps, {
    open: boolean,
    fixed: boolean,
}> {
    open: boolean;
    interactable: Component<Interactable.IInteractableView> | null = null;
    scrollY: Animated.Value;

    constructor(props: BottomDrawerProps) {
        super(props);
        this.state = {open: false, fixed: false};
        this.open = false;
        this.scrollY = this.props.posSpy;
    }

    openDrawer() {
        if (this.interactable !== null) {
            this.open = true;
            (this.interactable as any).snapTo({index: 1});
        }
        this.props.onOpen();
    }

    closeDrawer() {
        if (this.interactable !== null) {
            (this.interactable as any).snapTo({ index: 0 });
            this.open = false;
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
                        this.open = true;
                        this.props.onOpen();
                    } else if (e.nativeEvent.index === 0) {
                        this.open = false;
                        this.props.onClose();
                    }
                }}
                onDrag={this.props.onDrag}
                pointerEvents={"box-none"}
            >      
                {this.props.children}
            </Interactable.View>
        )
    }
}