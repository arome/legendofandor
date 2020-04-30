import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { CometChat } from '@cometchat-pro/chat'
import { appId } from './common'
const background = require('./assets/images/Andor_HP_Art_06_01.jpg')

const divStyle = {
  width: '100vw',
  height: '100vh',
  backgroundImage: `url(${background})`,
  backgroundSize: '100% 100%',
}

CometChat.init(appId, new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion('us').build())
ReactDOM.render(
  <div style={divStyle}>
    <App />
  </div>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
