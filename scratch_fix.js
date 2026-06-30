const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, search, replace) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) return;
  const content = fs.readFileSync(fullPath, 'utf8');
  fs.writeFileSync(fullPath, content.replace(search, replace));
}

// 1. MultipleChoiceUI.tsx
replaceInFile('components/PracticeComponent/MultipleChoiceUI.tsx', 
`return \n  <View style={styles.coverBanner}>`, 
`return (
  <View style={styles.coverBanner}>`);
replaceInFile('components/PracticeComponent/MultipleChoiceUI.tsx', 
`    </View>\n;`, 
`    </View>\n);`);

replaceInFile('components/PracticeComponent/MultipleChoiceUI.tsx', 
`const QuestionListModal = forwardRef<BottomSheetModal, QuestionListModalProps>(({ allQuestions, answers, onJump }, ref) => {`, 
`const QuestionListModal = forwardRef<BottomSheetModal, QuestionListModalProps>(({ allQuestions, answers, onJump }, ref) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);`);

// 2. ExamResultUI.tsx and ScoreCard (missing return parens maybe?)
// The error was: 'ScoreCard' cannot be used as a JSX component. Type 'void' is not assignable to type 'ReactNode'.
// Same issue with ExamResultUI's ScoreCard probably.
replaceInFile('components/PracticeComponent/ExamResultUI.tsx', 
`const ScoreCard = ({ title, koreanTitle, score }: ScoreCardProps) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

return 
  <View style={styles.scoreCard}>`,
`const ScoreCard = ({ title, koreanTitle, score }: ScoreCardProps) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

return (
  <View style={styles.scoreCard}>`);
replaceInFile('components/PracticeComponent/ExamResultUI.tsx',
`</Text>\n    </View>\n  </View>\n;`,
`</Text>\n    </View>\n  </View>\n);`);

// 3. ProgressBar.tsx missing colors
replaceInFile('components/ProgressBar.tsx',
`const ProgressBar = ({ progress, height = 8, color, style, animated = true }: ProgressBarProps) => {`,
`const ProgressBar = ({ progress, height = 8, color, style, animated = true }: ProgressBarProps) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);`);
replaceInFile('components/ProgressBar.tsx', 
`const ProgressBar = ({ progress, height = 8, color, style, animated = true }: ProgressBarProps) => {\n  const { colors } = useTheme();\n  const styles = getStyles(colors);\n    const { colors } = useTheme();\n    const styles = getStyles(colors);`,
`const ProgressBar = ({ progress, height = 8, color, style, animated = true }: ProgressBarProps) => {\n  const { colors } = useTheme();\n  const styles = getStyles(colors);`);

// 4. StreakCalendar.tsx SectionHeader issue
replaceInFile('components/StreakCalendar.tsx',
`const SectionHeader = ({ title, style }: SectionHeaderProps) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

return \n  <View style={[styles.sectionHeader, style]}>`,
`const SectionHeader = ({ title, style }: SectionHeaderProps) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

return (
  <View style={[styles.sectionHeader, style]}>`);
replaceInFile('components/StreakCalendar.tsx',
`  </View>\n;`,
`  </View>\n);`);

// 5. ThemeContext.tsx missing properties
// We just need to add the missing properties to darkTheme in GlobalStyles.ts, not ThemeContext.tsx.
replaceInFile('constants/GlobalStyles.ts',
`  // --- GREEN ---`,
`  main50: "#F2FCD0",
  main75: "#E8F7C0",
  main100: '#DFF5A0',
  main200: "#C8ED6A",
  main300: '#AEDD40',
  main400: "#90CC18",
  main500: '#6EAA00',
  main700: '#4E7A00',
  main900: '#2F4D00',

  brown50: "#FDF7F0",
  brown200: "#D4B896",
  brown500: "#7A5530",
  brown800: "#4A3218",

  blue50: '#E0F2FF',
  blue200: '#A8DAFF',
  blue400: '#60B8F8',
  blue600: '#2896E0',

  orange50: '#FFF0E0',
  orange300: '#FFAB58',
  orange500: '#F07C18',
  orange700: '#B05200',
  // --- GREEN ---`);

console.log("Fixes applied!");
