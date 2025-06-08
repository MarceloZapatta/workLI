/**
 * Checks if the folder exists and is not a file
 */
export async function folderExists(folder: string): Promise<boolean> {
  let stat: false | Deno.FileInfo = false;
  try {
    stat = await Deno.stat(`${folder}`);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      stat = false;
    } else {
      throw error;
    }
  }

  return stat && stat.isDirectory;
}

/**
 * Checks if the folder exists and is not a file
 */
export async function fileExists(filePath: string): Promise<boolean> {
  let stat: false | Deno.FileInfo = false;
  try {
    stat = await Deno.stat(`${filePath}`);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      stat = false;
    } else {
      throw error;
    }
  }

  return stat && stat.isFile;
}

/**
 * Update env file with new keypair values
 */
export async function updateEnvFile(filePath: string, keyValues: Record<string, string>) {
  // Convert the updated env object into the .env file format
  const updatedContent = Object.entries(keyValues)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  // Write the updated content back to the .env file
  try {
    await Deno.writeTextFile(filePath, updatedContent);
  } catch (error) {
    console.error(`Error writing to .env file (${filePath}):`, error);
  }
}
