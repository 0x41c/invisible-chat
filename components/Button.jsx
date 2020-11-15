// Everything in this file other then the first path and the tooltip message is attributed to the plugin "Send Button" https://github.com/Sidemen19/send-button
const {
    React,
    getModuleByDisplayName,
    getModule,
} = require("powercord/webpack");

const Tooltip = getModuleByDisplayName("Tooltip", false);
const { Button, Icon } = require("powercord/components");
const buttonClasses = getModule(["button"], false);
const buttonWrapperClasses = getModule(["buttonWrapper", "pulseButton"], false);
const buttonTextAreaClasses = getModule(["button", "textArea"], false);

module.exports = () => (
    <Tooltip color="black" postion="top" text="Send a secret message">
        {({ onMouseLeave, onMouseEnter }) => (
            <Button
                look={Button.Looks.BLANK}
                size={Button.Sizes.ICON}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <Icon
                    name="LockClosed"
                    className={`${buttonClasses.contents} ${buttonWrapperClasses.button} ${buttonTextAreaClasses.button}`}
                />
            </Button>
        )}
    </Tooltip>
)
