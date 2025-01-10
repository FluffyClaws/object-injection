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
  // RegEx to match "WidthxHeight" format without spaces, e.g., 150x50
  const regex = /^\d+x\d+$/;
  return input === "" || input === "null" || regex.test(input);
}

/**
 * Parses a comma-separated string of sizes in the "WidthxHeight" format.
 * @param {string} inputSizes - Comma-separated sizes in "WidthxHeight" format.
 * @returns {Array|null} An array of parsed size pairs or null if the input was "null".
 */
function parseSizes(inputSizes) {
  if (inputSizes.toLowerCase() === "null") return null; // Return null if the input is "null"
  if (!inputSizes) return []; // Return empty array if no input is provided

  // Split by commas and parse each size
  return inputSizes.split(",").map((size) => {
    const [width, height] = size.split("x");
    return [parseInt(width, 10), parseInt(height, 10)];
  });
}

/**
 * Prompts the user with a query and returns their response.
 * @param {string} query -
 * @returns {Promise<string>}
 */
function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

/**
 * @param {Array|null} desktopSizes - Array of desktop size pairs or null.
 * @param {Array|null} tabletSizes - Array of tablet size pairs or null.
 * @param {Array|null} mobileSizes - Array of mobile size pairs or null.
 * @returns {Object} A JSON object representing the size map.
 */
function createSizeMap(desktopSizes, tabletSizes, mobileSizes) {
  const sizeMap = [];

  // If the user enters "null", it should be included in the map
  if (desktopSizes === null) {
    sizeMap.push([[992], null]);
  } else if (desktopSizes.length > 0) {
    sizeMap.push([[992], desktopSizes]);
  }

  if (tabletSizes === null) {
    sizeMap.push([[768], null]);
  } else if (tabletSizes.length > 0) {
    sizeMap.push([[768], tabletSizes]);
  }

  if (mobileSizes === null) {
    sizeMap.push([[0], null]);
  } else if (mobileSizes.length > 0) {
    sizeMap.push([[0], mobileSizes]);
  }

  return { sizeMap };
}

/**
 * Ensures the user inputs sizes in the correct format.
 * Allows for empty input or "null" as valid.
 * @param {string} promptMessage - The prompt to ask the user.
 * @returns {Promise<string>} A promise that resolves with a valid input in the correct format.
 */
async function getValidInput(promptMessage) {
  let input;
  do {
    input = await askQuestion(promptMessage);
    // Allow for multiple valid size pairs or "null"
    if (
      input !== "" &&
      input.toLowerCase() !== "null" &&
      input.split(",").some((size) => !isValidFormat(size.trim()))
    ) {
      console.log(
        "Format is not correct. Please enter sizes in WidthxHeight format (e.g., 150x50), or type 'null' to use a null value."
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
 * Function to generate the size map based on user input.
 */
async function generateSizeMap() {
  // Print the instruction
  console.log(
    "Enter sizes in comma separated WidthxHeight format (without spaces). Leave empty to skip, or type 'null' to set a null value."
  );

  // Gather user input for desktop, tablet, and mobile sizes with validation
  const desktopInput = await getValidInput("Enter Desktop sizes: ");
  const tabletInput = await getValidInput("Enter Tablet sizes: ");
  const mobileInput = await getValidInput("Enter Mobile sizes: ");

  rl.close();

  // Parse the input sizes
  const desktopSizes = parseSizes(desktopInput);
  const tabletSizes = parseSizes(tabletInput);
  const mobileSizes = parseSizes(mobileInput);

  // Check if all inputs are null or empty
  if (
    (desktopSizes === null || desktopSizes.length === 0) &&
    (tabletSizes === null || tabletSizes.length === 0) &&
    (mobileSizes === null || mobileSizes.length === 0)
  ) {
    console.log("No size config needed");
    return; // Exit early
  }

  // Create the size map
  const jsonOutput = createSizeMap(desktopSizes, tabletSizes, mobileSizes);

  // Print the result
  console.log(JSON.stringify(jsonOutput, null, 2));
}

// Call the function to generate the size map
generateSizeMap();
