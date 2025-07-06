import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// interface TemplateItem extends vscode.QuickPickItem
// {
// 	// filename: string;
// 	// content: string;
// }

function toPascalCase(name: string): string {
  return name
    .replace(/[-_ ]+/g, ' ')                     // 把 - _ 等转换为空格
    .split(' ')                                  // 分词
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // 首字母大写
    .join('');                                   // 重新拼接为 PascalCase
}

export function activate(context: vscode.ExtensionContext) {
	vscode.window.showInformationMessage("Fuck!");
	const disposable = vscode.commands.registerCommand(
		'avalonia-addfile.create-file',
		async () => {
			const folders = vscode.workspace.workspaceFolders;
			if (!folders) {
				vscode.window.showErrorMessage('=Must Under a workspace folder');
				return;
			}

			// 定义选择标签
			// const fileTemplates: TemplateItem[] = [
			// 	{
			// 		label: "Models"
			// 	},
			// 	{
			// 		label: "Views"
			// 	},
			// 	{
			// 		label: "ViewModels"
			// 	}
			// ];
			const fileTemplates = [
				{
					label: "Models"
				},
				{
					label: "Views"
				},
				{
					label: "ViewModels"
				}
			];

			// 定义选项框
			const pick = await vscode.window.showQuickPick(fileTemplates, {
				placeHolder: 'Choose your file Template'
			});
			// 取消输入
			if (!pick) {
				vscode.window.showWarningMessage("Canceling");
				return;
			}

			// 定义文件名称输入
			let filename = await vscode.window.showInputBox({
				prompt: 'File Name without ',
				placeHolder: '',
				validateInput: (value) => {
					return value.trim() === '' ? `File name can't be none` : null;
				}
			});

			if (!filename) {
				vscode.window.showWarningMessage("Canceling");
				return;
			}

			filename = toPascalCase(filename);


			const workspaceRoot = folders[0].uri.fsPath;
			const templateDir = path.join(context.extensionPath, 'templates');
			const workspaceName = vscode.workspace.name || "";

			const replacements = {
				'{{filename}}': `${filename}`,
				'{{namespace}}': `${workspaceName}.${pick.label}`
			};

			const tplTypeFileMap: Record<string, string[]> = {
				ViewModels: ['viewmodels.cs.tpl'],
				Views: ['views.axaml.tpl', 'views.cs.tpl'],
				Models: ['models.cs.tpl'],
			};

			const filesToCreate = tplTypeFileMap[pick.label];

			if (!filesToCreate)
			{
				vscode.window.showErrorMessage(`Error Type ${pick.label}`);
				return;
			}

			for (const file of filesToCreate)
			{
				const tplPath = path.join(templateDir, file);
				const content = fs.readFileSync(tplPath, 'utf8');
				const replacedContent = Object.entries(replacements).reduce(
					(acc, [key, val]) => acc.replace(new RegExp(key, 'g'), val),
					content
				);
				const filePath = path.join(workspaceRoot, pick.label, `${filename}.${file.split('.')[1]}`);
				fs.writeFileSync(filePath, replacedContent, 'utf8');
				const newDoc = await vscode.workspace.openTextDocument(filePath);
				vscode.window.showTextDocument(newDoc);
			}

		}
	);
	context.subscriptions.push(disposable);
}
export function deactivate() {}
