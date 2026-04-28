import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { Color, FontFamily, FontSize, Padding, Gap } from '../../constants/GlobalStyles';
import { MotiView } from 'moti';

export type StreakMilestone = {
    id: string;
    title: string;
    duration: string;
    description: string;
    motivationText: string;
    story: string;
    image: ImageSourcePropType;
};

interface LevelItemProps {
    item: StreakMilestone;
}

export default function LevelItem({ item }: LevelItemProps) {
    // Tính toán kích thước ngọn lửa: Mặc định cấp 1 là 60, mỗi cấp tăng thêm 8px
    const level = parseInt(item.id) || 1;
    const dynamicSize = 60 + (level - 1) * 8;

    return (
        <View style={styles.container}>
            {/* Thẻ Cấp độ */}
            <View style={styles.card}>
                <Image source={item.image} style={{ width: dynamicSize, height: dynamicSize }} resizeMode="contain" />
                <View style={styles.infoWrap}>
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>{item.title}</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{item.duration}</Text>
                        </View>
                    </View>
                    <Text style={styles.description}>{item.description}</Text>
                </View>
            </View>

            {/* Bong bóng động lực */}
            <MotiView 
                from={{ opacity: 0, translateY: 15, scale: 0.9 }}
                animate={{ opacity: 1, translateY: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 14, delay: 200 }}
                style={styles.bubbleWrapper}
            >
                <View style={styles.tail} />
                <View style={styles.bubble}>
                    <Text style={styles.storyText}>{item.story}</Text>
                    <Text style={styles.motivationText}>💡 "{item.motivationText}"</Text>
                </View>
            </MotiView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    card: {
        backgroundColor: Color.bg,
        borderWidth: 1,
        borderColor: '#F1F5F9', // Xám rất nhạt
        borderRadius: 24,
        padding: Padding.padding_15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Gap.gap_15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        zIndex: 2,
    },
    infoWrap: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 6,
    },
    title: {
        fontFamily: FontFamily.lexendDecaBold,
        fontSize: FontSize.fs_16,
        color: Color.text,
    },
    badge: {
        backgroundColor: '#222222',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontFamily: FontFamily.lexendDecaSemiBold,
        fontSize: FontSize.fs_12,
        color: '#F59E0B', // Vàng cam rực rỡ
    },
    description: {
        fontFamily: FontFamily.lexendDecaRegular,
        fontSize: FontSize.fs_14,
        color: Color.gray, // textSecondary
        lineHeight: 20,
    },
    bubbleWrapper: { marginTop: 8, marginLeft: 40, position: 'relative', zIndex: 1 },
    tail: { position: 'absolute', top: -8, left: 20, width: 0, height: 0, borderLeftWidth: 8, borderRightWidth: 8, borderBottomWidth: 10, borderStyle: 'solid', backgroundColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#DCFCE7' },
    bubble: {
        backgroundColor: Color.mintPastel, // Xanh lá nhạt
        padding: Padding.padding_15,
        borderRadius: 20,
        borderTopLeftRadius: 4, // Bất đối xứng tạo hình bong bóng
        borderWidth: 1,
        borderColor: '#BBF7D0',
    },
    storyText: { 
        fontFamily: FontFamily.lexendDecaRegular, 
        fontSize: FontSize.fs_14, 
        color: '#065F46', 
        lineHeight: 22, 
        marginBottom: 8 
    },
    motivationText: { 
        fontFamily: FontFamily.lexendDecaSemiBold, 
        fontSize: FontSize.fs_14, 
        color: '#047857', 
        lineHeight: 22,
        fontStyle: 'italic',
    },
});