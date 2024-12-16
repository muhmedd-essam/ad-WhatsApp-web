const express = require("express");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const QRCode = require("qrcode");
const path = require("path");
const axios = require("axios");
const fs = require('fs');
const { stringify, parse } = require('flatted');
// Configuration
const CONFIG = {
  port: process.env.PORT || 4000,
  allowedOrigins: "*",
  puppeteerOptions: {
    headless: true,
    timeout: 2000,
    args: [
      "--no-sandbox",  // قد يكون هذا ضروريًا في بعض البيئات مثل Docker
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-gpu", // تعطيل الـ GPU لتقليل التأثيرات الرسومية

    ],
  },
};

// State management
class StateManager {
  constructor() {
    this.clients = new Map();
    this.qrCodes = new Map();
    this.clientsReady = new Map(); // Track ready state of clients
    this.messages = [];
    this.campaigns = new Map();
    this.autoReplyRules = new Map();
    this.qrPromises = new Map(); // Add this line
    this.connectionStates = new Map();
  }

  addClient(userId, client) {
    console.log(`Adding client for user ${userId}`);
    this.clients.set(userId, client);
    this.clientsReady.set(userId, false);
  }

  removeClient(userId) {
    console.log(`Removing client for user ${userId}`);
    this.clients.delete(userId);
    this.clientsReady.delete(userId);
    this.qrCodes.delete(userId);
    this.connectionStates.delete(userId);
  }

  setClientReady(userId) {
    console.log(`Setting client ready for user ${userId}`);
    this.clientsReady.set(userId, true);
  }

  isClientReady(userId) {
    const ready = this.clientsReady.get(userId) || false;
    console.log(`Checking if client ready for user ${userId}: ${ready}`);
    return ready;
  }

  getClient(userId) {
    const client = this.clients.get(userId);
    console.log(`Getting client for user ${userId}: ${!!client}`);
    return client;
  }

  setQRCode(userId, qr) {
    this.qrCodes.set(userId, qr);
    // Resolve the promise if it exists
    if (this.qrPromises.has(userId)) {
      const { resolve } = this.qrPromises.get(userId);
      resolve(qr);
      this.qrPromises.delete(userId);
    }
  }

  getQRCode(userId) {
    return this.qrCodes.get(userId);
  }

  setConnectionState(userId, state) {
    this.connectionStates.set(userId, state);
  }

  getConnectionState(userId) {
    return this.connectionStates.get(userId);
  }

  async ensureClientConnection(userId) {
    const client = this.getClient(userId);

    if (!client) {
      throw new Error("No WhatsApp client found. Please initialize first.");
    }

    // Check if client is already connected
    if (this.isClientReady(userId)) {
      return client;
    }

    // Wait for client to be ready (with timeout)
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Connection timeout. Please try again."));
      }, 30000); // 30 second timeout

      const checkConnection = setInterval(async () => {
        if (this.isClientReady(userId)) {
          clearInterval(checkConnection);
          clearTimeout(timeout);
          resolve(client);
        }
      }, 1000); // Check every second
    });
  }

  waitForQRCode(userId) {
    return new Promise((resolve, reject) => {
      // Set timeout to prevent infinite waiting
      const timeout = setTimeout(() => {
        if (this.qrPromises.has(userId)) {
          const { reject } = this.qrPromises.get(userId);
          reject(new Error("QR code generation timeout"));
          this.qrPromises.delete(userId);
        }
      }, 30000); // 30 seconds timeout

      this.qrPromises.set(userId, { resolve, reject, timeout });
    });
  }

  clearQRPromise(userId) {
    if (this.qrPromises.has(userId)) {
      const { timeout } = this.qrPromises.get(userId);
      clearTimeout(timeout);
      this.qrPromises.delete(userId);
    }
  }

  addMessage(message) {
    this.messages.push(message);
  }

  addCampaign(campaignId, campaign) {
    this.campaigns.set(campaignId, campaign);
  }

  setAutoReplyRules(userId, rules) {
    this.autoReplyRules.set(userId, rules);
  }

  getAutoReplyRules(userId) {
    return this.autoReplyRules.get(userId) || [];
  }
}

const state = new StateManager();

// Express app setup
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CONFIG.allowedOrigins,
    methods: ["GET", "POST"],
  },
});
function loadUserMapFromFile(userId) {
  const filePath = path.join(storagePath, `${userId}.json`);
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const obj = JSON.parse(fileContent); // تحويل JSON إلى كائن عادي
    return new Map(Object.entries(obj)); // تحويل الكائن إلى Map
  }
  return new Map(); // إذا لم يكن الملف موجودًا، إرجع Map فارغة
}

app.use(bodyParser.json());
app.use(cors({ origin: CONFIG.allowedOrigins }));

// WhatsApp client management
class WhatsAppManager {
  static async initializeClient(userId) {
    console.log(`Initializing client for user ${userId}`);

    // Clear any existing client
    if (state.getClient(userId)) {
      await this.cleanupExistingClient(userId);
    }

    try {
      const client = new Client({
        authStrategy: new LocalAuth({ clientId: userId }),
        puppeteer: CONFIG.puppeteerOptions,
      });

      // Add client to state before initialization
      state.addClient(userId, client);

      // Setup event handlers
      this.setupClientEvents(client, userId);

      // Initialize the client
      console.log(`Starting client initialization for user ${userId}`);
      await client.initialize();

      console.log(`Client initialization completed for user ${userId}`);
      return client;
    } catch (error) {
      console.error(`Failed to initialize client for user ${userId}:`, error);
      // Clean up on failure
      state.removeClient(userId);
      throw new Error(`Failed to initialize WhatsApp client: ${error.message}`);
    }
  }

  static setupClientEvents(client, userId) {
    client.on("qr", async (qr) => {
      console.log(`QR code generated for user ${userId}`);
      state.setQRCode(userId, qr);
      state.setConnectionState(userId, "AWAITING_SCAN");
    });

    client.on("ready", () => {
      console.log(`Client ready for user ${userId}`);
      state.setClientReady(userId);
      state.setConnectionState(userId, "CONNECTED");
    });

    client.on("message", async (message) => {
      console.log(`New message received for user ${userId}`);
      try {
        await MessageHandlingService.handleIncomingMessage(message, userId);
      } catch (error) {
        console.error("Error handling incoming message:", error);
      }
    });
    // console.log(`Message sent from user's devicedddddddddd ${userId}`);
    // client.on("message_create", async (message) => {
    //   // Handle messages sent by the user's own device
    //   // console.log(`Message sent from user's deviceeeeeeee ${userId}`);
    //   if (message.fromMe) {
    //     console.log(`Message sent from user's device ${userId}`);
    //     try {
    //       await MessageHandlingService.handleIncomingMessage(message, userId);
    //     } catch (error) {
    //       console.error("Error handling outgoing message:", error);
    //     }
    //   }
    // });

    client.on("authenticated", () => {
      console.log(`Client authenticated for user ${userId}`);
    });

    client.on("disconnected", async (reason) => {
      console.log(`Client disconnected for user ${userId}:`, reason);
      state.setClientReady(userId, false);
      state.setConnectionState(userId, "DISCONNECTED");
      await this.cleanupExistingClient(userId);
    });

    client.on("auth_failure", async (msg) => {
      console.error(`Auth failure for user ${userId}:`, msg);
      state.clearQRPromise(userId);
      await this.cleanupExistingClient(userId);
    });
  }

  static async cleanupExistingClient(userId) {
    console.log(`Cleaning up existing client for user ${userId}`);
    const existingClient = state.getClient(userId);
    if (existingClient) {
      try {
        await existingClient.destroy();
      } catch (error) {
        console.error(`Error destroying client for user ${userId}:`, error);
      }
      state.removeClient(userId);
    }
  }
}

class MessageHandlingService {
  static async handleIncomingMessage(message, userId) {
    try {
      // Extract relevant information from the message
      const messageData = {
        messageId: message.id._serialized,
        from: message.from.split("@")[0],
        to:
          message.to?.split("@")[0] || state.getClient(userId).info?.wid?.user,
        body: message.body,
        timestamp: message.timestamp,
        type: "received",
        hasMedia: message.hasMedia,
        mediaType: message.type, // image, video, document, etc.
        quotedMessage: message.hasQuotedMsg
          ? await message.getQuotedMessage()
          : null,
      };

      // If message has media, download and process it
      if (message.hasMedia) {
        try {
          const media = await message.downloadMedia();
          if (media) {
            messageData.mediaUrl = media.data;
            messageData.mimetype = media.mimetype;
            messageData.filename = media.filename;
          }
        } catch (error) {
          console.error("Error downloading media:", error);
        }
      }

      const apiData = {
        sender_number: message.from.split("@")[0],
        receive_number: state.getClient(userId).info?.wid?.user,
        body: message.body || "...",
        type_message: 'Text',
        file: "" || "",
    };
      try {
        const response = await axios.post("https://whats.wolfchat.online/public/api/receive", apiData);

        // Check if there's an auto-reply message
        if (response.data?.data?.autoReply === "on" ) {
            console.log("Auto-reply message:", response.data.data.details);

            // Reply to the original message
            await message.reply(response.data.data.details);
            
        }
    } catch (error) {
        console.error("Error sending message to API:", error);
    }

      // Store the message
      await MessageService.storeMessage(messageData);
      if (!message.fromMe) {
        io.emit("newMessage", {
          userId,
          message: messageData,
        });
      }

      return messageData;
    } catch (error) {
      console.error("Error handling incoming message:", error);
      throw error;
    }
  }

  static messageMatchesRule(message, rule) {
    // Convert message body and rule trigger to lowercase for case-insensitive matching
    const messageBody = message.body.toLowerCase();
    const trigger = rule.trigger.toLowerCase();

    switch (rule.matchType) {
      case "exact":
        return messageBody === trigger;

      case "contains":
        return messageBody.includes(trigger);

      case "startsWith":
        return messageBody.startsWith(trigger);

      case "endsWith":
        return messageBody.endsWith(trigger);

      case "regex":
        try {
          const regex = new RegExp(rule.trigger, "i");
          return regex.test(message.body);
        } catch (error) {
          console.error("Invalid regex in auto-reply rule:", error);
          return false;
        }

      default:
        return messageBody.includes(trigger);
    }
  }
}

class MediaHandlingService {
  static MIME_TYPE_MAP = {
    // Images
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",

    // Videos
    mp4: "video/mp4",
    avi: "video/x-msvideo",
    mkv: "video/x-matroska",
    mov: "video/quicktime",

    // Documents
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xls: "application/vnd.ms-excel",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    pdf: "application/pdf",
    txt: "text/plain",
  };

  static getProperMimeType(url, contentType) {
    const extension = url.split(".").pop().toLowerCase();
    return this.MIME_TYPE_MAP[extension] || contentType;
  }

  static async prepareMediaFromUrl(url) {
    try {
      console.log("Downloading media from URL:", url);

      const response = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 120000, // Increased timeout to 120 seconds for larger files
        maxContentLength: 100 * 1024 * 1024, // Increased to 100MB for video files
        headers: {
          Accept: "*/*",
        },
      });

      const mimeType = this.getProperMimeType(
        url,
        response.headers["content-type"]
      );

      // Check file size limits based on type
      const fileSize = response.data.length;
      if (!this.isFileSizeValid(mimeType, fileSize)) {
        throw new Error(
          `File size ${fileSize} exceeds maximum allowed size for type ${mimeType}`
        );
      }

      const base64Data = Buffer.from(response.data).toString("base64");
      console.log("Media prepared with MIME type:", mimeType);

