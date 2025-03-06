// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Your extension "codetrans" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	/* 1- const disposable = vscode.commands.registerCommand('codetrans.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from codetrans!');
	}); */

	// Register a command to retrieve the full document content
	// my extension.getFullDocumentContent should match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.getFullDocumentContent', function () {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			// Retrieve the full content of the active document
			const document = editor.document;
			const fullContent = getFullDocumentContent(document);
			
			// Display the content (or you can process it as needed)
			console.log("Full document content:", fullContent);

			// Optionally display it in an information message
			vscode.window.showInformationMessage("Full document content retrieved.");
		}
	});

	context.subscriptions.push(disposable);
}

/* 2- // This method is called when your extension is deactivated
function deactivate() {} */

function getFullDocumentContent(document) {
    return document.getText(); // Retrieves the entire content of the document as a string
}

module.exports = {
	activate,
	deactivate
}

function deactivate() {}


/*  in package.json
activationEvents: I've added "onCommand:extension.getFullDocumentContent",
which means the extension will be activated whenever the extension.getFullDocumentContent 
command is executed.
*/