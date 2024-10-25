// backend/index.js
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { User } = require("./models/models");
const { sessionClient, sessionPath } = require("./dialogflowConfig");

// Express app setup
const app = express();
const port = process.env.PORT || 5001; // Fallback to 5001 if process.env.PORT is not defined

// Middlewares
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(bodyParser.json()); // for parsing JSON requests

// Session middleware configuration
app.use(
  session({
    secret: "ABCD1234DEFG",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: !true }, // Set to true if using https
  })
);

// Database connection
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce"; // Fallback to local DB if environment variable not set

async function createSuperuser() {
  try {
    const existingUser = await User.findOne({ email: "shahjee6446@gmail.com" });

    if (!existingUser) {
      // Create the superuser
      const superuser = new User({
        first_name: "Shah",
        last_name: "Jee",
        email: "shahjee6446@gmail.com",
        password: "shahjee123",
        street_address: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        is_superuser: true,
      });
      await superuser.save();
      console.log("Superuser created successfully.");
    } else {
      console.log("Superuser already exists.");
    }
  } catch (error) {
    console.error("Error creating superuser:", error);
  }
}

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB database connection established successfully");
    createSuperuser(); // Call createSuperuser after successful connection
  })
  .catch((err) => console.error("Could not connect to MongoDB database:", err));

// Chatbot route
app.post("/api/chatbot", async (req, res) => {
  const { message } = req.body;

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: "en-US",
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    res.send({ reply: result.fulfillmentText });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Error processing request");
  }
});

// Import and use routes
const routes = require("./routes"); // Adjust the path as necessary
app.use("/", routes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
