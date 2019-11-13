import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {	
	console.log('Congratulations, your extension "listtosql" is now active!');

	let disposable = vscode.commands.registerCommand('listtosql.run', () => {		
		
		let editor = vscode.window.activeTextEditor;
		if (typeof editor !== "undefined") {

			const selections: vscode.Selection[] = editor.selections;
			let text:string;
			editor.edit(builder => {

				if (typeof editor !== "undefined"){
					for (const selection of selections) {										
						text = editor.document.getText(selection);
	
						// If we didn't select any text
						if (text.length <= 0){
							continue;
						}
	
						// SQL inserts max out at 1000 rows
						if (selection.end.line - selection.anchor.line > 1000){
							vscode.window.showInformationMessage("More than 1000 rows detected!");
						}
	
						text = text.replace(/'/g, "''");
						text = text.replace(/^(.+)$/gm, "'$1', ");
						text = text.replace(/\r?\n/gm, "");
	
						// Remove last bit; & finish
						text = text.substr(0, text.length - 2);
						text = "(" + text + ")";
						
						builder.replace(selection, text);
					}		
				}				
			});
		} else {
			vscode.window.showErrorMessage("Could not run command with no editor window open.");
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }