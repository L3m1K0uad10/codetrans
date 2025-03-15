// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

async function fetchData(fileContent, fileName, editor) {
	try {
		const data = {
			file_name: fileName,  
			language: "python",
			file_content: fileContent
		};
	  
		const response = await fetch('http://127.0.0.1:8000/processing/translate/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',  // Tell the server we're sending JSON
			},
			body: JSON.stringify(data),  // Convert the data object to a JSON string
		});

		if(!response.ok) {
			throw new Error("Could not fetch resource")
		}

		const responseData = await response.json();
    	//console.log("Translated code:", responseData.translated_code); 

		// Now update the opened file content with the translated code
        updateDocument(editor, responseData.translated_code);
	}catch(error) {
		console.error(error);
	}
}

function updateDocument(editor, translatedCode) {
    // starting an edit session to update the content of the editor
    editor.edit(editBuilder => {
        const fullRange = new vscode.Range(
            editor.document.positionAt(0), 
            editor.document.positionAt(editor.document.getText().length)
        );
        // replace the entire content with the translated code
        editBuilder.replace(fullRange, translatedCode);
    });
}

function activate(context) {
	console.log('Your extension "codetrans" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	// Register a command to retrieve the full document content
	// my extension.getFullDocumentContent should match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.getFullDocumentContent', function () {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			// Retrieve the full content of the active document
			const document = editor.document;
			const fileName = document.fileName; 
			const fullContent = getFullDocumentContent(document);
			
			// Display the content (or you can process it as needed)
			console.log("Full document content printed");

			fetchData(fullContent, fileName, editor);

			// Optionally display it in an information message
			vscode.window.showInformationMessage("Full document content retrieved.");
		}
	});

	context.subscriptions.push(disposable);
}

function getFullDocumentContent(document) {
    return document.getText(); // Retrieves the entire content of the document as a string
}

module.exports = {
	activate,
	deactivate
}

 // This method is called when your extension is deactivated
function deactivate() {}


/*  in package.json
activationEvents: I've added "onCommand:extension.getFullDocumentContent",
which means the extension will be activated whenever the extension.getFullDocumentContent 
command is executed.
*/