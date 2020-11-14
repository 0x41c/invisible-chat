// One of my first react components
const { React } = require('powercord/webpack')
const { SwitchItem } = require('powercord/components/settings')
const { FormTitle } = require('powercord/components')


module.exports = class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render()  {
        const { getSetting, toggleSetting } = this.props
        return (
            <div>
            <FormTitle>Command Settings</FormTitle>
            <SwitchItem note='Whether the "invichat" command should automatically send the encrypted message' value={ getSetting('send', false) } onChange={() => toggleSetting('send')}>
                Auto Send
            </SwitchItem>
            </div>
        )
    }
}