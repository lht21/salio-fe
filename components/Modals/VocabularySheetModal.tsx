import React from 'react';
import {
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Color, FontFamily, FontSize, Gap } from '../../constants/GlobalStyles';
import CloseButton from '../CloseButton';

export type VocabularySheetModalProps = {
    visible: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    maxHeight?: number | `${number}%`;
    showCloseButton?: boolean;
    edgeToBottom?: boolean;
    keyboardAware?: boolean;
    expandOnKeyboard?: boolean;
    contentScrollable?: boolean;
    keyboardVerticalOffset?: number;
    headerHorizontalInset?: number;
};

const ENTER_DURATION = 220;
const EXIT_DURATION = 180;
const DEFAULT_WRAPPER_BOTTOM_PADDING = 18;
const DEFAULT_SHEET_BOTTOM_PADDING = 16;
const EXPANDED_MAX_HEIGHT = '96%';
const EXPANDED_MAX_HEIGHT_PERCENT = Number(EXPANDED_MAX_HEIGHT.replace('%', ''));

const VocabularySheetModal = ({
    visible,
    title,
    onClose,
    children,
    maxHeight = '75%',
    showCloseButton = true,
    edgeToBottom = false,
    keyboardAware = false,
    expandOnKeyboard = false,
    contentScrollable = false,
    keyboardVerticalOffset = 0,
    headerHorizontalInset = 2,
}: VocabularySheetModalProps) => {
    const insets = useSafeAreaInsets();
    const [isMounted, setIsMounted] = React.useState(visible);
    const [isKeyboardVisible, setIsKeyboardVisible] = React.useState(false);
    const animation = React.useRef(new Animated.Value(visible ? 1 : 0)).current;

    const wrapperBottomPadding = edgeToBottom ? 0 : Math.max(insets.bottom, DEFAULT_WRAPPER_BOTTOM_PADDING);
    const sheetBottomPadding = edgeToBottom
        ? insets.bottom
        : Math.max(insets.bottom, DEFAULT_SHEET_BOTTOM_PADDING);

    React.useEffect(() => {
        if (visible) {
            setIsMounted(true);

            Animated.timing(animation, {
                toValue: 1,
                duration: ENTER_DURATION,
                useNativeDriver: true,
            }).start();

            return;
        }

        setIsKeyboardVisible(false);

        if (!isMounted) {
            return;
        }

        Animated.timing(animation, {
            toValue: 0,
            duration: EXIT_DURATION,
            useNativeDriver: true,
        }).start(({ finished }) => {
            if (finished) {
                setIsMounted(false);
            }
        });
    }, [animation, isMounted, visible]);

    React.useEffect(() => {
        if (!keyboardAware || !visible) {
            setIsKeyboardVisible(false);
            return;
        }

        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const showSubscription = Keyboard.addListener(showEvent, () => {
            setIsKeyboardVisible(true);
        });
        const hideSubscription = Keyboard.addListener(hideEvent, () => {
            setIsKeyboardVisible(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [keyboardAware, visible]);

    if (!isMounted) {
        return null;
    }

    const backdropOpacity = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [56, 0],
    });

    let effectiveMaxHeight = maxHeight;

    if (keyboardAware && expandOnKeyboard && isKeyboardVisible) {
        if (typeof maxHeight === 'string' && maxHeight.endsWith('%')) {
            const configuredPercent = Number(maxHeight.replace('%', ''));
            effectiveMaxHeight =
                configuredPercent >= EXPANDED_MAX_HEIGHT_PERCENT ? maxHeight : EXPANDED_MAX_HEIGHT;
        }
    }

    const shouldRenderScrollableContent = contentScrollable;
    const isScrollEnabled = !keyboardAware || isKeyboardVisible;
    const shouldUseKeyboardAvoidingView = keyboardAware && !(edgeToBottom && Platform.OS === 'android');
    const shouldRenderHeader = showCloseButton || title.trim().length > 0;
    const bottomCompensation = edgeToBottom && Platform.OS === 'android'
        ? -Math.max(insets.bottom, 20)
        : 0;
    const sheetSizeStyle = edgeToBottom
        ? { height: effectiveMaxHeight }
        : { maxHeight: effectiveMaxHeight };

    const sheetNode = (
        <View
            style={[
                styles.sheetWrapper,
                edgeToBottom && styles.sheetWrapperEdgeToBottom,
                { paddingBottom: wrapperBottomPadding, marginBottom: bottomCompensation },
            ]}
            pointerEvents="box-none"
        >
            <Animated.View
                style={[
                    styles.sheet,
                    edgeToBottom && styles.sheetEdgeToBottom,
                    sheetSizeStyle,
                    {
                        paddingBottom: edgeToBottom ? 0 : sheetBottomPadding,
                        opacity: animation,
                        transform: [{ translateY }],
                    },
                ]}
            >
                {shouldRenderHeader ? (
                    <View style={[styles.header, { paddingHorizontal: headerHorizontalInset }]}>
                        <Text style={styles.title}>{title}</Text>
                        {showCloseButton ? (
                            <CloseButton
                                variant="Stroke"
                                onPress={onClose}
                                style={styles.closeButton}
                            />
                        ) : null}
                    </View>
                ) : null}

                {shouldRenderScrollableContent ? (
                    <ScrollView
                        contentContainerStyle={styles.contentScrollContainer}
                        keyboardShouldPersistTaps="handled"
                        scrollEnabled={isScrollEnabled}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                        overScrollMode="never"
                        nestedScrollEnabled
                    >
                        <View style={styles.content}>{children}</View>
                    </ScrollView>
                ) : (
                    <View style={styles.content}>{children}</View>
                )}
            </Animated.View>
        </View>
    );

    return (
        <Modal
            transparent
            visible={isMounted}
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent
            navigationBarTranslucent
        >
            <View style={styles.modalRoot}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
                    <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
                </Pressable>

                {shouldUseKeyboardAvoidingView ? (
                    <KeyboardAvoidingView
                        enabled
                        behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
                        keyboardVerticalOffset={keyboardVerticalOffset}
                        style={styles.bottomAligned}
                        pointerEvents="box-none"
                    >
                        {sheetNode}
                    </KeyboardAvoidingView>
                ) : (
                    <View style={styles.bottomAligned} pointerEvents="box-none">
                        {sheetNode}
                    </View>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalRoot: {
        flex: 1,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15, 23, 42, 0.26)',
    },
    bottomAligned: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    sheetWrapper: {
        paddingHorizontal: 10,
        paddingBottom: 0,
    },
    sheetWrapperEdgeToBottom: {
        paddingHorizontal: 0,
        paddingBottom: 0,
    },
    sheet: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 26,
        borderBottomRightRadius: 26,
        backgroundColor: Color.bg,
        overflow: 'hidden',
        paddingTop: 18,
        paddingHorizontal: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 14,
        elevation: 8,
    },
    sheetEdgeToBottom: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        paddingHorizontal: 0,
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
        elevation: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: Gap.gap_10,
        marginBottom: 14,
    },
    title: {
        flex: 1,
        fontFamily: FontFamily.lexendDecaSemiBold,
        fontSize: FontSize.fs_16,
        color: Color.text,
    },
    closeButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
    },
    contentScrollContainer: {
        paddingBottom: 4,
    },
    content: {
        borderRadius: 20,
    },
});

export default VocabularySheetModal;
