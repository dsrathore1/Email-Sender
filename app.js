const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

// env Variables
dotenv.config({ path: "config.env" });

// PORT setting
const PORT = process.env.PORT || 4040;
// Creating app
const app = express();

// Adding cors
app.use(cors());

// For accepting post from data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Middleware
app.set("view engine", "ejs");
app.use(express.static("Public"));


// nodemailer config
// single approach
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD,
    }
});

// oauth approach
const transporter_pro = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.AUTH_EMAIL,
        clientId: process.env.AUTH_CLIENT_ID,
        clientSecret: process.env.AUTH_CLIENT_SECRET,
        refreshToken: process.env.AUTH_REFRESH_TOKEN
    }
});

// Testing nodemailer success
transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Verified! Ready for mail");
        console.log(success);
    }
});


app.post("/sendmail", (req, res) => {
    const { to, subject, body } = req.body;

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: to,
        subject: subject,
        text: body,
    }

    transporter.sendMail(mailOptions)
        .then(() => {
            // Successfull message!
            res.render("successfullPage");
        })
        .catch((err) => {
            // An error occurred
            console.log(err);
            res.render("error404");
        });
});

app.get("/", (req, res) => {
    res.render("index");
});


app.listen(PORT, () => {
    console.log(`Your server is live on http://localhost:${PORT}`);
});