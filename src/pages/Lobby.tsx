import { css } from '@emotion/css'
import { useEffect, useState } from 'react'
import { useLocation, useParams, useNavigate, Navigate } from 'react-router-dom'
import type { PlayersState, ServerToClientEvents } from '../types';
import { useSocket } from '../context/SocketContext';
import { fonts, navyColors as colors } from '../theme'

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
  background: ${colors.blue};
  padding-top: max(12px, env(safe-area-inset-top));

  @media (min-width: 431px) {
    margin: 40px auto;
    min-height: 700px;
    max-width: 430px;
    border-radius: 32px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
    overflow: hidden;
  }

  .Lobby__stripes {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.14) 0px,
      rgba(255, 255, 255, 0.14) 14px,
      rgba(255, 255, 255, 0) 14px,
      rgba(255, 255, 255, 0) 30px
    );
  }

  .Lobby__body {
    position: relative;
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 22px 22px 0;
  }

  .Lobby__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .Lobby__headerLabel {
    font: 600 12px ${fonts.display};
    letter-spacing: 2px;
    text-transform: uppercase;
    color: ${colors.navy};
  }

  .Lobby__modeBadge {
    padding: 6px 12px;
    border: 2.5px solid ${colors.navy};
    border-radius: 999px;
    background: ${colors.cream};
    font: 700 11px ${fonts.body};
    letter-spacing: 1px;
    color: ${colors.navy};
  }

  .Lobby__codeCard {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 20px;
    border: 3px solid ${colors.navy};
    border-radius: 20px;
    background: ${colors.cream};
    box-shadow: 5px 6px 0 ${colors.navy};
  }

  .Lobby__codeLabel {
    font: 700 11px ${fonts.body};
    letter-spacing: 2px;
    text-transform: uppercase;
    color: ${colors.slate};
  }

  .Lobby__codeCells {
    display: flex;
    gap: 8px;
  }

  .Lobby__codeCell {
    width: 56px;
    height: 66px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid ${colors.navy};
    border-radius: 12px;
    background: ${colors.yellow};
    font: 700 32px ${fonts.display};
    color: ${colors.navy};
  }

  .Lobby__codeActions {
    display: flex;
    gap: 10px;
    margin-top: 6px;
  }

  .Lobby__codeButton {
    padding: 10px 16px;
    border: 2.5px solid ${colors.navy};
    border-radius: 999px;
    background: ${colors.cream};
    font: 600 13px ${fonts.display};
    color: ${colors.navy};
    cursor: pointer;
  }

  .Lobby__playersHeader {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .Lobby__playersTitle {
    font: 700 15px ${fonts.display};
    color: ${colors.navy};
  }

  .Lobby__playersCount {
    font: 700 13px ${fonts.body};
    color: ${colors.navy};
  }

  .Lobby__playerGrid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .Lobby__playerCard {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    padding: 12px 8px;
    border: 2.5px solid ${colors.navy};
    border-radius: 14px;
    background: ${colors.cream};
  }

  .Lobby__playerAvatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2.5px solid ${colors.navy};
  }

  .Lobby__playerName {
    font: 700 12px ${fonts.body};
    color: ${colors.navy};
  }

  .Lobby__playerStatus {
    font: 700 9px ${fonts.body};
    letter-spacing: 1px;
    color: ${colors.slate};

    &.host {
      color: ${colors.red};
    }

    &.joining {
      color: ${colors.slateLight};
    }
  }

  .Lobby__inviteCard {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px 8px;
    border: 2.5px dashed ${colors.navyFaint40};
    border-radius: 14px;
    background: transparent;
    cursor: pointer;
  }

  .Lobby__invitePlus {
    font: 700 22px ${fonts.display};
    color: rgba(15, 46, 66, 0.5);
  }

  .Lobby__inviteLabel {
    font: 700 11px ${fonts.body};
    color: rgba(15, 46, 66, 0.5);
  }

  .Lobby__footer {
    position: relative;
    padding: 16px 22px max(25px, env(safe-area-inset-bottom));
  }

  .Lobby__startButton {
    width: 100%;
    padding: 22px;
    text-align: center;
    background: ${colors.red};
    color: ${colors.cream};
    border: 3px solid ${colors.navy};
    border-radius: 16px;
    box-shadow: 5px 6px 0 ${colors.navy};
    font: 700 21px ${fonts.display};
    cursor: pointer;
    transition:
      transform 0.12s,
      box-shadow 0.12s;

    &:active {
      transform: translate(5px, 6px);
      box-shadow: 0 0 0 ${colors.navy};
    }
  }

  .Lobby__errorMessage {
    margin: 14px 0 0;
    text-align: center;
    color: #e0716b;
    font-size: 13px;
  }
