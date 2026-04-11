import React, { useRef, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Dimensions } from 'react-native';
import { Color, FontFamily, FontSize, Padding } from '../constants/GlobalStyles';

const { width } = Dimensions.get('window');

interface WonGoJiGridProps {
  text: string;
  setText: (t: string) => void;
  maxChars?: number;
}

const COLUMNS = 14; // Số cột trên 1 hàng (Có thể điều chỉnh)
const CELL_SIZE = (width - Padding.padding_15 * 2) / COLUMNS;

export default function WonGoJiGrid({ text, setText, maxChars = 700 }: WonGoJiGridProps) {
  const inputRef = useRef<TextInput>(null);

  const handlePressGrid = () => {
    inputRef.current?.focus();
  };

  // --- THUẬT TOÁN XỬ LÝ QUY TẮC WON-GO-JI ---
  // Dùng useMemo để chỉ tính toán lại khi 'text' thay đổi
  const parsedCells = useMemo(() => {
    const cells: string[] = [];
    let i = 0;

    while (i < text.length && cells.length < maxChars) {
      const char = text[i];

      // QUY TẮC 1: Xử lý Xuống dòng (Enter)
      // Khi gặp ký tự \n, phải lấp đầy các ô còn lại của hàng hiện tại bằng ô trống
      if (char === '\n') {
        const cellsInCurrentRow = cells.length % COLUMNS;
        const emptyCellsNeeded = COLUMNS - cellsInCurrentRow;
        
        for (let j = 0; j < emptyCellsNeeded; j++) {
          if (cells.length < maxChars) {
            cells.push(''); // Thêm ô trống
          }
        }
        i++;
        continue;
      }

      // QUY TẮC 2: Gộp 2 chữ số vào 1 ô
      // Kiểm tra nếu ký tự hiện tại là số, và ký tự tiếp theo cũng là số
      if (/[0-9]/.test(char) && i + 1 < text.length && /[0-9]/.test(text[i + 1])) {
        cells.push(char + text[i + 1]); // Gộp "Số + Số" vào chung 1 ô
        i += 2; // Nhảy qua 2 ký tự
        continue;
      }

      // MẶC ĐỊNH: Các ký tự khác (Chữ Hàn, Chữ Latin, Dấu câu, Khoảng trắng, 1 chữ số lẻ) -> Chiếm 1 ô
      cells.push(char);
      i++;
    }

    return cells;
  }, [text, maxChars]);

  // Vị trí con trỏ nhấp nháy hiện tại (là ô ngay sau ô cuối cùng có chữ)
  const cursorIndex = parsedCells.length;

  return (
    <View style={styles.gridWrapper}>
      <TextInput
        ref={inputRef}
        value={text}
        onChangeText={setText}
        // Lưu ý: Không dùng maxLength ở đây nữa vì độ dài text thực tế (gồm cả \n) 
        // có thể khác với số ô vuông đã render. Quản lý cảnh báo ở BottomBar.
        multiline
        autoFocus
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.hiddenInput}
        caretHidden={true} 
      />

      <Pressable onPress={handlePressGrid} style={styles.gridContainer}>
        {Array.from({ length: maxChars }).map((_, index) => {
          // Lấy nội dung đã được xử lý cho ô này
          const cellContent = parsedCells[index] || '';
          
          // Xác định ô đang được active (ô con trỏ)
          const isCursor = index === cursorIndex; 

          return (
            <View 
              key={index} 
              style={[
                styles.gridCell,
                isCursor && styles.gridCellActive 
              ]}
            >
              <Text 
                style={[
                  styles.gridText,
                  // Nhỏ font lại một chút nếu ô đó chứa 2 chữ số để không bị tràn viền
                  cellContent.length > 1 && { fontSize: FontSize.fs_12 } 
                ]}
              >
                {cellContent}
              </Text>
            </View>
          );
        })}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  gridWrapper: {
    paddingHorizontal: Padding.padding_15,
    position: 'relative',
  },
  hiddenInput: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0, 
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#D1E9D2',
  },
  gridCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#D1E9D2',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.bg,
  },
  gridCellActive: {
    backgroundColor: '#F0FDF4', 
  },
  gridText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_16,
    color: Color.text,
  },
});