import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { CaretLeftIcon, FireIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
import LevelItem, { StreakMilestone } from '../StreakComponent/LevelItem';
import { MonthConnector } from '../StreakComponent/MonthConnector';

const MILESTONES: StreakMilestone[] = [
    {
        id: '1',
        title: 'Lửa Mầm Non',
        duration: '1 - 3 ngày',
        description: 'Ngọn lửa nhỏ màu cam vàng, cháy bập bùng nhẹ và chưa ổn định.',
        motivationText: 'Chỉ cần không bỏ cuộc hôm nay.',
        story: 'Bạn vừa bắt đầu hành trình. Mỗi lần mở app là một lần bạn giữ cho ngọn lửa này không tắt.',
        image: require('../../assets/images/streak/lv1.png')
    },
    {
        id: '2',
        title: 'Lửa Khởi Sắc',
        duration: '4 - 6 ngày',
        description: 'Ngọn lửa lớn hơn với nhiều nhánh, bắt đầu xuất hiện tia lửa bay lên.',
        motivationText: 'Bạn đang tạo nên nhịp điệu của riêng mình.',
        story: 'Bạn đã bắt đầu quen với việc học mỗi ngày. Nó dần trở thành một phần tự nhiên trong cuộc sống.',
        image: require('../../assets/images/streak/lv2.png')
    },
    {
        id: '3',
        title: 'Lửa Bùng Cháy',
        duration: '7 - 14 ngày',
        description: 'Ngọn lửa đỏ rực, cháy mạnh mẽ và cao, tỏa ra nhiệt lượng rõ rệt.',
        motivationText: 'Kỷ luật đang thay thế cảm hứng.',
        story: 'Bạn đã vượt qua giai đoạn dễ bỏ cuộc. Động lực giờ đến từ bên trong, không còn phụ thuộc cảm hứng.',
        image: require('../../assets/images/streak/lv3.png')
    },
    {
        id: '4',
        title: 'Lửa Xanh Tập Trung',
        duration: '15 - 30 ngày',
        description: 'Ngọn lửa xanh dương cháy ổn định, biểu tượng của sự tập trung sâu.',
        motivationText: 'Sự tập trung yên tĩnh là sức mạnh thật sự.',
        story: 'Bạn học không còn vì streak. Bạn học vì bạn đã trở thành người có kỷ luật.',
        image: require('../../assets/images/streak/lv4.png')
    },
    {
        id: '5',
        title: 'Lửa Tím Huyền Bí',
        duration: '31 - 60 ngày',
        description: 'Ngọn lửa tím phát sáng kỳ ảo, mang cảm giác sâu sắc và huyền bí.',
        motivationText: 'Bạn không còn học… bạn đang hòa vào nó.',
        story: 'Bạn bắt đầu hiểu sâu. Ngôn ngữ không còn là kiến thức, mà trở thành trực giác.',
        image: require('../../assets/images/streak/lv5.png')
    },
    {
        id: '6',
        title: 'Lửa Vàng Kim',
        duration: '> 60 ngày',
        description: 'Ngọn lửa vàng rực như mặt trời, tỏa ra năng lượng mạnh mẽ và ổn định.',
        motivationText: 'Bạn không còn đuổi theo mục tiêu. Bạn đã trở thành nó.',
        story: 'Việc học đã trở thành một phần con người bạn. Bạn không còn giữ streak — bạn chính là streak.',
        image: require('../../assets/images/streak/lv6.png')
    }
];

interface StreakRewardsModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export default function StreakRewardsModal({ isVisible, onClose }: StreakRewardsModalProps) {
    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Pressable style={styles.backgroundTouchable} onPress={onClose} />
                
                <View style={styles.sheetContent}>
                    <View style={styles.dragHandle} />

                    <View style={styles.header}>
                        <View style={styles.titleWrap}>
                            <Text style={styles.headerTitle}>Cấp độ Ngọn lửa</Text>
                        </View>
                        <View style={{ width: 24 }} /> {/* Spacer để cân bằng Flexbox */}
                    </View>

                    <ScrollView 
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {MILESTONES.map((item, index) => (
                            <View key={item.id}>
                                <LevelItem item={item} />
                                {index < MILESTONES.length - 1 ? <MonthConnector /> : null}
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end' },
    backgroundTouchable: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
    sheetContent: {
        backgroundColor: Color.bg,
        borderTopLeftRadius: Border.br_30,
        borderTopRightRadius: Border.br_30,
        height: '85%', // Chiếm 85% màn hình
        paddingHorizontal: Padding.padding_20,
        paddingTop: Padding.padding_15,
        shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10,
    },
    dragHandle: { width: 40, height: 5, borderRadius: 3, backgroundColor: '#CBD5E1', alignSelf: 'center', marginBottom: Gap.gap_15 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Gap.gap_20 },
    backBtn: { padding: 4 },
    titleWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    headerTitle: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_16, color: Color.text },
    scrollContent: { paddingBottom: 40, paddingTop: 10 }
});