`


interface locationState {
  roomName: string,
  players: PlayersState[]
}

function Lobby() {
  const socket = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const { roomCode } = useParams();

  const [playerId] = useState<string | null>(() => sessionStorage.getItem('playerId'));
  const state = location.state as locationState | null;

  const [copied, setCopied] = useState(false);
  const [players, setPlayers] = useState<PlayersState[]>(state?.players ?? []);
  const [roomName, setRoomName] = useState<string>(state?.roomName ?? "");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // TODO 
    // should we add a reconnect feature using the playerId now that we have it?
    // do something ui wise with isHost?

    socket.on('connect', () => {
      console.log('connecting event');
      if (!roomCode || !playerId) {
        console.error('no roomcode or playerId')
        return;
      }
      socket.emit('rejoinLobby', { roomCode, playerId }, (data) => {
        if (data.status === 'success') {
          setPlayers(data.data.players);
          setRoomName(data.data.roomName);
        }
      })
    })

    const onLobbyUpdated: ServerToClientEvents['lobbyUpdated'] = (data) => {
      setPlayers(data.room.players);
    };

    const onError: ServerToClientEvents['error'] = (data) => {
      setError(data.message);
    };

    const onGoToQuestionSets: ServerToClientEvents['goToQuestionSets'] = (data) => {
      console.log('🚀 ~ onGoToQuestionSets ~ data:', data);
      navigate(`/question-sets/${roomCode}`, {
          state: {
            questionSets: data.questionSets,
        }
      });
    };

    socket.on('lobbyUpdated', onLobbyUpdated);
    socket.on('error', onError);
    socket.on('goToQuestionSets', onGoToQuestionSets);

    return () => {
      socket.off('lobbyUpdated', onLobbyUpdated);
      socket.off('error', onError);
      socket.off('goToQuestionSets', onGoToQuestionSets);
    };
  }, []);

  if (roomCode === undefined || playerId === null || state === null) {
    return <Navigate to="/" replace />;
  }

  const handleCopyCode = async () => {
    if (!roomCode) return;
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy room code:', err);
    }
  };

  const handleGoToQuestionSets = () => {
    socket.emit('goToQuestionSets', { roomCode, playerId })
  }

  return (
    <div className={styles}>
      <div className="Lobby__stripes" />
      <div className="Lobby__body">
        <div className="Lobby__header">
          <span className="Lobby__headerLabel">Waiting room</span>
          <span className="Lobby__modeBadge">WHO SAID IT · 8 RDS</span>
        </div>

        <div className="Lobby__codeCard">
          <span className='Lobby__headerLabel'>{roomName}</span>
          <span className="Lobby__codeLabel">Room code</span>
          <div className="Lobby__codeCells">
            {[...roomCode].map((ch, i) => (
              <span key={i} className="Lobby__codeCell">
                {ch}
              </span>
            ))}
          </div>
          <div className="Lobby__codeActions">
            <button
              type="button"
              className="Lobby__codeButton"
              onClick={handleCopyCode}
            >
              {copied ? 'Copied!' : 'Copy code'}
            </button>
            <button type="button" className="Lobby__codeButton">
              Show QR
            </button>
          </div>
        </div>

        <div className="Lobby__playersHeader">
          <span className="Lobby__playersTitle">Players</span>
          <span className="Lobby__playersCount">{players.length} / 12</span>
        </div>

        <div className="Lobby__playerGrid">
          {players.map((player) => (
            <div key={player.nickname} className="Lobby__playerCard">
              <span
                className="Lobby__playerAvatar"
                style={{ background: 'green' }}
              />
              <span className="Lobby__playerName">{player.nickname}</span>
              {/* <span className={`Lobby__playerStatus ${player.statusClass}`}>
                {player.status}
              </span> */}
            </div>
          ))}
          <button type="button" className="Lobby__inviteCard">
            <span className="Lobby__invitePlus">+</span>
            <span className="Lobby__inviteLabel">Invite</span>
          </button>
        </div>
      </div>
      <div className="Lobby__footer">
        {
          error &&
          <p className='Lobby__errorMessage'>{error}</p>
        }
        <button type="button" className="Lobby__startButton" onClick={handleGoToQuestionSets}>
          Start Game
        </button>
      </div>
    </div>
  )
}

export default Lobby
