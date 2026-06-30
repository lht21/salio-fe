import { Project, SyntaxKind, VariableDeclaration, CallExpression, PropertyAccessExpression } from "ts-morph";

const project = new Project();
project.addSourceFilesAtPaths(["app/**/*.tsx", "app/**/*.ts", "components/**/*.tsx", "components/**/*.ts"]);

const files = project.getSourceFiles();
let updatedCount = 0;

for (const file of files) {
    const importDecls = file.getImportDeclarations();
    let hasColorImport = false;
    let globalStylesImport: any = null;

    for (const imp of importDecls) {
        if (imp.getModuleSpecifierValue().includes('GlobalStyles')) {
            const named = imp.getNamedImports().find(n => n.getName() === 'Color');
            if (named) {
                hasColorImport = true;
                globalStylesImport = imp;
                named.remove();
                break;
            }
        }
    }

    if (!hasColorImport) continue;
    
    updatedCount++;
    console.log(`Processing: ${file.getFilePath()}`);

    if (globalStylesImport && globalStylesImport.getNamedImports().length === 0) {
        globalStylesImport.remove();
    }

    file.addImportDeclaration({
        namedImports: ["useTheme"],
        moduleSpecifier: "@/contexts/ThemeContext"
    });

    file.forEachDescendant(node => {
        if (node.getKind() === SyntaxKind.PropertyAccessExpression) {
            const propAccess = node as PropertyAccessExpression;
            const exp = propAccess.getExpression();
            if (exp.getText() === "Color") {
                exp.replaceWithText("colors");
            }
        }
    });

    let styleSheetDecl: any = null;
    file.forEachDescendant(node => {
        if (node.getKind() === SyntaxKind.VariableDeclaration) {
            const varDecl = node as VariableDeclaration;
            const name = varDecl.getName();
            const init = varDecl.getInitializer();
            if (name === 'styles' && init && init.getKind() === SyntaxKind.CallExpression) {
                const callExp = init as CallExpression;
                const exp = callExp.getExpression();
                if (exp.getText() === "StyleSheet.create") {
                    styleSheetDecl = varDecl;
                }
            }
        }
    });

    if (styleSheetDecl) {
        const initText = styleSheetDecl.getInitializer().getText();
        styleSheetDecl.replaceWithText(`getStyles = (colors: any) => ${initText}`);
    }

    const functions: any[] = [];
    
    file.getFunctions().forEach(f => functions.push(f));
    file.getVariableDeclarations().forEach(v => {
        const init = v.getInitializer();
        if (init && (init.getKind() === SyntaxKind.ArrowFunction || init.getKind() === SyntaxKind.FunctionExpression)) {
            if (/^[A-Z]/.test(v.getName())) {
                functions.push(init);
            }
        }
    });

    for (const func of functions) {
        let body = func.getBody();
        if (body) {
            const fullText = func.getText();
            const usesColors = fullText.includes('colors.');
            const usesStyles = styleSheetDecl && fullText.includes('styles.');
            
            if (usesColors || usesStyles) {
                if (body.getKind() !== SyntaxKind.Block) {
                    let exprText = body.getText();
                    if (body.getKind() === SyntaxKind.ParenthesizedExpression) {
                        // Remove parentheses if it's wrapped in them
                        exprText = exprText.substring(1, exprText.length - 1);
                    }
                    body.replaceWithText(`{\nreturn ${exprText};\n}`);
                }
                
                body = func.getBody(); 
                
                if (body && body.getKind() === SyntaxKind.Block) {
                    let injectString = "";
                    if (usesColors || usesStyles) {
                        injectString += `const { colors } = useTheme();\n`;
                    }
                    if (usesStyles) {
                        injectString += `const styles = getStyles(colors);\n`;
                    }
                    if (injectString) {
                        body.insertStatements(0, injectString);
                    }
                }
            }
        }
    }
}

project.saveSync();
console.log(`Refactoring complete. Updated ${updatedCount} files.`);