      const filename = `media_${Date.now()}.${url.split(".").pop()}`;
      return {
        media: new MessageMedia(mimeType, base64Data, filename),
        mimeType,
        size: fileSize,
      };
    } catch (error) {
      console.error("Error preparing media from URL:", error);
      throw new Error(`Failed to prepare media: ${error.message}`);
    }
  }

  static isFileSizeValid(mimeType, size) {
    const MAX_SIZES = {
      image: 16 * 1024 * 1024, // 16MB for images
      video: 64 * 1024 * 1024, // 64MB for videos
      document: 100 * 1024 * 1024, // 100MB for documents
    };

    if (mimeType.startsWith("image/")) {
      return size <= MAX_SIZES.image;
    } else if (mimeType.startsWith("video/")) {
      return size <= MAX_SIZES.video;
    } else {
      return size <= MAX_SIZES.document;
    }
  }

  static async sendMediaMessage(client, contact, message, mediaUrl) {
    const formattedNumber = `${contact}@c.us`;

    try {
      // Validate media URL first
      if (!(await this.validateMedia(mediaUrl))) {
        throw new Error("Invalid or unsupported media URL");
      }

      const { media, mimeType, size } = await this.prepareMediaFromUrl(
        mediaUrl
      );
console.log(client);
      // Additional delay for larger files
      const delayTime = this.calculateDelay(size);
      await new Promise((resolve) => setTimeout(resolve, delayTime));

      const options = {
        caption: message || "",
        sendMediaAsDocument: this.shouldSendAsDocument(mimeType),
      };

      // Special handling for video files
      if (mimeType.startsWith("video/")) {
        try {
          // First attempt: Try sending as a document
          options.sendMediaAsDocument = true;
          return await client.sendMessage(formattedNumber, media, options);
        } catch (error) {
          console.log(
            "Failed to send video as document, trying alternative method..."
          );

          // Second attempt: Try sending with different options
          options.sendMediaAsDocument = false;
          options.sendVideoAsGif = false;
          return await client.sendMessage(formattedNumber, media, options);
        }
      }

      // For non-video files
      return await client.sendMessage(formattedNumber, media, options);
    } catch (error) {
      console.error(`Failed to send media message to ${contact}:`, error);
      throw new Error(`Media sending failed: ${error.message}`);
    }
  }

  static calculateDelay(fileSize) {
    // Base delay of 2 seconds
    const baseDelay = 2000;

    // Additional delay based on file size (1 second per 5MB)
    const sizeBasedDelay = Math.floor(fileSize / (5 * 1024 * 1024)) * 1000;

    return baseDelay + sizeBasedDelay;
  }

  static shouldSendAsDocument(mimeType) {
    return !(
      mimeType.startsWith("image/") ||
      mimeType.startsWith("video/") ||
      mimeType.startsWith("audio/")
    );
  }

  static async validateMedia(url) {
    try {
      const response = await axios.head(url);
      const contentLength = parseInt(response.headers["content-length"]);
      const mimeType = this.getProperMimeType(
        url,
        response.headers["content-type"]
      );

      // Validate file size based on type
      if (!this.isFileSizeValid(mimeType, contentLength)) {
        return false;
      }

      // Validate mime type
      if (!this.isValidMimeType(mimeType)) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Media validation failed:", error);
      return false;
    }
  }

  static isValidMimeType(mimeType) {
    return Object.values(this.MIME_TYPE_MAP).includes(mimeType);
  }
}
// Message handling service
class MessageService {
  static async storeMessage(message) {
    console.log("Storing message:", message);
  }

