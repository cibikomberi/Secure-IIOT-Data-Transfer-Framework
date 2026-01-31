const crypto = require("crypto");
const { decode } = require("@msgpack/msgpack");

// 32-byte (256-bit) shared secret (hex string)
const SHARED_KEY_HEX = process.env.SHARED_KEY;

// Convert once, reuse
const SHARED_KEY = Buffer.from(SHARED_KEY_HEX, "hex");

// Optional: simple replay protection
let lastSequenceByDevice = new Map();

function decryptMqttPayload(mqttBuffer) {
  // 1️⃣ Unpack MessagePack buffer
  const envelope = decode(mqttBuffer);

  const { d, i, c, t, s } = envelope;

  if (!d || !i || !c || !t || typeof s !== "number") {
    throw new Error("Invalid envelope structure");
  }

  // 2️⃣ Replay protection (basic)
  const lastSeq = lastSequenceByDevice.get(d);
  if (lastSeq !== undefined && s <= lastSeq) {
    throw new Error("Replay attack detected");
  }

  // 3️⃣ Initialize AES-256-GCM decipher
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    SHARED_KEY,
    Buffer.from(i) // 12-byte IV
  );

  // 4️⃣ Set Auth Tag (CRUCIAL)
  decipher.setAuthTag(Buffer.from(t)); // 16 bytes

  // 5️⃣ Decrypt
  let plaintext;
  try {
    plaintext = Buffer.concat([
      decipher.update(Buffer.from(c)),
      decipher.final(), // ❗ Throws if auth tag is wrong
    ]);
  } catch (err) {
    throw new Error("Decryption failed: data tampered or key mismatch");
  }

  // 6️⃣ Save last valid sequence number
  lastSequenceByDevice.set(d, s);

  return {
    deviceId: d,
    sequence: s,
    data: plaintext, // raw Buffer
  };
}

module.exports = { decryptMqttPayload };
