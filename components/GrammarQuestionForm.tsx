import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { Color, FontFamily } from '../constants/GlobalStyles';

export interface GrammarOption {
  id: string;
  label: string;
  text: string;
}

export interface GrammarQuestion {
  id: number;
  question: string;
  options: GrammarOption[];
}

interface GrammarQuestionFormProps {
  question: GrammarQuestion;
  selectedOptionId: string | null;
  onSelectOption: (id: string) => void;
  showResultSheet: boolean;
}

export default function GrammarQuestionForm({
  question,
  selectedOptionId,
  onSelectOption,
  showResultSheet,
}: GrammarQuestionFormProps) {
  return (
    <View style={styles.container}>
      {/* Question Text */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.question}</Text>
      </View>

      {/* Options List */}
      <View style={styles.optionsContainer}>
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                isSelected && styles.optionButtonSelected,
              ]}
              onPress={() => onSelectOption(option.id)}
              disabled={showResultSheet}
            >
              <Text style={styles.optionLabel}>{option.label}</Text>
              <Text style={styles.optionText}>{option.text}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  questionContainer: {
    marginBottom: 60,
  },
  questionText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 24,
    color: '#1E1E1E',
    lineHeight: 34,
  },
  optionsContainer: {
    gap: 15,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E6E9F0',
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 25,
    gap: 15,
  },
  optionButtonSelected: {
    borderColor: '#98F291',
    backgroundColor: '#F0FFF0',
  },
  optionLabel: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 16,
    color: '#1E1E1E',
  },
  optionText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 16,
    color: '#1E1E1E',
  },
});
