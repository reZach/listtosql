import * as vscode from 'vscode';
const editor = vscode.window.activeTextEditor;

export function activate(context: vscode.ExtensionContext) {	
	console.log('Congratulations, your extension "listtosql" is now active!');

	let disposable = vscode.commands.registerCommand('listtosql.run', () => {		

		if (typeof editor !== "undefined") {

			const selections: vscode.Selection[] = editor.selections;
			let text:string;
			editor.edit(builder => {
				for (const selection of selections) {
					
					text = editor.document.getText(selection);

					if (selection.end.line - selection.anchor.line > 1000){
						vscode.window.showInformationMessage("More than 1000 rows detected!");
					}

					text = text.replace(/^(.+)$/gm, "'$1', ");
					text = text.replace(/\r?\n/gm, "");

					// Remove last bit; & finish
					text = text.substr(0, text.length - 2);
					text = "(" + text + ")";
					
					builder.replace(selection, text);
				}
			});
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }