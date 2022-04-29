import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import RelativeTime from '@yaireo/relative-time'
import { ethers } from 'ethers'
import parse from 'html-react-parser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faComment,
  faFingerprint,
  faPlus,
  faShieldAlt,
  faTimes,
  faTrash,
  faUserCircle,
  faWindowMaximize,
  faWindowRestore
} from '@fortawesome/free-solid-svg-icons'
import Wallet from './components/Wallet'
import {
  Button,
  ChatboxBase,
  ChatboxClose,
  ChatboxOpen,
  ChatboxPanel,
  ChatboxPopup,
  ChatboxPopupHeader,
  ChatBoxPopupHistory,
  ChatboxPopupMain,
  ChatboxTitle,
  ClearFix,
  Message,
  MessageData,
  MessageSelf,
  MessageSelfData,
  MsgList,
  PanelFooter,
  PanelHeader,
  PanelHistory,
  PanelMain,
  PopupFooter
} from './style'
import ABI from './abi/Keyring.json'

// Global constants

// Enum
const NO_NFT = 0
const EXPIRED = 1
const ERR = 2

// Rinkeby
const CONTRACT = '0x8721049D85Bd7C089956B609E3c3bF37284ef02e'

library.add(
  faComment,
  faTimes,
  faUserCircle,
  faWindowMaximize,
  faWindowRestore,
  faPlus,
  faShieldAlt,
  faFingerprint,
  faTrash
)

