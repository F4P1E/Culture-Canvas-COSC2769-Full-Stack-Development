const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");

const requireAuth = require("./middleware/requireAuth");

const userRoute = require("./routes/user");
const postRoute = require("./routes/post");

const dotenv = require("dotenv");
dotenv.config();

const { connectionTesting } = require("./controllers/testController"); // test route

const app = express();

// middleware
app.use((req, res, next) => {
	console.log(req.path, req.method);
	next();
});
app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

const sessionConfig = {
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: false, // set to true in production
		maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
	},
};

// Middleware to set Access-Control-Allow-Credentials header
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Credentials", "true");
	next();
});

app.use(session(sessionConfig));

app.get("/test", connectionTesting); // Test route

app.use((request, response, next) => {
	if (request.path === "/login" || request.path === "/signup") {
		return next();
	}

	requireAuth(request, response, next);
});

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		app.listen(process.env.PORT, () => {
			console.log(`Connected to DB and listening on port ${process.env.PORT}`);
		});
	})
	.catch((error) => {
		console.error("Error connecting to MongoDB:", error);
	});

// Routes
app.use("/", userRoute);
app.use("/post", postRoute);
