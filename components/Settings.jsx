// One of my first react components
const { React } = require('powercord/webpack')
const {
     SwitchItem,
     Category,
     Checkbox
} = require('powercord/components/settings')
const { FormTitle, Card } = require('powercord/components')


module.exports = class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ctOpened: false

        }
    }

    render()  {
        const { getSetting, toggleSetting } = this.props
        return (
            <div>
            <Category name="Composer Type" description="Choose how you would like to compose your messages" opened={this.state.ctOpened} onChange={() => {this.setState({ ctOpened: !this.state.ctOpened })}}> 
                {/* Two cards running the same handler... idfk*/}
                <Card type="cardPrimary" style={() => {

                }}>
                </Card>
            </Category>
            <FormTitle>Command Settings</FormTitle>
            <SwitchItem note='Whether the "invichat" command should automatically send the encrypted message' value={ getSetting('send', false) } onChange={() => toggleSetting('send')}>
                Auto Send [{getSetting('send', false) ? "On" : "Off"}]
            </SwitchItem>
            </div>
        )
    }

    cardHandler(cardName) {
        
    }
}