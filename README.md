# my-app

This application was created with the [create-jambonz-ws-app](https://www.npmjs.com/package/create-jambonz-ws-app) command.  This documentation was generated at the time when the project was generated and describes the functionality that was initially scaffolded.  Of course, you should feel free to modify or replace this documentation as you build out your own logic.

## Services


### /good
Shows the happy path where a 'procecsing' soundfile is played while waiting for the response to input

### /bad
Shows the bug where a the call hangs with no audio as the url listed in actionHookDelayAction play is invalid.
Even once the response to input is sent back there is nothing on the call

