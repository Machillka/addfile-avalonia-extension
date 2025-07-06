import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface TemplateItem extends vscode.QuickPickItem
{
	// filename: string; // 创建文件名字
	// content: string;
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
			const fileTemplates: TemplateItem[] = [
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
			vscode.window.showInformationMessage(`你选择了: ${pick.label}`);

			// 定义文件名称输入
			const filename = await vscode.window.showInputBox({
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

			const workspaceRoot = folders[0].uri.fsPath;
			const templateDir = path.join(context.extensionPath, 'templates');
			const workspaceName = vscode.workspace.name || "";

			const replacements = {
				'{{fileName}}': `${filename}`,
				'{{namespaceName}}': path.join(workspaceName, pick.label)
			};

			switch (pick.label)
			{
				case "View":
					
			}
		}
	);
	context.subscriptions.push(disposable);
}
export function deactivate() {}
