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
            usage: '{c} < -m [hidden message] -c [camo message] -u [userID or custom key] || -s [encryted message] -p password >',
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
        if (!this.settings.get('GlobalSettings')) {
            this.settings.set('GlobalSettings', {
                composerType: "Modal",
                unsubmitted: false,
                randomPassword: true,
                guildID: "",
                state: 
                {
                    cover: "",
                    secret: "",
                    passwordObj: (() => {
                        if (this.settings.get('passwordList') && this.settings.get('passwordList').length > 0 && this.settings.get('GlobalSettings').randomPassword) {
                            const items = this.settings.get('passwordList')
                            return {
                                password: items[Math.floor(Math.random() * items.length)],
                                temporary: true
                            }
                        } else {
                            return {
                                password: ""
                            }
                        }
                    })(),
                    channelPlaceholder: ""
                }
            })
            this.log(this.settings.get('GlobalSettings'))
        }
    }

    async inject() {
        const ChannelTextAreaContainer = getModule(
            m =>
                m.type &&
                m.type.render &&
                m.type.render.displayName === "ChannelTextAreaContainer",
            false
        );
        this.log(ChannelTextAreaContainer)
        const ChannelEditorContainer = await getModule(
            m =>
            m.default &&
            m.default.displayName == "ChannelEditorContainer"
        )
        inject("invichat-button", ChannelTextAreaContainer.type, "render", (args, res) => {
            const id = args[0].channel.id
            this.log("Invichat Button:", args, res)
            if((!this.can(SEND_MESSAGES, this.getCurrentUser(), args[0].channel) && !args[0].placeholder.split(' ')[1].indexOf("@") === 0) || args[0].type == "edit") return res
            // settings stuff
            if (!this.settings.get(id)) {
                this.settings.set(id, Object.assign(this.settings.get('GlobalSettings'), {
                    channelID: id,
                    channelPlaceholder: args[0].placeholder
                }))
            }
            const props = findInReactTree(res, r => r && r.className && r.className.indexOf("buttons-") === 0)
            const el = React.createElement("div", {
                className: ".send-invisible-message",
                onClick: () => {
                    const channelSettings = this.settings.get(id)
                    console.log(channelSettings)
                    if (channelSettings.composerType == "Modal") {
                        open(ModalComposer)
                    } else if (channelSettings.composerType = "Inline") { //  A lot of code is gonna end up here
                        console.log('reeeeeeee')
                    }
                }
            }, React.createElement(Button))
            props.children.unshift(el)
            return res
        })
        this.log(ChannelEditorContainer)

        // Channel
        inject("invichat-channel-placholder", ChannelEditorContainer.default.prototype, "render", (args, res) => {
            const originalPlaceHolder = res.props.placeholder
            //const dms = originalPlaceHolder.split(' ')[1].indexOf("@") === 0 ? true : false
            this.log("Invichat Channel Placeholder:", args, res, originalPlaceHolder)
            res.props.placeholder = (() => {
                const settings = (() => {
                    return Object.values(this.settings.getKeys()).map((i) => {
                        this.log(i)
                        const val = powercord.settings.get(i)
                        this.log(val)
                        if (res.props.channelId == val.channelID) {
                            return val
                        }
                    })[0]
                })()
                this.log(settings)
                if (!settings) return originalPlaceHolder
                if (settings.states.secret != "" && settings.states.cover != "" && settings.states.passwordObj.password == "") {
                    return "Enter Encryption Password"
                } else if (settings.states.secret != "" && settings.states.cover == "") {
                    return "Enter Cover Message"
                } else if (settings.states.secret != "") {
                    return "Enter Secret Message"
                } else {
                    return originalPlaceHolder
                }
            })()
            return res
        })

        

        ChannelTextAreaContainer.type.render.displayName = "ChannelTextAreaContainer"
        ChannelEditorContainer.default.displayName = "ChannelEditorContainer"
    }
    async startPlugin() {
        await this.prepareClass()
        this.register()
        await this.inject()
    };

    async pluginWillUnload() {
        uninject('invichat-button')
        uninject('invichat-channel-placeholder')
        powercord.api.commands.unregisterCommand('invichat');
        powercord.api.settings.unregisterSettings('invichat')
    }

}

