const arg = require('arg')
const Steggo = require('stegcloak')
const { xtraParse } = require('../utilities/xtraHelp')
const InviChat = {
    handler: (args, props) => {
        // arg formatting
        const steggo = new Steggo(true, false)
        props.log(`Raw Arguments:\n${args.join(' ')}`);
        args = xtraParse(args);
        props.log(`Received args: ${JSON.stringify(args, null, 2)}`);

        var encryptedMessage;
        try {
            const argHandler = arg({
                "--message": String,
                "--cover": String,
                "--password": String,
                "-m": "--message",
                "-c": "--cover",
                "-p": "--password",
            }, {
                argv: args
            });
            props.log(`Received ArgHandler: ${JSON.stringify(argHandler, null, 2)}`);
            if (!argHandler["--message"]) {
                props.replyError(`**Missing required command "\`--message || -m\`"**\n\nIf you need command help run \`.${this.commandName} --help [-h]\``);
                return;
            } else
            if (!argHandler["--cover"]) {
                props.replyError(`**Missing required command "\`--cover || -c\`"**\n\nIf you need command help run \`.${this.commandName} --help [-h]\``);
                return;
            } else
            if (!argHandler["--password"]) {
                props.replyError(`**Missing required command "\`--password || -p\`"**\n\nIf you need command help run \`.${this.commandName} --help [-h]\``);
                return;
            }
            encryptedMessage = steggo.hide(argHandler["--message"], argHandler["--password"], argHandler["--cover"]);
            return encryptedMessage;
        } catch (e) {
            props.settings.set('send', false)
            if (e.code == "ARG_UNKNOWN_OPTION") {
                props.replyError(e.message);
            } else {
                props.replyError(`${e.message} in password argument`);
            }
        }
    }
}

module.exports = InviChat