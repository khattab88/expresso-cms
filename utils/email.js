const pug = require('pug');
const htmlToText = require('html-to-text');
const config = require("../config");
const { EmailService } = require("expresso-services");

module.exports = class Email {
    constructor(user, url) {
        this.from = `Expresso App <${config.email.address}>`;
        this.to = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.url = url;

        this.emailSvc = new EmailService(config.email.host, config.email.address, config.email.password);
    }

    /* PRIVATE METHOD */
    async _send(template, subject) {
        // 1) render htm based on pug templates
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstName: this.firstName,
            lastName: this.lastName,
            url: this.url,
            subject
        });

        // 2) define mail options
        const options = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.htmlToText(html)
        };

        // 3) send email
        await this.emailSvc.sendEmail(options);
    }

    async sendWelcome() {
        await this._send('welcome', 'Welcome to Expresso App!');
    }

    async sendPasswordReset() {
        await this._send(
            'passwordReset',
            'Your password reset token (valid for only 10 minutes)'
        );
    }
}