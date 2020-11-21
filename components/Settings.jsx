// One of my first react components
const { React, getModuleByDisplayName } = require('powercord/webpack')
const {
     SwitchItem,
     Category,
     RadioGroup,
     FormItem
} = require('powercord/components/settings')
const { FormTitle } = require('powercord/components')
const AsyncComponent = require('powercord/components/AsyncComponent')
//const RadioItem = AsyncComponent.from(getModuleByDisplayName("RadioItem"))

module.exports = class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.settings = this.props.getSetting('GlobalSettings')
        this.state = {
            ctOpened: false,
            composerTypes: ['Modal', 'Inline']
        }
    }

    render()  {
        const { getSetting, toggleSetting } = this.props
        return (
            <div>
            {/*<Category name="Composer Type" description="Choose how you would like to compose your messages" opened={this.state.ctOpened} onChange={() => {this.setState({ ctOpened: !this.state.ctOpened })}}>*/}
            <FormTitle>Composer Type</FormTitle>
                <RadioGroup options={[
                    {
                        name: "Modal: Compose using a popup GUI interface",
                        value: "Modal",
                    }, {
                        name: "Inline: Advanced and interactive way of encrypting messages",
                        value: "Inline",
                        disabled: true
                    }
                ]} value={this.settings.composerType}/>
            {/*</Category>*/}
            <FormTitle>Command Settings</FormTitle>
            <SwitchItem note='Whether the "invichat" command should automatically send the encrypted message' value={ getSetting('send', false) } onChange={() => toggleSetting('send')}>
                Auto Send [{getSetting('send', false) ? "On" : "Off"}]
            </SwitchItem>
            </div>
        )
    }
}