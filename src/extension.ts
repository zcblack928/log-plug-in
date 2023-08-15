// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// 获取当前编辑器对象
    let currentEditor: vscode.TextEditor | any = vscode.window.activeTextEditor;
    // 当编辑器文本变化时，重置编辑器对象
    vscode.window.onDidChangeActiveTextEditor(editor => currentEditor = editor);
	// 注册命令
	let disposable = vscode.commands.registerTextEditorCommand('log', async () => {
		try {
			// 获取选中的区域
            const sel = currentEditor.selection;
            // 匹配log的正则表达式
            const reg = /[\S]+\.(cg|cw|ce|ci|cd)$/;
            // 获取单词范围对象
            const ran = currentEditor.document.getWordRangeAtPosition(sel.anchor, reg);
			console.log(ran , "222222");
			
			// const test = currentEditor.document.getText(currentEditor.selection);
			// console.log(test);
            // 获取当前文档内容
            if (!ran) {
                // Promise.reject('请使用如下格式：xxx.cg|xxx.cw|xxx.ce|xxx.ci|xxx.cd');
				vscode.window.showInformationMessage("执行失败：请使用如下格式：xxx.cg|xxx.cw|xxx.ce|xxx.ci|xxx.cd");
                return false;
            }			
			// 获取当前文档对象
            const doc = currentEditor.document;
            // 获取当前行数
            const line = ran.start.line;
            // 获取当前输入文本
            const inputText = doc.getText(ran);
            const prefix = inputText.replace(/\.(cg|cw|ce|ci|cd)/, '');
			// 获取当前行的偏移量
            const type = inputText.split('.')?.pop();
            const idx = doc.lineAt(line).firstNonWhitespaceCharacterIndex;
            // // 格式化新文本
            const map: any = {
                cg: 'log',
                cw: 'warn',
                ce: 'error',
                ci: 'info',
                cd: 'dir',
            }
            // const newText = `console.log('my-log ${test}', ${test})`;
			const newText = `console.${map[type]}('${prefix}', ${prefix})`;
            await currentEditor.edit((e: any) => {
                // 将旧文本替换为新文本
                e.replace(ran, newText);
            })
            // 光标定位到末尾
            const endIdx = new vscode.Position(line, newText.length + idx);
            currentEditor.selection = new vscode.Selection(endIdx, endIdx);

		}catch (e) {
			console.log(e, "111111");
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
