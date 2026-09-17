import { useState } from 'react'
import { css } from '@emotion/css'
import { fonts, navyColors as colors } from '../theme'
import { Link, useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketContext'

const styles = css`
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: ${colors.cream};
  padding-top: max(12px, env(safe-area-inset-top));

  @media (min-width: 431px) {
    margin: 40px auto;
    min-height: 700px;
    max-width: 430px;
    border-radius: 32px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
    overflow: hidden;
  }

  .HostRoom__nav {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 22px 14px;
  }

  .HostRoom__back {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2.5px solid ${colors.navy};
    border-radius: 12px;
    background: ${colors.cream};
    font: 700 18px ${fonts.display};
    color: ${colors.navy};
    text-decoration: none;
    cursor: pointer;
  }

  .HostRoom__navLabel {
    font: 600 13px ${fonts.display};
    letter-spacing: 2px;
    text-transform: uppercase;
    color: ${colors.navy};
  }

  .HostRoom__body {
    flex: 1;
    overflow-y: auto;
    padding: 0 22px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .HostRoom__section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .HostRoom__sectionLabel {
    font: 700 11px ${fonts.body};
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: ${colors.slate};
  }

  .HostRoom__nameLabel {
    font: 700 11px ${fonts.body};
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: ${colors.slate};
  }

  .HostRoom__nameField {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 4px;
  }

  .HostRoom__nameBox {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border: 3px solid ${colors.navy};
    border-radius: 16px;
    background: ${colors.cream};
    box-shadow: 4px 5px 0 ${colors.navy};
  }

  .HostRoom__avatar {
    flex-shrink: 0;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: ${colors.blue};
    border: 2.5px solid ${colors.navy};
    display: flex;
    align-items: center;
    justify-content: center;
    font: 700 15px ${fonts.display};
    color: ${colors.navy};
  }

  .HostRoom__nameInput {
    flex: 1;
    min-width: 0;
    border: none;
    background: transparent;
    font: 600 18px ${fonts.display};
    color: ${colors.navy};

    &::placeholder {
      color: ${colors.navyFaint40};
    }
  }

  .HostRoom__nameCount {
    flex-shrink: 0;
    font: 700 11px ${fonts.body};
    color: ${colors.slateLight};
  }

  .HostRoom__modes {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .HostRoom__modeInput {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    overflow: hidden;
  }

  .HostRoom__modeCard {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border: 3px solid ${colors.navyFaint30};
    border-radius: 16px;
    background: ${colors.cream};
    transition:
      background 0.12s,
      border-color 0.12s,
      box-shadow 0.12s;
  }

  .HostRoom__modeIcon {
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2.5px solid ${colors.navyFaint40};
    border-radius: 10px;
    background: ${colors.cream};
    font: 700 17px ${fonts.display};
    color: ${colors.slate};
  }

  .HostRoom__modeText {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .HostRoom__modeTitle {
    font: 700 17px ${fonts.display};
    color: ${colors.slate};
  }

  .HostRoom__modeSubtitle {
    font: 400 12px ${fonts.body};
    color: ${colors.slateLight};
  }

  .HostRoom__modeDot {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 3px solid ${colors.navyFaint30};
    background: transparent;
    transition:
      background 0.12s,
      border-color 0.12s;
  }

  .HostRoom__modeInput:checked ~ .HostRoom__modeCard {
    border-color: ${colors.navy};
    background: ${colors.yellow};
    box-shadow: 4px 5px 0 ${colors.navy};
  }

  .HostRoom__modeInput:checked ~ .HostRoom__modeCard .HostRoom__modeIcon {
    border-color: ${colors.navy};
    color: ${colors.navy};
  }

  .HostRoom__modeInput:checked ~ .HostRoom__modeCard .HostRoom__modeTitle {
    color: ${colors.navy};
  }

  .HostRoom__modeInput:checked ~ .HostRoom__modeCard .HostRoom__modeSubtitle {
    color: ${colors.slateDark};
  }

  .HostRoom__modeInput:checked ~ .HostRoom__modeCard .HostRoom__modeDot {
    border-color: ${colors.navy};
    background: ${colors.red};
  }

  .HostRoom__modeInput:focus-visible ~ .HostRoom__modeCard {
    outline: 3px solid ${colors.blue};
    outline-offset: 2px;
  }

  .HostRoom__rounds {
    display: flex;
    gap: 8px;
  }

  .HostRoom__roundInput {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    overflow: hidden;
  }

  .HostRoom__roundPill {
    display: block;
    flex: 1;
    padding: 14px 0;
    text-align: center;
    border: 2.5px solid ${colors.navy};
    border-radius: 12px;
    background: ${colors.cream};
    font: 700 16px ${fonts.display};
    color: ${colors.navy};
    transition:
      background 0.12s,
      box-shadow 0.12s;
  }

  .HostRoom__roundInput:checked ~ .HostRoom__roundPill {
    background: ${colors.blue};
    box-shadow: 3px 4px 0 ${colors.navy};
  }

  .HostRoom__roundInput:focus-visible ~ .HostRoom__roundPill {
    outline: 3px solid ${colors.blue};
    outline-offset: 2px;
  }

  .HostRoom__slider {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .HostRoom__sliderInput {
    flex: 1;
    appearance: none;
    -webkit-appearance: none;
    height: 14px;
    border: 2.5px solid ${colors.navy};
    border-radius: 999px;
    background: linear-gradient(
      to right,
      ${colors.red} 0%,
      ${colors.red} 55%,
      ${colors.cream} 55%,
      ${colors.cream} 100%
    );
    outline: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 28px;
      height: 28px;
      margin-top: -7px;
      border-radius: 50%;
      background: ${colors.yellow};
      border: 3px solid ${colors.navy};
      cursor: pointer;
    }

    &::-moz-range-thumb {
      width: 28px;
      height: 28px;
      box-sizing: border-box;
      border-radius: 50%;
      background: ${colors.yellow};
      border: 3px solid ${colors.navy};
      cursor: pointer;
    }

    &::-moz-range-track {
      height: 14px;
      background: transparent;
      border: none;
    }
  }

  .HostRoom__sliderValue {
    font: 700 20px ${fonts.display};
    color: ${colors.navy};
  }

  .HostRoom__options {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .HostRoom__optionRow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border: 2.5px solid ${colors.navy};
    border-radius: 14px;
    background: ${colors.cream};
    cursor: pointer;
  }

  .HostRoom__optionLabel {
    font: 600 15px ${fonts.display};
    color: ${colors.navy};
  }

  .HostRoom__toggleInput {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    overflow: hidden;
  }

  .HostRoom__toggleTrack {
    width: 52px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 3px;
    border: 2.5px solid ${colors.navy};
    border-radius: 999px;
    background: ${colors.toggleOff};
    transition: background 0.12s;
  }

  .HostRoom__toggleKnob {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: ${colors.cream};
    border: 2px solid ${colors.navy};
    transition: transform 0.12s;
  }

  .HostRoom__toggleInput:checked ~ .HostRoom__toggleTrack {
    background: ${colors.red};
    justify-content: flex-end;
  }

  .HostRoom__toggleInput:focus-visible ~ .HostRoom__toggleTrack {
    outline: 3px solid ${colors.blue};
    outline-offset: 2px;
  }

  .HostRoom__footer {
    padding: 16px 22px max(25px, env(safe-area-inset-bottom));
    border-top: 3px solid ${colors.navy};
    background: ${colors.blue};
  }

  .HostRoom__createButton {
    width: 100%;
    padding: 22px;
    text-align: center;
    background: ${colors.red};
    color: ${colors.cream};
    border: 3px solid ${colors.navy};
    border-radius: 16px;
    box-shadow: 5px 6px 0 ${colors.navy};
    font: 700 20px ${fonts.display};
    cursor: pointer;
    transition:
      transform 0.12s,
      box-shadow 0.12s;

    &:active {
      transform: translate(5px, 6px);
      box-shadow: 0 0 0 ${colors.navy};
    }
  }

  .HostRoom__error {
    margin: 14px 0 0;
    text-align: center;
    color: #e0716b;
    font-size: 13px;
  }
`

const NAME_LEN = 12
const ROOM_NAME_LEN = 20

function HostRoom() {
  const socket = useSocket();
  const navigate = useNavigate();

  const [nickname, setNickName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState<string | null>(null);


  const handleCreateRoom = () => {
    if (!nickname.trim() || !roomName.trim()) return;
    socket.emit('createRoom', { roomName, nickname}, (response) => {
      // TODO if we get bad code back, give error
      if (response.status === 'success') {
        sessionStorage.setItem('playerId', response.data.playerId);
        navigate(`/lobby/${response.data.roomCode}`, {
          state: {
            roomName: roomName,
            players: response.data.players,
          }
        });
      } else {
        setError(response.message);
      }
    })
  }


  return (
    <div className={styles}>
      <div className="HostRoom__nav">
        <Link to="/" className="HostRoom__back" aria-label="Back">
          ←
        </Link>
        <span className="HostRoom__navLabel">Set up your game</span>
      </div>
      <div className="HostRoom__body">
        <div className="HostRoom__nameField">
          <span className="HostRoom__nameLabel">Your name</span>
          <div className="HostRoom__nameBox">
            <div className="HostRoom__avatar">
              {nickname.trim() ? nickname.trim()[0].toUpperCase() : '?'}
            </div>
            <input
              type="text"
              placeholder="Pick a nickname"
              maxLength={NAME_LEN}
              value={nickname}
              className="HostRoom__nameInput"
              onChange={(e) => setNickName(e.target.value.slice(0, NAME_LEN))}
            />
            <span className="HostRoom__nameCount">
              {nickname.length}/{NAME_LEN}
            </span>
          </div>
        </div>

        <div className="HostRoom__nameField">
          <span className="HostRoom__nameLabel">Room name</span>
          <div className="HostRoom__nameBox">
            <input
              type="text"
              placeholder="Name your room"
              maxLength={ROOM_NAME_LEN}
              value={roomName}
              className="HostRoom__nameInput"
              onChange={(e) => setRoomName(e.target.value.slice(0, ROOM_NAME_LEN))}
            />
            <span className="HostRoom__nameCount">
              {roomName.length}/{ROOM_NAME_LEN}
            </span>
          </div>
        </div>

        <div className="HostRoom__section" role="radiogroup" aria-label="Game mode">
          <span className="HostRoom__sectionLabel">Game mode</span>
          <div className="HostRoom__modes">
            <label>
              <input
                type="radio"
                name="mode"
                defaultChecked
                className="HostRoom__modeInput"
              />
              <span className="HostRoom__modeCard">
                <span className="HostRoom__modeIcon">?</span>
                <span className="HostRoom__modeText">
                  <span className="HostRoom__modeTitle">Who Said It</span>
                  <span className="HostRoom__modeSubtitle">
                    Guess how your friends answer
                  </span>
                </span>
                <span className="HostRoom__modeDot" />
              </span>
            </label>
            <label>
              <input type="radio" name="mode" className="HostRoom__modeInput" />
              <span className="HostRoom__modeCard">
                <span className="HostRoom__modeIcon">!</span>
                <span className="HostRoom__modeText">
                  <span className="HostRoom__modeTitle">Hot Takes</span>
                  <span className="HostRoom__modeSubtitle">
                    Rank the room&rsquo;s opinions
                  </span>
                </span>
                <span className="HostRoom__modeDot" />
              </span>
            </label>
          </div>
        </div>

        {/* <div className="HostRoom__section" role="radiogroup" aria-label="Rounds">
          <span className="HostRoom__sectionLabel">Rounds</span>
          <div className="HostRoom__rounds">
            {['5', '8', '12', '∞'].map((value) => (
              <label key={value} style={{ flex: 1, display: 'flex' }}>
                <input
                  type="radio"
                  name="rounds"
                  defaultChecked={value === '8'}
                  className="HostRoom__roundInput"
                />
                <span className="HostRoom__roundPill">{value}</span>
              </label>
            ))}
          </div>
        </div> */}

        {/* <div className="HostRoom__section">
          <span className="HostRoom__sectionLabel">Seconds per question</span>
          <div className="HostRoom__slider">
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              defaultValue="20"
              aria-label="Seconds per question"
              className="HostRoom__sliderInput"
            />
            <span className="HostRoom__sliderValue">20s</span>
          </div>
        </div> */}

        {/* <div className="HostRoom__section">
          <span className="HostRoom__sectionLabel">Options</span>
          <div className="HostRoom__options">
            <label className="HostRoom__optionRow">
              <span className="HostRoom__optionLabel">Spicy question pack</span>
              <input
                type="checkbox"
                defaultChecked
                className="HostRoom__toggleInput"
              />
              <span className="HostRoom__toggleTrack">
                <span className="HostRoom__toggleKnob" />
              </span>
            </label>
            <label className="HostRoom__optionRow">
              <span className="HostRoom__optionLabel">
                Anyone can start next round
              </span>
              <input type="checkbox" className="HostRoom__toggleInput" />
              <span className="HostRoom__toggleTrack">
                <span className="HostRoom__toggleKnob" />
              </span>
            </label>
          </div>
        </div> */}

        
      </div>
      {error && <p className="HostRoom__error">{error}</p>}
      <div className="HostRoom__footer">
        <button
          type="button"
          className="HostRoom__createButton"
          onClick={handleCreateRoom}
          disabled={!roomName.trim() || !nickname.trim()}
        >
          Create Room
        </button>
      </div>
    </div>
  )
}

export default HostRoom
