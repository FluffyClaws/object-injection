const readline = require("readline");
const { spawn } = require("child_process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Prompts the user to select an option and starts the appropriate script.
 */
function startScript() {
  console.log('Enter "A" for Autoinsert, or "E" for everything else:');
  rl.question("> ", (input) => {
    const choice = input.trim().toUpperCase();

    if (choice === "A") {
      console.log("Starting autoInsert.js...");
      executeScript("autoInsert.js");
    } else if (choice === "E") {
      console.log("Starting notAutoInsert.js...");
      executeScript("notAutoInsert.js");
    } else {
      console.log('Invalid choice. Please enter "A" or "E".');
      startScript(); // Restart prompt on invalid input
    }
  });
}

/**
 * Executes the specified script using Node.js.
 * @param {string} scriptName - The name of the script to execute.
 */
function executeScript(scriptName) {
  // Close the main readline interface before launching the child script
  rl.close();

  // Spawn the child process
  const child = spawn("node", [scriptName], {
    stdio: ["inherit", "inherit", "inherit"], // Use parent's input/output streams
  });

  // Handle errors or child process completion
  child.on("close", (code) => {
    console.log(`Script ${scriptName} exited with code ${code}`);
    process.exit(code); // Exit the parent script with the child's exit code
  });

  child.on("error", (err) => {
    console.error(`Failed to start script: ${err.message}`);
    process.exit(1); // Exit with an error code
  });
}

// Start the script
startScript();
