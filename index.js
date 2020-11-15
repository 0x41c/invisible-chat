const { Plugin } = require('powercord/entities')
const { getModule, React, constants: { Permissions: { SEND_MESSAGES } } } = require('powercord/webpack')
const { inject, uninject } = require('powercord/injector');
const Settings = require('./components/Settings')
const { handler } = require('./commands/invichat')
const Button = require('./components/Button')
const ModalComposer = require('./components/ModalComposer')
const { open } = require('powercord/modal')
const { findInReactTree } = require("powercord/util");
/*
 * Any boxed out parts of the program are final unless needed to be changed on occurence of a bug
 */
module.exports = class InviChat extends Plugin {

/*********** Colors ***********/
////////////////////////////////
    get hexiColor() {         //    
        return '0x45f5f5'     //
    }                         //
    get color() {             //
        return '#45f5f5'      //
    }                         //
    get errorColor() {        //
        return '0xf54242'     //
    }                         //
    get debugColor() {        //
        return '0xf56942'     //
    }                         //
    get successColor() {      //
        return this.color()   //
    }                         //
////////////////////////////////

/****************** Static Embed *******************/
/////////////////////////////////////////////////////
    get inviEmbed() {                              //
        return {                                   //
            color: `${this.hexiColor}`,            //
            type: 'rich',                          //
            footer: {                              //
                text: "Made with ❤️ by c0dine"      //
            },                                     //
            author: {                              //
                name: "InviChat",                  //
                url: "",                           //
                icon_url: ""                       //
            }                                      //
        }                                          //
    }                                              //
/////////////////////////////////////////////////////

/***************************************** Smart Webpack Module Imports ************************************/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async import(filter, functionName = filter) {                                                          //
        if (typeof filter === 'string') {                                                                  //
            filter = [ filter ];                                                                           //
        }                                                                                                  //
        this[functionName] = (await getModule(filter))[functionName];                                      //
    }                                                                                                      //
    async prepareClass() {                                                                                 //
        await this.import('createBotMessage');                                                             //
        await this.import([ 'getLastSelectedChannelId' ], 'getChannelId');                                 //
        await this.import('receiveMessage');                                                               //
        await this.import('getChannel');                                                                   //
        await this.import('getCurrentUser');                                                               //
        await this.import(['can', 'canEveryone'], 'can');                                                  //
    }                                                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////


    sendBotMessage(content) {
        const received = this.createBotMessage(this.getChannelId(), '');
        received.embeds.push(content);
        this.log(`Sending Message: ${JSON.stringify(content, null, 2)}`);
        return this.receiveMessage(received.channel_id, received);
    }

    reply(content) {
        //TODO: Add some customization settings
        this.sendBotMessage(Object.assign({
            description: content
        }, this.inviEmbed));
    }

    replyError(content) {
        this.error(content)
        this.sendBotMessage(Object.assign(this.inviEmbed, {
            color: this.errorColor,
            description: content
        }));
    }

    register() {
        // Register main command
        powercord.api.commands.registerCommand({
            command: 'invichat',
            description: 'Send an invisible message',
            usage: '{c} [--send] -m [hidden message] -c [camo message] -u [userID or custom key] || -d [encryted message] -p password>',
            executor: (args) => ({
                send: this.settings.get('send', false),
                result: handler(args, this)
            })
        });
        // Settings
        powercord.api.settings.registerSettings("invichat", {
            label: 'Invisible Chat',
            category: this.entityID,
            render: Settings
        })
    }

    inject() {
        this.log(React.createElement(ModalComposer))
        const ChannelTextAreaContainer = getModule(
            m =>
                m.type &&
                m.type.render &&
                m.type.render.displayName === "ChannelTextAreaContainer",
            false
        );

        inject("invichat-button", ChannelTextAreaContainer.type, "render", (args, res) => {
            if(!this.can(SEND_MESSAGES, this.getCurrentUser(), this.getChannel(this.getChannelId()))) return res
            const props = findInReactTree(res, r => r && r.className && r.className.indexOf("buttons-") === 0)
            const el = React.createElement("div", {
                className: ".send-invisible-message",
                onClick: () => open(ModalComposer)
            }, React.createElement(Button))
            props.children.unshift(el)
            return res
        })
        ChannelTextAreaContainer.type.render.displayName = "ChannelTextAreaContainer"
    }
    async startPlugin() {
        await this.prepareClass()
        this.register()
        this.inject()
    };

    async pluginWillUnload() {
        uninject('invichat-button')
        powercord.api.commands.unregisterCommand('invichat');
    }

}

