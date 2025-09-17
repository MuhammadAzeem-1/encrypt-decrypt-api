const forge = require("node-forge");

function decryptDataWithRSA_AES(encrypted) {
  const _privateKeyPem = process.env.NEXT_PUBLIC_PRIVATE_KEY_PEM;
  if (!_privateKeyPem) {
    throw new Error("Private key is not defined in environment variables");
  }
  const privateKeyPem = _privateKeyPem.trim();

  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

  // Decode base64 and split encrypted parts
  const decodedCombined = forge.util.decode64(encrypted);
  const [encryptedAesKey, encryptedIv, encryptedData] =
    decodedCombined.split(":");

  if (!encryptedAesKey || !encryptedIv || !encryptedData) {
    throw new Error("Encrypted data format is invalid");
  }

  // Decrypt AES key and IV
  const aesKey = forge.util.decode64(
    privateKey.decrypt(forge.util.decode64(encryptedAesKey), "RSA-OAEP")
  );
  const iv = forge.util.decode64(
    privateKey.decrypt(forge.util.decode64(encryptedIv), "RSA-OAEP")
  );

  // AES decrypt JSON
  const encryptedBytes = forge.util.decode64(encryptedData);
  const buffer = forge.util.createBuffer(encryptedBytes, "raw");
  const decipher = forge.cipher.createDecipher("AES-CBC", aesKey);
  decipher.start({ iv });
  decipher.update(buffer);

  if (!decipher.finish()) {
    throw new Error("AES decryption failed");
  }

  return JSON.parse(decipher.output.toString());
}

// Handle command line arguments
if (require.main === module) {
  const payload = process.argv[2];
  if (!payload) {
    console.error("Please provide encrypted data to decrypt");
    process.exit(1);
  }

  try {
    const result = decryptDataWithRSA_AES(payload);
    console.log("Decrypted result:", result);
  } catch (error) {
    console.error("Decryption error:", error.message);
    process.exit(1);
  }
}

module.exports = { decryptDataWithRSA_AES };
