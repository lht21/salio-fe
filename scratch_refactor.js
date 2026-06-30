"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts_morph_1 = require("ts-morph");
var project = new ts_morph_1.Project();
project.addSourceFilesAtPaths(["app/**/*.tsx", "app/**/*.ts", "components/**/*.tsx", "components/**/*.ts"]);
var files = project.getSourceFiles();
var updatedCount = 0;
var _loop_1 = function (file) {
    var importDecls = file.getImportDeclarations();
    var hasColorImport = false;
    var globalStylesImport = null;
    for (var _a = 0, importDecls_1 = importDecls; _a < importDecls_1.length; _a++) {
        var imp = importDecls_1[_a];
        if (imp.getModuleSpecifierValue().includes('GlobalStyles')) {
            var named = imp.getNamedImports().find(function (n) { return n.getName() === 'Color'; });
            if (named) {
                hasColorImport = true;
                globalStylesImport = imp;
                named.remove();
                break;
            }
        }
    }
    if (!hasColorImport)
        return "continue";
    updatedCount++;
    console.log("Processing: ".concat(file.getFilePath()));
    if (globalStylesImport && globalStylesImport.getNamedImports().length === 0) {
        globalStylesImport.remove();
    }
    file.addImportDeclaration({
        namedImports: ["useTheme"],
        moduleSpecifier: "@/contexts/ThemeContext"
    });
    file.forEachDescendant(function (node) {
        if (node.getKind() === ts_morph_1.SyntaxKind.PropertyAccessExpression) {
            var propAccess = node;
            var exp = propAccess.getExpression();
            if (exp.getText() === "Color") {
                exp.replaceWithText("colors");
            }
        }
    });
    var styleSheetDecl = null;
    file.forEachDescendant(function (node) {
        if (node.getKind() === ts_morph_1.SyntaxKind.VariableDeclaration) {
            var varDecl = node;
            var name_1 = varDecl.getName();
            var init = varDecl.getInitializer();
            if (name_1 === 'styles' && init && init.getKind() === ts_morph_1.SyntaxKind.CallExpression) {
                var callExp = init;
                var exp = callExp.getExpression();
                if (exp.getText() === "StyleSheet.create") {
                    styleSheetDecl = varDecl;
                }
            }
        }
    });
    if (styleSheetDecl) {
        var initText = styleSheetDecl.getInitializer().getText();
        styleSheetDecl.replaceWithText("getStyles = (colors: any) => ".concat(initText));
    }
    var functions = [];
    file.getFunctions().forEach(function (f) { return functions.push(f); });
    file.getVariableDeclarations().forEach(function (v) {
        var init = v.getInitializer();
        if (init && (init.getKind() === ts_morph_1.SyntaxKind.ArrowFunction || init.getKind() === ts_morph_1.SyntaxKind.FunctionExpression)) {
            if (/^[A-Z]/.test(v.getName())) {
                functions.push(init);
            }
        }
    });
    for (var _b = 0, functions_1 = functions; _b < functions_1.length; _b++) {
        var func = functions_1[_b];
        var body = func.getBody();
        if (body) {
            var fullText = func.getText();
            var usesColors = fullText.includes('colors.');
            var usesStyles = styleSheetDecl && fullText.includes('styles.');
            if (usesColors || usesStyles) {
                if (body.getKind() !== ts_morph_1.SyntaxKind.Block) {
                    var exprText = body.getText();
                    if (body.getKind() === ts_morph_1.SyntaxKind.ParenthesizedExpression) {
                        // Remove parentheses if it's wrapped in them
                        exprText = exprText.substring(1, exprText.length - 1);
                    }
                    body.replaceWithText("{\nreturn ".concat(exprText, ";\n}"));
                }
                body = func.getBody();
                if (body && body.getKind() === ts_morph_1.SyntaxKind.Block) {
                    var injectString = "";
                    if (usesColors || usesStyles) {
                        injectString += "const { colors } = useTheme();\n";
                    }
                    if (usesStyles) {
                        injectString += "const styles = getStyles(colors);\n";
                    }
                    if (injectString) {
                        body.insertStatements(0, injectString);
                    }
                }
            }
        }
    }
};
for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
    var file = files_1[_i];
    _loop_1(file);
}
project.saveSync();
console.log("Refactoring complete. Updated ".concat(updatedCount, " files."));