function Chatbox({ theme, provider, signer, address, DEBUG = true }) {
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState()
  const [keyringRead, setKeyringRead] = useState()
  const [keyringWrite, setKeyringWrite] = useState()

  const [panel, setPanel] = useState(false)
  const [popup, setPopup] = useState(false)
  const [open, setOpen] = useState(true)
  const [close, setClose] = useState(false)
  const [max, setMax] = useState(false)
  const anchorRef = useRef()

  const handleMsg = (isSelf, txt) => {
    const relativeTime = new RelativeTime()
    const time = relativeTime.from(new Date())
    const msg = {
      from: isSelf ? 'User' : 'Keyring',
      self: isSelf,
      text: txt,
      when: time
    }

    setMessages((messages) => [...messages, msg])
    anchorRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  const handleError = (err) => {
    const relativeTime = new RelativeTime()
    const time = relativeTime.from(new Date())
    const msg = {
      from: 'Keyring',
      self: false,
      text: err,
      when: time
    }

    setMessages((messages) => [...messages, msg])
    anchorRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  const checkUser = async () => {
    let text = 'You can freely use this dapp'
    try {
      await keyringRead.isValid(address)
    } catch (e) {
      console.error(e)
      if (e.errorName == 'Keyring__Invalid') {
        setStatus(NO_NFT)
        text = 'You do not have a valid idNFT, please create one'
      } else if (e.errorName == 'Keyring__Expired') {
        setStatus(EXPIRED)
        text = 'Your idNFT has expired, please refresh it'
      } else {
        setStatus(ERR)
        text = 'Generic error, check your web3 wallet connection'
      }
    }

    handleMsg(false, text)
  }

  useEffect(() => {
    const initContract = async () => {
      const readProvider = new ethers.providers.JsonRpcProvider(
        'https://rinkeby.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad'
      )
      const tempReadContract = new ethers.Contract(CONTRACT, ABI, readProvider)
      const tempWriteContract = new ethers.Contract(CONTRACT, ABI, signer)
      setKeyringRead(tempReadContract)
      setKeyringWrite(tempWriteContract)

      tempReadContract.on('IdentityTokenAssigned', (user, data) => {
        console.log(user, data)

        if (user == address) {
          handleMsg(
            true,
            'idNFT successfully minted and assigned, time to refresh it'
          )
        }
      })

      tempReadContract.on('IdentityTokenRefreshed', (user, data) => {
        console.log(user, data)

        if (user == address) {
          handleMsg(true, 'idNFT successfully refreshed')
        }
      })

      tempReadContract.on('IdentityTokenRemoved', (user, data) => {
        console.log(user, data)

        if (user == address) {
          handleMsg(true, 'idNFT successfully removed')
        }
      })

      tempReadContract.on('IdentityTokenError', (user, data) => {
        console.log(user, data)

        if (user == address)
          handleError('An error occurred, please contact the support')
      })
    }
    initContract()
  }, [signer])

  useEffect(() => {
    if (keyringRead != null) checkUser()
  }, [keyringRead, address])

  const hex2str = (hex) => {
    var str = ''
    for (var i = 0; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))

    return str
  }

  const handleCreate = async () => {
    try {
      await keyringWrite.create({ gasLimit: 1000000 })
      const res = await fetch(
        `https://oracle.keyring.network/create?walletAddress=${address}`
      )
      const response = await res.json()
      const link = response.result
      handleMsg(
        false,
        "Visit this <a href='" +
          link +
          "' target='_blank'>URL</a> to complete the process"
      )
      setStatus(EXPIRED)
    } catch (e) {
      handleError(e.message)
    }
  }

  const handleRefresh = async () => {
    await keyringWrite.refresh(address, { gasLimit: 1000000 })
  }

  const handleDelete = async () => {
    await keyringWrite.remove({ gasLimit: 1000000 })
  }

  // Handle popup events

  // Open = true &&

  const handleMaximise = () => {
    setMax(true)
    setPanel(true)
    /*
    let panel = document.querySelector(".chatbox-panel");
    panel.classList.remove("chatbox-hide");
    panel.classList.add("chatbox-show");*/
    // add display flex

    setPopup(false)
    /*
    let popup = document.querySelector(".chatbox-popup");
    popup.classList.remove("chatbox-show");
    popup.classList.add("chatbox-hide");*/

    setOpen(false)
    /*
    let buttonOpen = document.querySelector(".chatbox-open");
    buttonOpen.classList.remove("chatbox-show");
    buttonOpen.classList.add("chatbox-hide");*/

    setClose(false)
    /*
    let buttonClose = document.querySelector(".chatbox-close");
    buttonClose.classList.remove("chatbox-show");
    buttonClose.classList.add("chatbox-hide");*/
  }

  // Open = false &&

  const handleMinimise = () => {
    setMax(false)
    setPanel(false)
    /*
    let panel = document.querySelector(".chatbox-panel");
    panel.classList.remove("chatbox-show");
    panel.classList.add("chatbox-hide");*/

    // Passed
    setPopup(true)
    /*
    let popup = document.querySelector(".chatbox-popup");
    popup.classList.remove("chatbox-hide");
    popup.classList.add("chatbox-show");*/

    // ?
    setOpen(true)
    /*
    let buttonOpen = document.querySelector(".chatbox-open");
    buttonOpen.classList.remove("chatbox-hide");
    buttonOpen.classList.add("chatbox-show");*/

    // Passed
    setClose(true)
    /*
    let buttonClose = document.querySelector(".chatbox-close");
    buttonClose.classList.remove("chatbox-hide");
    buttonClose.classList.add("chatbox-show");*/

    // ?
  }

  // Open = false && Working

  const handleClosePanel = () => {
    setPanel(false)
    setOpen(true)

    /*
    let panel = document.querySelector(".chatbox-panel");
    panel.classList.remove("chatbox-show");
    panel.classList.add("chatbox-hide");

    let buttonOpen = document.querySelector(".chatbox-open");
    buttonOpen.classList.remove("chatbox-hide");
    buttonOpen.classList.add("chatbox-show");*/
  }

  // Open = false && Working

  const handleClose = () => {
    setPopup(false)
    setClose(false)

    /*
    let panel = document.querySelector(".chatbox-popup");
    panel.classList.remove("chatbox-show");
    panel.classList.add("chatbox-hide");

    let button = document.querySelector(".chatbox-close");
    button.classList.remove("chatbox-show");
    button.classList.add("chatbox-hide");*/
  }

  // Open = true && Working

  const handleOpen = () => {
    setPopup(true)
    setClose(true)

    /*
    let panel = document.querySelector(".chatbox-popup");
    panel.classList.remove("chatbox-hide");
    panel.classList.add("chatbox-show");

    let button = document.querySelector(".chatbox-close");
    button.classList.remove("chatbox-hide");
    button.classList.add("chatbox-show"); */
  }

  useEffect(() => {
    var element = document.getElementById('scroll')
    element.scrollTop = element.scrollHeight
  }, [messages])

  return (
    <ChatboxBase>
      <ChatboxOpen onClick={handleOpen} open={open} backgroundColor={theme}>
        <FontAwesomeIcon icon={['fa', 'shield-alt']} size='2x' />
      </ChatboxOpen>
      <ChatboxClose onClick={handleClose} open={close} backgroundColor={theme}>
        <FontAwesomeIcon icon={['fa', 'times']} size='2x' />
      </ChatboxClose>
      <ChatboxPopup open={popup}>
        <ChatboxPopupHeader backgroundColor={theme}>
          <aside style={{ flex: 3 }}>
            <FontAwesomeIcon
              icon={['fa', 'user-circle']}
              size='4x'
              aria-hidden='true'
              style={{
                marginTop: '-32px',
                backgroundColor: theme,
                border: '5px solid rgba(0,0,0,0.1)',
                borderRadius: '50%'
              }}
            />
          </aside>
          <aside style={{ flex: 8 }}>
            <ChatboxTitle>
              <small>Welcome user:</small>
              <br />
              <Wallet address={address} provider={provider} />
            </ChatboxTitle>
          </aside>
          <aside style={{ flex: 1 }}>
            <Button onClick={handleMaximise}>
              <FontAwesomeIcon icon={['fa', 'window-maximize']} />
            </Button>
          </aside>
        </ChatboxPopupHeader>

        <ChatboxPopupMain>
          <ChatBoxPopupHistory id='scroll'>
            <MsgList>
              {messages.length === 0 && (
                <div>
                  A fully decentralised KYC/AML <br /> solution for DeFi.
                </div>
              )}
              {messages.map((message, index) => (
                <ClearFix key={index}>
                  {message.self && (
                    <div>
                      <MessageSelfData>
                        <small>{message.when}</small>&nbsp;&nbsp;&nbsp;
                        <span>{message.from}</span>
                      </MessageSelfData>
                      <MessageSelf>{parse(message.text)}</MessageSelf>
                    </div>
                  )}
                  {!message.self && (
                    <div>
                      <MessageData>
                        <span>{message.from}</span>
                        &nbsp;&nbsp;&nbsp;<small>{message.when}</small>
                      </MessageData>
                      <Message>{parse(message.text)}</Message>
                    </div>
                  )}
                </ClearFix>
              ))}
              <div ref={anchorRef}></div>
            </MsgList>
          </ChatBoxPopupHistory>
        </ChatboxPopupMain>

        <PopupFooter>
          <aside style={{ flex: 20 }}></aside>
          <aside style={{ flex: 1, color: '#888', textAlign: 'center' }}>
            {status == NO_NFT && (
              <FontAwesomeIcon icon={['fa', 'plus']} onClick={handleCreate} />
            )}
            {status == EXPIRED && (
              <FontAwesomeIcon
                icon={['fa', 'fingerprint']}
                onClick={handleRefresh}
              />
            )}
            {status != NO_NFT && (
              <FontAwesomeIcon icon={['fa', 'trash']} onClick={handleDelete} />
            )}
          </aside>
        </PopupFooter>
      </ChatboxPopup>

      <ChatboxPanel open={panel}>
        <PanelHeader>
          <aside style={{ flex: 3 }}>
            <FontAwesomeIcon
              icon={['fa', 'user-circle']}
              size='3x'
              style={
                max
                  ? {
                      marginTop: '0px',
                      backgroundColor: theme,
                      border: '5px solid rgba(0,0,0,0.1)',
                      borderRadius: '50%'
                    }
                  : {
                      marginTop: '-32px',
                      backgroundColor: theme,
                      border: '5px solid rgba(0,0,0,0.1)',
                      borderRadius: '50%'
                    }
              }
            />
          </aside>
          <aside style={{ flex: 6 }}>
            <ChatboxTitle>
              <small>Welcome user:</small>
              <br />
              <Wallet address={address} provider={provider} />
            </ChatboxTitle>
          </aside>
          <aside style={{ flex: 3, textAlign: 'right' }}>
            <Button onClick={handleMinimise}>
              <FontAwesomeIcon icon={['fa', 'window-restore']} />
            </Button>
            <Button onClick={handleClosePanel}>
              <FontAwesomeIcon icon={['fa', 'times']} />
            </Button>
          </aside>
        </PanelHeader>
        <PanelMain style={{ flex: 1 }}>
          <PanelHistory>
            <MsgList id='scroll'>
              {messages.length === 0 && (
                <div>
                  A fully decentralised KYC/AML <br /> solution for DeFi.
                </div>
              )}
              {messages.map((message, index) => (
                <ClearFix key={index}>
                  {message.self ? (
                    <div>
                      <MessageSelfData>
                        <small>{message.when}</small>&nbsp;&nbsp;&nbsp;
                        <span>{message.from}</span>
                      </MessageSelfData>
                      <MessageSelf>{parse(message.text)}</MessageSelf>
                    </div>
                  ) : (
                    <div>
                      <MessageData>
                        <span>{message.from}</span>
                        &nbsp;&nbsp;&nbsp;<small>{message.when}</small>
                      </MessageData>
                      <Message>{parse(message.text)}</Message>
                    </div>
                  )}
                </ClearFix>
              ))}
            </MsgList>
          </PanelHistory>
        </PanelMain>
        <PanelFooter>
          <aside style={{ flex: 20 }}></aside>
          <aside style={{ flex: 1, color: '#888', textAlign: 'center' }}>
            {status == NO_NFT && (
              <FontAwesomeIcon icon={['fa', 'plus']} onClick={handleCreate} />
            )}
            {status == EXPIRED && (
              <FontAwesomeIcon
                icon={['fa', 'fingerprint']}
                onClick={handleRefresh}
              />
            )}
            {status != NO_NFT && (
              <FontAwesomeIcon icon={['fa', 'trash']} onClick={handleDelete} />
            )}
          </aside>
        </PanelFooter>
      </ChatboxPanel>
    </ChatboxBase>
  )
}

Chatbox.propTypes = {
  theme: PropTypes.string,
  provider: PropTypes.object.isRequired,
  address: PropTypes.string.isRequired,
  DEBUG: PropTypes.bool
}

export default Chatbox
