import * as vscode from 'vscode';

// Returns an array of elements from raw text
// that will get parsed into valid SQL
const getSQLElements = function (text: string) {
	
	// if we didn't select any text
	if (text.length <= 0) {
		return [];
	}

	// trim leading/trailing whitespace and line terminators
	text = text.trim();

	// split selection by newlines
	const regex = /\r?\n/g;
	let split = regex[Symbol.split](text);

	// remove empty elements
	split = split.filter(s => s.length > 0);

	// transform each element
	for (let i = 0; i < split.length; i++) {

		split[i] = split[i].replace(/'/g, "''"); // escape single quotes
		split[i] = `'${split[i]}'`;
	}

	return split;
};

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "listtosql" is now active!');

	let disposable = vscode.commands.registerCommand("listtosql.run", () => {

		let editor = vscode.window.activeTextEditor;
		if (typeof editor !== "undefined") {

			const selections: vscode.Selection[] = editor.selections;
			let text: string;
			editor.edit(builder => {

				if (typeof editor !== "undefined") {
					for (const selection of selections) {
						text = editor.document.getText(selection);

						let split = getSQLElements(text);
						if (split.length === 0){
							vscode.window.showInformationMessage("No text was selected, cannot convert into SQL.");
							return;
						}

						let result = "";						
						let sets = Math.ceil(split.length / 1000); // get number of 1000-count sets we need

						for (let j = 0; j < sets; j++) {
							let joined = split.slice((j * 1000), (j * 1000) + 999).join(", "); // get 1000 elements for set

							if (sets > 1) {

								// For >1000 count selections, we need to separate
								// each set in the output
								if (j > 0) {
									result += "\r\n\r\n";
								}

								result += `-- Set ${j + 1} / ${sets}\r\n(${joined})`;
							} else {
								result += `(${joined})`;
							}
						}

						if (sets > 1) {
							vscode.window.showInformationMessage("More than 1000 rows detected, creating multiple sets.");
						}

						builder.replace(selection, result);
					}
				}
			});
		} else {
			vscode.window.showErrorMessage("Could not run command with no editor window open.");
		}
	});
	let disposableVertical = vscode.commands.registerCommand("listtosql.run.vertical", () => {

		let editor = vscode.window.activeTextEditor;
		if (typeof editor !== "undefined") {

			const selections: vscode.Selection[] = editor.selections;
			let text: string;
			editor.edit(builder => {

				if (typeof editor !== "undefined") {
					for (const selection of selections) {
						text = editor.document.getText(selection);

						let split = getSQLElements(text);
						if (split.length === 0){
							vscode.window.showInformationMessage("No text was selected, cannot convert into SQL.");
							return;
						}

						let result = "";						
						let sets = Math.ceil(split.length / 1000); // get number of 1000-count sets we need

						for (let j = 0; j < sets; j++) {
							let joined = split.slice((j * 1000), (j * 1000) + 999).join(",\r\n"); // get 1000 elements for set

							if (sets > 1) {

								// For >1000 count selections, we need to separate
								// each set in the output
								if (j > 0) {
									result += "\r\n\r\n";
								}

								result += `-- Set ${j + 1} / ${sets}\r\n(${joined})`;
							} else {
								result += `(${joined})`;
							}
						}

						if (sets > 1) {
							vscode.window.showInformationMessage("More than 1000 rows detected, creating multiple sets.");
						}

						builder.replace(selection, result);
					}
				}
			});
		} else {
			vscode.window.showErrorMessage("Could not run command with no editor window open.");
		}
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposableVertical);
}

export function deactivate() { }