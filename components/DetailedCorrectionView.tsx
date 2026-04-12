import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
// Bổ sung thêm Icon cho phần Chat
import { PaperPlaneRightIcon, SparkleIcon } from 'phosphor-react-native'; 
import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../constants/GlobalStyles';

// Định nghĩa kiểu dữ liệu cho tin nhắn
type Message = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
};

// Định nghĩa kiểu dữ liệu cho mảnh ghép sửa lỗi
export type CorrectionSegment = {
  type: 'text' | 'error' | 'correct';
  content: string;
};

interface DetailedCorrectionViewProps {
  correctionData?: CorrectionSegment[];
}

export default function DetailedCorrectionView({ correctionData = [] }: DetailedCorrectionViewProps) {
  // State quản lý text đang nhập
  const [inputText, setInputText] = useState('');
  
  // State quản lý lịch sử trò chuyện (Mặc định AI sẽ chào hỏi trước)
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      sender: 'ai', 
      text: 'Bạn có thắc mắc gì về các lỗi ngữ pháp hoặc từ vựng ở trên không? Hãy hỏi mình nhé!' 
    }
  ]);

  // Hàm xử lý gửi tin nhắn
  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // 1. Thêm tin nhắn của User vào danh sách
    const newUserMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText.trim()
    };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText(''); // Xóa ô nhập liệu

    // 2. Giả lập AI trả lời sau 1 giây (TODO: Thay thế bằng API thực tế)
    setTimeout(() => {
      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Lỗi "보호하다" ở câu 2 sai vì phía sau là động từ "노력해야 합니다" (phải cố gắng). Do đó, bạn phải dùng cấu trúc chỉ mục đích "-기 위해" (để) -> "보호하기 위해" (Để bảo vệ).'
      };
      setMessages(prev => [...prev, newAiMsg]);
    }, 1000);
  };

  return (
    <View style={styles.detailedCard}>
      
      {/* --- 1. PHẦN BÀI SỬA (DỮ LIỆU ĐỘNG TỪ AI) --- */}
      <Text style={styles.detailedTitle}>Chi tiết lỗi sai</Text>
      <Text style={styles.paragraphText}>
        {correctionData.length > 0 ? (
          correctionData.map((segment, index) => {
            if (segment.type === 'error') {
              return <Text key={index} style={styles.errorText}>{segment.content}</Text>;
            } else if (segment.type === 'correct') {
              return <Text key={index} style={styles.correctText}>{segment.content}</Text>;
            }
            // type === 'text'
            return <Text key={index}>{segment.content}</Text>;
          })
        ) : (
          <Text style={{ color: Color.gray }}>Không có dữ liệu phân tích chi tiết.</Text>
        )}
      </Text>

      {/* TẠM ẨN KHU VỰC HỎI ĐÁP VỚI AI */}
      {false && (
        <>
          {/* Đường phân cách */}
          <View style={styles.divider} />
    
          {/* --- 2. KHU VỰC HỎI ĐÁP VỚI AI --- */}
          <View style={styles.aiHeader}>
            <SparkleIcon size={20} color={Color.main} weight="fill" />
            <Text style={styles.aiTitle}>Hỏi đáp cùng Salio AI</Text>
          </View>
    
          {/* Danh sách tin nhắn */}
          <View style={styles.chatContainer}>
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <View 
                  key={msg.id} 
                  style={[
                    styles.messageBubble, 
                    isUser ? styles.userBubble : styles.aiBubble
                  ]}
                >
                  <Text style={[
                    styles.messageText,
                    isUser ? styles.userText : styles.aiText
                  ]}>
                    {msg.text}
                  </Text>
                </View>
              );
            })}
          </View>
    
          {/* Ô nhập liệu & Nút gửi */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              placeholder="Hỏi AI tại sao câu này sai..."
              placeholderTextColor={Color.gray}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={200}
            />
            <TouchableOpacity 
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
              activeOpacity={0.7}
            >
              <PaperPlaneRightIcon 
                size={20} 
                color={inputText.trim() ? Color.bg : Color.gray} 
                weight="fill" 
              />
            </TouchableOpacity>
          </View>
        </>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  // --- STYLES BÀI SỬA ---
  detailedCard: {
    backgroundColor: Color.bg,
    borderRadius: Border.br_20,
    borderWidth: 1,
    borderColor: Color.stroke,
    padding: Padding.padding_15,
  },
  detailedTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.color,
    marginBottom: Gap.gap_15,
  },
  paragraphText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_16,
    color: Color.text,
    lineHeight: 28, 
  },
  errorText: {
    color: Color.red,
    textDecorationLine: 'line-through', 
    backgroundColor: '#FFE5E5', 
  },
  correctText: {
    color: '#0C5F35', 
    fontFamily: FontFamily.lexendDecaMedium,
    backgroundColor: '#E8F5E9', 
  },

  // --- STYLES PHẦN AI CHAT ---
  divider: {
    height: 1,
    backgroundColor: Color.stroke,
    marginVertical: Padding.padding_15,
    opacity: 0.5,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.gap_8,
    marginBottom: Gap.gap_15,
  },
  aiTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14,
    color: Color.text,
  },
  
  // Bong bóng Chat
  chatContainer: {
    gap: Gap.gap_10,
    marginBottom: Gap.gap_15,
  },
  messageBubble: {
    padding: Padding.padding_10,
    borderRadius: Border.br_15,
    maxWidth: '85%',
  },
  userBubble: {
    backgroundColor: Color.main, // Xanh lá nhạt
    alignSelf: 'flex-end', // Căn phải
    borderBottomRightRadius: 4, // Vuông góc nhẹ phần đuôi bong bóng
  },
  aiBubble: {
    backgroundColor: '#F1F5F9', // Xám siêu nhạt
    alignSelf: 'flex-start', // Căn trái
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    lineHeight: 20,
  },
  userText: {
    color: Color.color, // Chữ xanh đậm trên nền xanh nhạt
  },
  aiText: {
    color: Color.text, // Chữ đen trên nền xám
  },

  // Thanh nhập liệu
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Gap.gap_10,
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Color.stroke,
    borderRadius: Border.br_15,
    paddingHorizontal: Padding.padding_15,
    paddingVertical: Padding.padding_10,
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.text,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Color.color, // Nút xanh đậm
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Color.stroke, // Chuyển xám khi không có text
  },
});