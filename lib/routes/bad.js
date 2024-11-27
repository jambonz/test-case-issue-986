
const config = {"actionHookDelayAction": {
  "enabled": true,
  "noResponseTimeout": 1,
  "retries": 5,
  "noResponseGiveUpTimeout": 15,
  "actions": [
      {
          "verb": "play",
          "url": "https://s3.sammachin.com/null.mp3" // THIS IS INVALID URL
      }
  ]
}}

function delay(t, val) {
  return new Promise(function(resolve) {
      setTimeout(function() {
          resolve(val);
      }, t);
  });
}


const service = ({logger, makeService}) => {
const svc = makeService({path: '/bad'});

svc.on('session:new', (session) => {
  session.locals = {logger: logger.child({call_sid: session.call_sid})};
  logger.info({session}, `new incoming call: ${session.call_sid}`);

  try {
      session
      .on('close', onClose.bind(null, session))
      .on('error', onError.bind(null, session))
      .on('/input', onInputEvent.bind(null, session));

      session
              .pause({length: 1.5})
              .config(config)
              .say({text: "Hello"})
              .gather({
                say: {text: 'Please press a key.'},
                input: ['digits'],
                numDigits: 1,
                actionHook: '/input',
                timeout: 7
              })
              .send();
    } 
    catch (err) {
    
    session.locals.logger.info({err}, `Error to responding to incoming call: ${session.call_sid}`);
    
    session.close();
  }
});
};


const onInputEvent= async(session, evt) => {

  const {logger} = session.locals;
  logger.info(`got speech evt: ${JSON.stringify(evt)}`);
  switch (evt.reason) {
    case 'dtmfDetected':
      setTimeout(() => {
        sayDigit(session, evt);
      }, 3000);
    break;
    case 'timeout':
      reprompt(session);
    break;
    default:
      session.reply();
    break;
  }
};

const sayDigit = async(session, evt) => {
session
.say({text: `You pressed: ${evt.digits}.`})
.pause({length: 1.5})
.hangup()
.reply();
};

const reprompt = async(session, evt) => {
session
.gather({
say: {text: 'I didnt receive anything, please press a key`'},
input: ['dtmf'],
actionHook: '/input'
})
.reply();
};




const onClose = (session, code, reason) => {
const {logger} = session.locals;
logger.info({session, code, reason}, `session ${session.call_sid} closed`);
};

const onError = (session, err) => {
const {logger} = session.locals;
logger.info({err}, `session ${session.call_sid} received error`);
};

module.exports = service;
