import { css } from '@emotion/css'
import { fonts, navyColors as colors } from '../theme'
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketContext'
import type { ServerToClientEvents } from '../types'

const avatarColors = {
  red: '#F2454A',
  yellow: '#FFD93D',
  mint: '#6EE7C8',
  purple: '#B58CF0',
  orange: '#FF9F5A',
}

const styles = css`
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${colors.yellow};
  padding-top: max(12px, env(safe-area-inset-top));

  @media (min-width: 431px) {
    margin: 40px auto;
    min-height: 700px;
    max-width: 430px;
    border-radius: 32px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  }

  .WaitingRoom__stripes {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(
      135deg,
      rgba(15, 46, 66, 0.06) 0px,
      rgba(15, 46, 66, 0.06) 14px,
      rgba(0, 0, 0, 0) 14px,
      rgba(0, 0, 0, 0) 30px
    );
  }

  .WaitingRoom__body {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    padding: 24px 28px;
    text-align: center;
  }

  .WaitingRoom__badge {
    transform: rotate(-3deg);
    padding: 10px 18px;
    border-radius: 12px;
    background: ${colors.navy};
    color: ${colors.yellow};
    font: 700 13px ${fonts.display};
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .WaitingRoom__title {
    margin: 0;
    font: 700 40px/1.05 ${fonts.display};
    letter-spacing: -1px;
    color: ${colors.navy};
  }

  .WaitingRoom__card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    box-sizing: border-box;
    padding: 18px;
    background: ${colors.cream};
    border: 3px solid ${colors.navy};
    border-radius: 20px;
    box-shadow: 5px 6px 0 ${colors.navy};
  }

  .WaitingRoom__playerRow {
    display: flex;
    align-items: center;
    gap: 10px;

    &.is-waiting {
      opacity: 0.55;
    }
  }

  .WaitingRoom__playerAvatar {
    width: 30px;
    height: 30px;
    flex-shrink: 0;
    border-radius: 50%;
    border: 2px solid ${colors.navy};
  }

  .WaitingRoom__playerName {
    flex: 1;
    min-width: 0;
    text-align: left;
    font: 600 15px ${fonts.display};
    color: ${colors.navy};
  }

  .WaitingRoom__playerStatus {
    font: 700 12px ${fonts.body};
    color: #1F8A5B;

    &.is-waiting {
      color: ${colors.slate};
    }
  }

  .WaitingRoom__caption {
    margin: 0;
    font: 400 14px/1.6 ${fonts.body};
    color: #6B5714;

    strong {
      color: ${colors.navy};
    }
  }

  .WaitingRoom__footer {
    position: relative;
    padding: 0 28px max(26px, env(safe-area-inset-bottom));
  }

  .WaitingRoom__progress {
    height: 12px;
    border: 2.5px solid ${colors.navy};
    border-radius: 999px;
    background: ${colors.cream};
    overflow: hidden;
  }

  .WaitingRoom__progressFill {
    display: block;
    height: 100%;
    background: ${colors.red};
    transition: width 0.25s;
  }
`

const PLAYERS = [
  { name: 'You', color: avatarColors.red, locked: true },
  { name: 'Dev', color: avatarColors.mint, locked: true },
]

function WaitingRoom() {
  const socket = useSocket();
  const { roomCode } = useParams();
   const navigate = useNavigate();

  useEffect(() => {
    const onGameFinished: ServerToClientEvents['gameFinished'] = (data) => {
      navigate(`/questions-review/${roomCode}`, {
          state: {
            players: data.players,
            questionSet: data.questionSet,
        }
      });
    };

    const onGoToResults: ServerToClientEvents['goToResults'] = (data) => {
      navigate(`/results/${roomCode}`, {
          state: {
            players: data.players,
        }
      });
    };

    socket.on('gameFinished', onGameFinished);
    socket.on('goToResults', onGoToResults);

    return () => {
      socket.off('gameFinished', onGameFinished);
      socket.off('goToResults', onGoToResults);
    };
  }, []);


  return (
    <div className={styles}>
      <div className="WaitingRoom__stripes" />

      <div className="WaitingRoom__body">
        <div className="WaitingRoom__badge">Answer locked</div>

        <h1 className="WaitingRoom__title">
          Waiting on
          <br />
          the slow ones
        </h1>

        <div className="WaitingRoom__card">
          {PLAYERS.map((player) => (
            <div
              key={player.name}
              className={`WaitingRoom__playerRow ${player.locked ? '' : 'is-waiting'}`}
            >
              <span
                className="WaitingRoom__playerAvatar"
                style={{ background: player.color }}
              />
              <span className="WaitingRoom__playerName">{player.name}</span>
              <span
                className={`WaitingRoom__playerStatus ${player.locked ? '' : 'is-waiting'}`}
              >
                {player.locked ? 'LOCKED' : 'THINKING…'}
              </span>
            </div>
          ))}
        </div>

        <p className="WaitingRoom__caption">
          You guessed <strong>"Masterpiece, obviously"</strong>
        </p>
      </div>

      <div className="WaitingRoom__footer">
        <div className="WaitingRoom__progress">
          <span
            className="WaitingRoom__progressFill"
            style={{ width: '60%' }}
          />
        </div>
      </div>
    </div>
  )
}

export default WaitingRoom
