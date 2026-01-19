// functions/index.js

const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Get a Firestore database reference
const db = admin.firestore();

// Define your Avatar Stages Enum
// This should ideally match or be consistent with what your frontend uses,
// especially if you plan to use the numeric enum values. The current
// requestNftMint function primarily uses stageName and stageToMint (number)
// passed from the client.
// eslint-disable-next-line no-unused-vars
const AVATAR_STAGES_ENUM = {
  Novice: 0,
  Apprentice: 1,
  Practitioner: 2,
  Scholar: 3,
  Sage: 4,
  Epictetus: 5,
};

/**
 * HTTP Cloud Function to log a request for an NFT mint.
 * Expects a POST request with a JSON body containing:
 * {
 * "walletAddress": "0x...",    // string, player's wallet address
 * "stageToMint": 1,             // number, e.g., enum value for the stage
 * "stageName": "Apprentice",    // string, e.g., "Apprentice"
 * "reason": "Completed Chapter 5" // string, optional reason
 * }
 */
exports.requestNftMint = functions.https.onRequest(async (req, res) => {
  // Set CORS headers for preflight requests and actual requests
  // For development, '*' is okay.
  // For production, restrict to your frontend's domain.
  res.set("Access-Control-Allow-Origin", "*");
  // GET is not used by this function but often included
  res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  // Authorization if you add auth later
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight OPTIONS request for CORS
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  // Ensure the request is a POST request
  if (req.method !== "POST") {
    console.log("Received non-POST request:", req.method);
    res.status(405).json({
      error: "Method Not Allowed",
      message: "Please use POST.",
    });
    return;
  }

  try {
    console.log("Received request body:", req.body);

    const { walletAddress, stageToMint, stageName, reason } = req.body;

    // --- Basic Input Validation ---
    if (!walletAddress || typeof walletAddress !== "string" ||
        !walletAddress.toLowerCase().startsWith("0x") ||
        walletAddress.length !== 42) {
      console.error("Validation Error: Invalid walletAddress", walletAddress);
      return res.status(400).json({
        error: "Invalid or missing walletAddress.",
      });
    }
    if (stageToMint === undefined || typeof stageToMint !== "number" ||
        stageToMint < 0) {
      console.error("Validation Error: Invalid stageToMint", stageToMint);
      return res.status(400).json({
        error: "Invalid or missing stageToMint " +
               "(must be a non-negative number).",
      });
    }
    if (!stageName || typeof stageName !== "string" ||
        stageName.trim() === "") {
      console.error("Validation Error: Invalid stageName", stageName);
      return res.status(400).json({
        error: "Invalid or missing stageName.",
      });
    }
    const requestReason = reason && typeof reason === "string" ?
      reason.trim() : "Player met in-game criteria.";


    // TODO (Optional future enhancement):
    // - Add authentication/authorization to this function if needed
    //   (e.g., check an API key, or use Firebase App Check).
    // - Check against `awardedNftsByWallet` collection to prevent creating
    //   duplicate pendingMints if already awarded.
    //   const awardedDoc = await db.collection('awardedNftsByWallet')
    //                              .doc(walletAddress.toLowerCase()).get();
    //   if (awardedDoc.exists && awardedDoc.data()[stageToMint.toString()]) {
    //       console.log(`NFT for stage ${stageName} ` +
    //                   `already awarded to ${walletAddress}.`);
    //       return res.status(409).json({ success: false,
    //            message: "NFT already awarded for this stage." });
    //   }
    // - Check existing pendingMints for an identical pending request.

    // Auto-generate Firestore document ID
    const pendingMintRef = db.collection("pendingMints").doc();
    await pendingMintRef.set({
      // Store wallet addresses consistently (e.g., lowercase)
      walletAddress: walletAddress.toLowerCase(),
      stageToMint: stageToMint, // Number (e.g., 1)
      stageName: stageName, // String (e.g., "Apprentice")
      reason: requestReason,
      // Firestore server-side timestamp
      requestedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: "Pending Admin Minting", // Initial status for admin to track
    });

    const logMessage = `Pending mint created. ID: ${pendingMintRef.id}, ` +
                       `Wallet: ${walletAddress}, Stage: ${stageName}`;
    console.log(`${logMessage} (${stageToMint})`);
    // 201 Created is often used for successful resource creation
    res.status(201).json({
      success: true,
      message: "Mint request logged successfully.",
      pendingMintId: pendingMintRef.id,
    });
  } catch (error) {
    console.error("CRITICAL Error in requestNftMint function:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
});
