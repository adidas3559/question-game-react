import { css } from '@emotion/css'
import { useEffect, useState } from 'react'
import { useLocation, useParams, useNavigate, Navigate } from 'react-router-dom'
import { type QuestionSets, type QuestionSet, type QuestionAnswer, type Question, type PlayersState } from '../types';
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
  overflow: hidden;
  background: ${colors.red};
  padding-top: max(12px, env(safe-area-inset-top));

  @media (min-width: 431px) {
    margin: 40px auto;
    min-height: 700px;
    max-width: 430px;
    border-radius: 32px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  }

  .Results__stripes {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.12) 0px,
      rgba(255, 255, 255, 0.12) 14px,
      rgba(255, 255, 255, 0) 14px,
      rgba(255, 255, 255, 0) 30px
    );
  }

  .Results__body {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 28px 24px 0;
    text-align: center;
  }

  .Results__badge {
    transform: rotate(-2deg);
    padding: 8px 16px;
    background: ${colors.cream};
    color: ${colors.red};
    border: 2.5px solid ${colors.navy};
    border-radius: 10px;
    font: 700 12px ${fonts.display};
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .Results__title {
    margin: 6px 0 0;
    font: 700 46px/1 ${fonts.display};
    letter-spacing: -1.5px;
    color: ${colors.cream};
    text-shadow: 4px 4px 0 ${colors.navy};
  }

  .Results__podium {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    width: 100%;
    margin-top: 26px;
  }

  .Results__podiumColumn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    &.is-winner {
      flex: 1.15;
    }
  }

  .Results__podiumAvatar {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    border: 3px solid ${colors.navy};

    .is-winner & {
      width: 66px;
      height: 66px;
    }
  }

  .Results__podiumBlock {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    width: 100%;
    box-sizing: border-box;
    background: ${colors.cream};
    border: 3px solid ${colors.navy};
    border-radius: 12px 12px 0 0;

    &.is-winner {
      background: ${colors.yellow} !important;
    }
  }

  .Results__podiumRank {
    font: 700 26px ${fonts.display};
    color: ${colors.navy};

    &.is-winner {
      font-size: 34px;
    }
  }

  .Results__podiumName {
    font: 700 12px ${fonts.display};
    color: ${colors.navy};

    &.is-winner {
      font-size: 14px;
    }
  }

  .Results__podiumScore {
    font: 700 11px ${fonts.body};
    color: ${colors.slate};

    .is-winner & {
      font-size: 12px;
      color: #6B5714;
    }
  }

  .Results__statsCard {
    display: flex;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    margin-top: 18px;
    padding: 14px 16px;
    text-align: left;
    background: ${colors.cream};
    border: 3px solid ${colors.navy};
    border-radius: 16px;
    box-shadow: 4px 5px 0 ${colors.navy};
  }

  .Results__statLabel {
    font: 700 11px ${fonts.body};
    letter-spacing: 1px;
    color: ${colors.slate};
  }

  .Results__statValue {
    font: 700 16px ${fonts.display};
    color: ${colors.navy};
  }

  .Results__footer {
    position: relative;
    display: flex;
    gap: 10px;
    padding: 16px 24px max(20px, env(safe-area-inset-bottom));
  }

  .Results__footerButton {
    box-sizing: border-box;
    flex: 1;
    padding: 20px;
    text-align: center;
    background: ${colors.cream};
    color: ${colors.navy};
    text-decoration: none;
    border: 3px solid ${colors.navy};
    border-radius: 16px;
    box-shadow: 4px 5px 0 ${colors.navy};
    font: 700 18px ${fonts.display};
    cursor: pointer;
    transition:
      transform 0.12s,
      box-shadow 0.12s;

    &.is-primary {
      background: ${colors.yellow};
    }

    &:active {
      transform: translate(4px, 5px);
      box-shadow: 0 0 0 ${colors.navy};
    }
  }
`

const PODIUM = [
  {
    rank: 2,
    name: 'You',
    score: '1,400',
    color: avatarColors.red,
    height: 96,
    winner: false,
  },
  {
    rank: 1,
    name: 'Dev',
    score: '1,700',
    color: avatarColors.mint,
    height: 136,
    winner: true,
  },
  {
    rank: 3,
    name: 'Sam',
    score: '1,100',
    color: avatarColors.purple,
    height: 74,
    winner: false,
  },
]

interface locationState {
  players: PlayersState[]
}

function Results() {
  // const socket = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const [playerId] = useState<string | null>(() => sessionStorage.getItem('playerId'));


  const { players } = location.state as locationState;

  const you = players.find(p => p.id === playerId);
  const otherPlayer = players.find(p => p.id !== playerId);

  if (!you || !otherPlayer) {
    console.error("missing one of the players!", [you, otherPlayer]);
    return;
  }
 
  const theirResponses = otherPlayer?.questionAnswers.map(qa => {
    const yourGuess = you?.questionAnswers.find(yourQa => yourQa.questionId === qa.questionId);
    return { questionId: yourGuess?.questionId, question: yourGuess?.question, yourGuess: yourGuess?.theirResponse, theirAnswer: qa.yourResponse }
  }) || [];

  const yourResponses = otherPlayer?.questionAnswers.map(qa => {
    const yourAnswer = you?.questionAnswers.find(yourQa => yourQa.questionId === qa.questionId);
    return { questionId: yourAnswer?.questionId, question: yourAnswer?.question, yourAnswer: yourAnswer?.yourResponse, theirGuess: qa.theirResponse }
  }) || [];

  const yourCorrect: number = theirResponses.reduce((total: number, qa) => {
    if (qa.theirAnswer === qa.yourGuess) {
      return total + 1;
    }
    return total;
  }, 0);

  const theirCorrect: number = yourResponses?.reduce((total: number, qa) => {
    if (qa.theirGuess === qa.yourAnswer) {
      return total + 1;
    }
    return total;
  }, 0);

  const podium: PlayersState[] = yourCorrect > theirCorrect ? [you, otherPlayer] : [otherPlayer, you];
  const tie: boolean = (yourCorrect === theirCorrect);

  return (
    <div className={styles}>
      <div className="Results__stripes" />

      <div className="Results__body">
        <span className="Results__badge">Game over</span>

        <h1 className="Results__title">
          Dev reads
          <br />
          the room
        </h1>

        <div className="Results__podium">
          {podium.map((player, index) => {
            let height = index === 0 ? 136 : 96;
            height = tie ? 96 : height;

            const isYou = player.id === playerId;
            const score = isYou ? yourCorrect : theirCorrect;

            return (
              <div
                key={player.nickname}
                className={`Results__podiumColumn ${(index === 0 || tie) ? 'is-winner' : 'is-loser'}`}
              >
                <span
                  className={`Results__podiumAvatar ${(index === 0 || tie) ? 'is-winner' : 'is-loser'}`}
                  style={{ background: `${index === 0 ? '#6EE7C8' : '#B58CF0'}` }}
                />
                <div
                  className={`Results__podiumBlock ${(index === 0 || tie) ? 'is-winner' : 'is-loser'}`}
                  style={{ height: `${height}px` }}
                >
                  <span className="Results__podiumRank">{index + 1}</span>
                  <span className="Results__podiumName">{player.nickname}</span>
                  <span className="Results__podiumScore">{score} / {theirResponses.length}</span>
                </div>
              </div>
            )
        })}
        </div>

      </div>

      <div className="Results__footer">
        {/* <button type="button" className="Results__footerButton is-primary">
          Rematch
        </button> */}
        <a href='/' type="button" className="Results__footerButton">
          Home
        </a>
      </div>
    </div>
  )
}

export default Results
