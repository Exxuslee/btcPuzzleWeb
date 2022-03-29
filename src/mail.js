const nodemailer = require('nodemailer');
let env = require("./env.json");

const transporter = nodemailer.createTransport({
    service: 'gmail',//smtp.gmail.com  //in place of service use host...
    secure: false,//true
    port: 25,//465
    auth: {
        user: env.user,
        pass: env.pass
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports.sendMail = function (bitKey) {
    async function mail() {
        const message = {
            from: 'litovka.daemon@gmail.com',               // Sender address
            to: ["exxuslee@gmail.com", 'urlih@list.ru'],    // List of recipients
            subject: 'Puzzle find successfully!',           // Subject line
            text: JSON.stringify(bitKey)

        };
        await transporter.sendMail(message, function (err, info) {
        });
    }

    mail().then(r => console.log(r));
};