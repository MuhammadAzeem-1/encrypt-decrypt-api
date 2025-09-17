const forge = require("node-forge");

function encryptDataWithRSA_AES(payload) {
  const jsonData = JSON.stringify(payload);

  // Generate AES key (256-bit) and IV (16 bytes)
  const aesKey = forge.random.getBytesSync(32);
  const iv = forge.random.getBytesSync(16);

  // AES Encryption
  const cipher = forge.cipher.createCipher("AES-CBC", aesKey);
  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(jsonData, "utf8"));
  cipher.finish();
  const encryptedJsonData = forge.util.encode64(cipher.output.getBytes());

  const _publicKeyPem = process.env.NEXT_PUBLIC_KEY_PEM;
  if (!_publicKeyPem) {
    throw new Error("Public key is not defined in environment variables");
  }
  const publicKeyPem = _publicKeyPem.trim();
  // RSA Encryption for AES key and IV
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encryptedAesKey = forge.util.encode64(
    publicKey.encrypt(forge.util.encode64(aesKey), "RSA-OAEP")
  );
  const encryptedIv = forge.util.encode64(
    publicKey.encrypt(forge.util.encode64(iv), "RSA-OAEP")
  );

  // Combine and return final result as base64
  const combined = `${encryptedAesKey}:${encryptedIv}:${encryptedJsonData}`;
  return forge.util.encode64(combined);
}

// Handle command line arguments
if (require.main === module) {
  const payload = process.argv[2];
  if (!payload) {
    console.error("Please provide a payload to encrypt");
    process.exit(1);
  }
  
  try {
    const result = encryptDataWithRSA_AES(JSON.parse(payload));
    console.log(result);
  } catch (error) {
    console.error("Encryption error:", error.message);
    process.exit(1);
  }
}

module.exports = { encryptDataWithRSA_AES };
