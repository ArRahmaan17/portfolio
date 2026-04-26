const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const STORAGE_ROOT = path.resolve(__dirname, "../../storage");

const ensureDirectory = async (subDirectory) => {
  const directory = path.join(STORAGE_ROOT, subDirectory);
  await fs.mkdir(directory, { recursive: true });
  return directory;
};

const saveFileBuffer = async ({ subDirectory, extension, buffer }) => {
  const directory = await ensureDirectory(subDirectory);
  const fileName = `${crypto.randomUUID()}.${extension}`;
  const absolutePath = path.join(directory, fileName);

  await fs.writeFile(absolutePath, buffer);

  return `/storage/${subDirectory}/${fileName}`;
};

module.exports = {
  saveFileBuffer,
};
