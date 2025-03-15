// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

let translatedContent = false;
let originalContent = "";

async function fetchData(fileContent, fileName, editor, level = "Complete") {
	try {
		const data = {
			file_name: fileName,  
			language: "python",
			file_content: fileContent,
			level: level
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
		translatedContent = true
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

			if (!translatedContent) {
                originalContent = fullContent;  // Saving original content to reset later
            }
			
			// Display the content (or you can process it as needed)
			//console.log("Full document content printed");

			// Optionally display it in an information message
			//vscode.window.showInformationMessage("Full document content retrieved.");
			vscode.window.showInformationMessage('Code translation: trigger a button', 'Complete', 'Partial', 'Reset')
            .then(selection => {
                if (selection !== undefined) {
                    // Log the selected action
                    console.log(selection);

                    // Handle the selection
                    if (selection === "Complete") {
                        fetchData(fullContent, fileName, editor);
						vscode.window.showInformationMessage("Complete translation is performing...");
                    } else if (selection === "Partial") {
                        fetchData(fullContent, fileName, editor, "Partial"); // partial means only comments
						vscode.window.showInformationMessage("Partial translation is performing...");
                    } else {
						if(translatedContent) {
							updateDocument(editor, originalContent);
							translatedContent = false
							vscode.window.showInformationMessage("Reset file");
						}
                        //console.log("Reset the opened file content back to its original language.");
                    }
                }
            });
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