  static formatPhoneNumber(number) {
    const cleanNumber = number.replace(/\D/g, "");
    return cleanNumber.startsWith("0")
      ? "966" + cleanNumber.slice(1)
      : cleanNumber;
  }
  static async sendMessage(client, contact, message, mediaUrl = null) {
    if (!client) {
      throw new Error("WhatsApp client is not available");
    }

    console.log("Sending message with client:", !!client); // Debug log
    const formattedNumber = `${contact.number}@c.us`;

    try {
      let response;

      if (mediaUrl) {
        // Validate media before attempting to send
        if (!(await MediaHandlingService.validateMedia(mediaUrl))) {
          throw new Error("Invalid or oversized media");
        }

        response = await MediaHandlingService.sendMediaMessage(
          client,
          contact.number,
          message,
          mediaUrl
        );
      } else {
        response = await client.sendMessage(formattedNumber, message);
      }

      const sentMessage = {
        conversation_id: response.id._serialized,
        from: client.info?.wid?.user,
        to: contact.number,
        body: message,
        time: new Date(),
        type: "sent",
        mediaUrl: mediaUrl,
      };

      return sentMessage;
    } catch (error) {
      console.error(`Failed to send message to ${contact.number}:`, error);
      throw error;
    }
  }
}
// Campaign management service
class CampaignService {
  static getRandomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min) * 1000;
  }

  static async scheduleCampaign(campaign, client) {
    const { name, messages, contacts, min_delay, max_delay, userId } = campaign;

   

    if (!client) {
      throw new Error(`No client found for user ${userId}`);
    }

    const getMediaUrl = (filePath) => {
      if (!filePath) return null;
      // Adjust this to your actual media URL structure
      return `${filePath}`;
    };

    const sendMessagesToContact = async (contact, messageIndex = 0) => {
      if (messageIndex >= messages.length) {
        return true;
      }

      const message = messages[messageIndex];

      try {
        // Add a longer delay before sending media messages
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Get media URL if message has media
        const mediaUrl = message.filePath
          ? getMediaUrl(message.filePath)
          : null;

        // Send message with retry mechanism
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
          try {
            await MessageService.sendMessage(
              client,
              contact,
              message.content,
              mediaUrl
            );
            console.log(
              `Successfully sent message ${messageIndex + 1} to ${
                contact.number
              }`
            );
            break;
          } catch (error) {
            retryCount++;
            if (retryCount === maxRetries) {
              throw error;
            }
            console.log(
              `Retry ${retryCount} for message ${messageIndex + 1} to ${
                contact.number
              }`
            );
            await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 second delay between retries
          }
        }

        // Random delay before next message
        const nextInterval = this.getRandomInterval(min_delay, max_delay);
        await new Promise((resolve) => setTimeout(resolve, nextInterval));

        return sendMessagesToContact(contact, messageIndex + 1);
      } catch (error) {
        console.error(`Failed to send message to ${contact.number}:`, error);
        return false;
      }
    };

    const sendToAllContacts = async (contacts, currentIndex = 0) => {
      if (currentIndex >= contacts.length) {
        console.log(`Campaign "${name}" completed successfully`);
        return;
      }

      try {
        await sendMessagesToContact(contacts[currentIndex]);

        // Add a longer delay between contacts
        const nextInterval = this.getRandomInterval(
          Math.max(min_delay, 10), // Minimum 10 seconds between contacts
          Math.max(max_delay, 30) // Minimum 30 seconds maximum
        );

        setTimeout(
          () => sendToAllContacts(contacts, currentIndex + 1),
          nextInterval
        );
      } catch (error) {
        console.error(
          `Failed to process contact ${contacts[currentIndex].number}:`,
          error
        );
        // Move to next contact after error
        setTimeout(() => sendToAllContacts(contacts, currentIndex + 1), 5000);
      }
    };

    console.log(
      `Starting campaign "${name}" with ${contacts.length} contacts and ${messages.length} messages per contact`
    );
    sendToAllContacts(contacts);
  }
}

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on("requestQR", async (userId) => {
    if (!state.getClient(userId)) {
      await WhatsAppManager.initializeClient(userId, socket);
    } else if (state.getQRCode(userId)) {
      socket.emit("qrCode", state.getQRCode(userId));
    } else {
      socket.emit("qrCodeError", { message: "QR code not available." });
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

app.get("/get-qr/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    // Initialize client if it doesn't exist
    if (!state.getClient(userId)) {
      await WhatsAppManager.initializeClient(userId);
    }

    // Check if QR code already exists
    let qrCode = state.getQRCode(userId);

    // If no QR code exists, wait for it to be generated
    if (!qrCode) {
      try {
        qrCode = await state.waitForQRCode(userId);
      } catch (error) {
        return res.status(408).json({
          success: false,
          error: "QR code generation timeout",
        });
      }
    }

    // Generate QR code imaged
    const qrImage = await QRCode.toDataURL(qrCode);

    // Return QR code as JSON with data URL
    res.json({
      success: true,
      qrCode: qrImage,
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// API Routes




app.get("/messages/:userId", async (req, res) => {
  const { userId } = req.params;
  const { limit = 50, before, after } = req.query;

  try {
    // Implement message retrieval logic based on your storage solution
    const messages = state.messages
      .filter((msg) => msg.userId === userId)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Endpoint to set auto-reply rules
app.post("/auto-reply/:userId", (req, res) => {
  const { userId } = req.params;
  const { rules } = req.body;

  try {
    state.setAutoReplyRules(userId, rules);
    res.json({
      success: true,
      message: "Auto-reply rules updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.post("/reconnect", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId is required",
    });
  }

  try {
    await WhatsAppManager.reconnectClient(userId);
    res.json({
      success: true,
      message: "Reconnection initiated successfully",
    });
  } catch (error) {
    console.error("Reconnection error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});




// const storagePath = path.join(__dirname, "userMaps");
// مسار ملف التخزين
// const dataFilePath = path.join(__dirname, 'clients.json');

// // وظيفة لحفظ البيانات
// function saveClient(userId, clientData) {
//     let data = {};
//     if (fs.existsSync(dataFilePath)) {
//         // قراءة البيانات الحالية
//         const fileData = fs.readFileSync(dataFilePath, 'utf-8');
//         data = JSON.parse(fileData);
//     }

//     // حفظ البيانات الجديدة
//     data[userId] = clientData;
//     fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
// }
// مسار الملف
// const filePath = path.join(__dirname, 'clients.json');

// // دالة لتحميل البيانات من ملف JSON
// function loadClients() {
//     if (fs.existsSync(filePath)) {
//         const data = fs.readFileSync(filePath, 'utf-8');
//         return JSON.parse(data);
//     }
//     return {}; // إذا لم يكن الملف موجودًا، إرجاع كائن فارغ
// }

// function getClientt(userId) {
//   const clients = loadClients();
//   return clients[userId] || null; // إذا لم يكن المستخدم موجودًا
// }

// function updateClient(userId, newData) {
//   const clients = loadClients();
//   clients[userId] = newData;

//   // كتابة البيانات المحدثة إلى ملف JSON
//   fs.writeFileSync(filePath, JSON.stringify(clients, null, 2), 'utf-8');
// }

const clientsCache = {};

app.get("/connection-status/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const client = state.getClient(userId);
// console.log(client)
console.log(userId)
    if (!client) {
      return res.status(404).json({
        status: "disconnected",
        message: "Client not found",
      });
    }

    // Check if client is ready
    if (!state.isClientReady(userId)) {
      return res.json({
        status: "initializing",
        message: "Client is initializing",
      });
    }

    // Only try to get state if client is ready
    try {
      const clientState = await client.getState();
      // const userMap = new Map();
      // userMap.set(userId, { userId: client });
      // console.log(getClient('12345')); // عرض بيانات المستخدم
      // updateClient('12345', { name: 'John Updated', age: 31 }); // تحديث البيانات
      if (clientsCache[userId]) {
        // إذا كان الـ userId موجود بالفعل، امسح القيمة القديمة
        delete clientsCache[userId];
      }
      
    // خزّن العميل الجديد
    clientsCache[userId] = client;

      console.log(clientsCache);
// saveClient(userId, client);
// saveUserMapToFile(userId, userMap);
console.log(`Data for user ${userId} saved successfully.`);
      return res.json({
        status: clientState ? clientState.toLowerCase() : "connecting",
      });
    } catch (error) {
      console.error("Error getting client state:", error);
      return res.json({
        status: "connecting",
        message: "Client is connecting",
      });
    }
  } catch (error) {
    console.error("Error checking connection status:", error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

app.post("/send-message", async (req, res) => {

  // const userId = req.params.userId;
  const { number, message, userId, mediaFilePath } = req.body;

  console.log(`Received send message request for user ${userId}`);

  try {
    // let client = state.getClient(userId);
    let client = clientsCache[userId];
    // let client = getClient(userId);;
    console.log(client)
    // If no client exists or client is not ready, try to initialize
    // if (!client || !state.isClientReady(userId))
    if (!client ) {
      console.log(
        `No active client found for user ${userId}, initializing new client`
      );
      try {
        client = await WhatsAppManager.initializeClient(userId);
        // Wait for client to be ready
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error("Client initialization timeout"));
          }, 30000);

          const checkReady = setInterval(() => {
            if (state.isClientReady(userId)) {
              clearInterval(checkReady);
              clearTimeout(timeout);
              resolve();
            }
          }, 1000);
        });
      } catch (error) {
        console.error(`Failed to initialize client for user ${userId}:`, error);
        return res.status(500).json({
          success: false,
          message: "Failed to initialize WhatsApp client",
        });
      }
    }

    // Double check client is available and ready
    // if (!client || !state.isClientReady(userId)) {
    //   return res.status(503).json({
    //     success: false,
    //     message: "WhatsApp client not ready",
    //   });
    // }

    const response = await MessageService.sendMessage(
      client,
      { number },
      message,
      mediaFilePath
    );

    return res.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error(`Error in send-message endpoint for user ${userId}:`, error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send message",
    });
  }
});


app.post("/create-campaign", async (req, res) => {
  try {
    const campaign = req.body;
    console.log(campaign.userId);
    let client = clientsCache[campaign.userId];
    await CampaignService.scheduleCampaign(campaign, client);
    res.json({ success: true, campaignId: `campaign-${Date.now()}` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add this route to your Express app
app.get("/get-number/:userId", async (req, res) => {
  const userId = req.params.userId;

  // Check if the client exists for the provided userId
  const client = state.getClient(userId);

  if (!client) {
    return res
      .status(404)
      .json({ success: false, message: "Client not found" });
  }

  try {
    // Get the user's WhatsApp number (or any other information)
    const userNumber = client.info?.wid?.user; // Assuming this retrieves the user's number
    res.json({ success: true, userNumber });
  } catch (error) {
    console.error("Error retrieving user number:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
server.listen(CONFIG.port, () => {
  console.log(`Server running at http://localhost:${CONFIG.port}`);
});
