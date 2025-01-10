const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Validates if the input follows the "WidthxHeight" format.
 * Allows empty inputs and "null" as valid.
 * @param {string} input - The user input to validate.
 * @returns {boolean} True if the input is in the correct format or "null", otherwise false.
 */
function isValidFormat(input) {
  const regex = /^\d+x\d+$/;
  return input === "" || input === "null" || regex.test(input);
}

/**
 * Parses a comma-separated string of sizes in the "WidthxHeight" format.
 * @param {string} inputSizes - Comma-separated sizes in "WidthxHeight" format.
 * @returns {Array|null} An array of parsed size pairs or null if the input was "null".
 */
function parseSizes(inputSizes) {
  if (inputSizes.toLowerCase() === "null") return null;
  if (!inputSizes) return [];
  return inputSizes.split(",").map((size) => {
    const [width, height] = size.split("x");
    return [parseInt(width, 10), parseInt(height, 10)];
  });
}

/**
 * Prompts the user with a query and returns their response.
 * @param {string} query - The question to ask the user.
 * @returns {Promise<string>} A promise that resolves with the user's input.
 */
function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

/**
 * Ensures the user inputs sizes in the correct format.
 * @param {string} promptMessage - The prompt message to ask the user.
 * @returns {Promise<string>} A promise that resolves with valid input.
 */
async function getValidInput(promptMessage) {
  let input;
  do {
    input = await askQuestion(promptMessage);
    if (
      input !== "" &&
      input.toLowerCase() !== "null" &&
      input.split(",").some((size) => !isValidFormat(size.trim()))
    ) {
      console.log(
        "Invalid format. Enter sizes in WidthxHeight format (e.g., 150x50), or type 'null' to set a null value."
      );
    }
  } while (
    input !== "" &&
    input.toLowerCase() !== "null" &&
    input.split(",").some((size) => !isValidFormat(size.trim()))
  );
  return input;
}

/**
 * Generates the final size map based on user inputs.
 * @param {Array} inputs - Array of user inputs for each device type.
 * @param {Array} devices - Array of device labels ('d', 't', 'm').
 * @returns {Object} The generated size map.
 */
function generateSizeMap(inputs, devices) {
  let result = {};
  const envExt = [];

  inputs.forEach((sizes, index) => {
    const envs = devices[index];

    if (sizes === null || sizes.length === 0) return;

    if (!result.sizes) {
      result.sizes = sizes;
      result.envs = envs;
    } else {
      envExt.push({ sizes, envs });
    }
  });

  if (envExt.length > 0) {
    result.envExt = envExt;
  }

  return result;
}

/**
 * Main function to process inputs and generate the size map.
 */
async function processInputs() {
  console.log(
    "Enter sizes in WidthxHeight format (comma-separated, e.g., 150x50). Leave empty to skip or type 'null' to set a null value."
  );

  const desktopInput = await getValidInput("Enter Desktop sizes: ");
  const tabletInput = await getValidInput("Enter Tablet sizes: ");
  const mobileInput = await getValidInput("Enter Mobile sizes: ");

  rl.close();

  const inputs = [
    parseSizes(desktopInput),
    parseSizes(tabletInput),
    parseSizes(mobileInput),
  ];
  const devices = ["d", "t", "m"];

  const sizeMap = generateSizeMap(inputs, devices);

  console.log(JSON.stringify(sizeMap, null, 2));
}

// Execute the script
processInputs();
