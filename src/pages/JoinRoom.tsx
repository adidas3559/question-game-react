import { useRef, useState } from 'react';
import { css } from '@emotion/css'
import { fonts, navyColors as colors } from '../theme'
import { Link, useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketContext';

const styles = css`
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: ${colors.cream};
  padding-top: max(12px, env(safe-area-inset-top));
  /* padding-bottom: max(24px, env(safe-area-inset-bottom)); */

  @media (min-width: 431px) {
    margin: 40px auto;
    min-height: 700px;
    max-width: 430px;
    border-radius: 32px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
    overflow: hidden;
  }

  .JoinRoom__nav {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 22px;
  }

  .JoinRoom__back {
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

  .JoinRoom__navLabel {
    font: 600 13px ${fonts.display};
    letter-spacing: 2px;
    text-transform: uppercase;
    color: ${colors.navy};
  }

  .JoinRoom__body {
    padding: 6px 24px 0;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .JoinRoom__title {
    margin: 0;
    font:
      700 38px / 1 ${fonts.display};
    color: ${colors.navy};
    letter-spacing: -1px;
  }

  .JoinRoom__subtitle {
    margin: 0;
    font: 400 14px/1.5 ${fonts.body};
    color: ${colors.slate};
  }

  .JoinRoom__code {
    position: relative;
    display: flex;
    gap: 10px;
  }

  .JoinRoom__codeInput {
    flex: 1;
    width: 100%;
    min-width: 0;
    height: 74px;
    padding: 0;
    border: 3px solid ${colors.navyFaint25};
    border-radius: 14px;
    background: ${colors.cream};
    font: 700 34px ${fonts.display};
    color: ${colors.navy};
    text-align: center;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      background 0.12s,
      border-color 0.12s,
      box-shadow 0.12s;

    &.filled {
      background: ${colors.yellow};
      border-color: ${colors.navy};
      box-shadow: 4px 5px 0 ${colors.navy};
    }

    &.current {
      border-color: ${colors.navy};
      box-shadow: 4px 5px 0 ${colors.navy};
    }
  }

  .JoinRoom__cursor {
    width: 3px;
    height: 34px;
    background: ${colors.red};
    display: inline-block;
    animation: JoinRoom__blink 1s step-end infinite;
  }

  @keyframes JoinRoom__blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .JoinRoom__codeInputReal {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    border: none;
    background: transparent;
    cursor: text;
  }

  .JoinRoom__nameLabel {
    font: 700 11px ${fonts.body};
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: ${colors.slate};
  }

  .JoinRoom__nameField {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 4px;
  }

  .JoinRoom__nameBox {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border: 3px solid ${colors.navy};
    border-radius: 16px;
    background: ${colors.cream};
    box-shadow: 4px 5px 0 ${colors.navy};
  }

  .JoinRoom__avatar {
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

  .JoinRoom__nameInput {
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

  .JoinRoom__nameCount {
    flex-shrink: 0;
    font: 700 11px ${fonts.body};
    color: ${colors.slateLight};
  }

  .JoinRoom__spacer {
    flex: 1;
  }

  .JoinRoom__error {
    margin: 14px 0 0;
    text-align: center;
    color: #e0716b;
    font-size: 13px;
  }

  .JoinRoom__footer {
    padding: 16px 22px max(25px, env(safe-area-inset-bottom));
    border-top: 3px solid ${colors.navy};
    background: ${colors.blue};
  }

  .JoinRoom__createButton {
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

`

const CODE_LEN = 4;
const NAME_LEN = 12;

function JoinRoom() {
  const socket = useSocket();
  const navigate = useNavigate();

  const [roomCode, setRoomCode] = useState('');
  const [nickname, setNickName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCodeFocused, setIsCodeFocused] = useState(false);
  const codeInputRef = useRef<HTMLInputElement>(null);

  const cells = Array.from({ length: CODE_LEN }, (_, i) => roomCode[i] ?? '');
  const currentIndex = Math.min(roomCode.length, CODE_LEN - 1);

  const handleJoin = () => {
    if (!roomCode.trim() || !nickname.trim()) return;
    socket.emit('joinRoom', { roomCode, nickname }, (response) => {
      if (response.status === 'success') {
        sessionStorage.setItem('playerId', response.data.playerId);
        navigate(`/lobby/${roomCode}`, {
          state: {
            roomName: response.data.roomName,
            players: response.data.players,
          }
        });
      } else {
        setError(response.message)
      }
    });

    
  }

  // TODO fix input when full to show when a user has clicked without having to
  // double click (which clears out the room key)

  return (
    <div className={styles}>
      <div className="JoinRoom__nav">
        <Link to="/" className="JoinRoom__back" aria-label="Back">
          ←
        </Link>
        <span className="JoinRoom__navLabel">Join a Game</span>
      </div>
      <div className="JoinRoom__body">
        <h1 className="JoinRoom__title">
          Enter the
          <br />
          room code
        </h1>
        <p className="JoinRoom__subtitle">
          Ask the host — it&rsquo;s on their screen.
        </p>
        <div className="JoinRoom__code">
          {cells.map((ch, i) => {
            const isCurrent = i === currentIndex;
            const stateClass = ch ? ' filled' : isCurrent ? ' current' : '';
            return (
              <div key={i} className={`JoinRoom__codeInput${stateClass}`}>
                {ch || (isCurrent && isCodeFocused ? <span className="JoinRoom__cursor" /> : null)}
              </div>
            );
          })}
          <input
            ref={codeInputRef}
            type="text"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            autoCorrect="off"
            maxLength={CODE_LEN}
            value={roomCode}
            autoCapitalize="characters"
            className="JoinRoom__codeInputReal"
            onFocus={() => setIsCodeFocused(true)}
            onBlur={() => setIsCodeFocused(false)}
            onChange={(e) => {
              setRoomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, CODE_LEN));
              setError(null);
            }}
          />
        </div>
        <div className="JoinRoom__nameField">
          <span className="JoinRoom__nameLabel">Your name</span>
          <div className="JoinRoom__nameBox">
            <div className="JoinRoom__avatar">{nickname.trim() ? nickname.trim()[0].toUpperCase() : '?'}</div>
            <input
              type="text"
              placeholder="Pick a nickname"
              maxLength={NAME_LEN}
              value={nickname}
              className="JoinRoom__nameInput"
              onChange={(e) => setNickName(e.target.value.slice(0, NAME_LEN))}
            />
            <span className="JoinRoom__nameCount">{nickname.length}/{NAME_LEN}</span>
          </div>
        </div>
      </div>
      <div className="JoinRoom__spacer" />
      {error && <p className="JoinRoom__error">{error}</p>}
      <div className="JoinRoom__footer">
        <button
          type="button"
          className="JoinRoom__createButton"
          onClick={handleJoin}
          disabled={!roomCode.trim() || !nickname.trim()}
        >
          Join Room
        </button>
      </div>
    </div>
  )
}

export default JoinRoom
