import { css } from '@emotion/css'
import { useEffect, useState } from 'react'
import { useLocation, useParams, useNavigate, Navigate } from 'react-router-dom'
import type { QuestionSets, QuestionSet, ServerToClientEvents } from '../types';
import { useSocket } from '../context/SocketContext';
import { fonts, navyColors as colors } from '../theme'

const dotColors = ['#6EE7C8', '#F2454A', '#B58CF0', '#FFD93D', '#FF9F5A']

const styles = css`
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${colors.navy};
  padding-top: max(12px, env(safe-area-inset-top));

  @media (min-width: 431px) {
    margin: 40px auto;
    min-height: 700px;
    max-width: 430px;
    border-radius: 32px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  }

  .QuestionSets__stripes {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(
      135deg,
      rgba(94, 200, 245, 0.1) 0px,
      rgba(94, 200, 245, 0.1) 16px,
      rgba(0, 0, 0, 0) 16px,
      rgba(0, 0, 0, 0) 34px
    );
  }

  .QuestionSets__heading {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 24px 22px 0;
  }

  .QuestionSets__eyebrow {
    font: 700 11px ${fonts.body};
    letter-spacing: 2px;
    color: ${colors.blue};
  }

  .QuestionSets__title {
    margin: 0;
    font: 700 40px ${fonts.display};
    letter-spacing: -1px;
    color: ${colors.cream};
  }

  .QuestionSets__list {
    position: relative;
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 11px;
    padding: 20px 22px 0;
  }

  .QuestionSets__setButton {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    padding: 16px;
    text-align: left;
    background: rgba(255, 253, 246, 0.06);
    border: 2.5px solid rgba(255, 253, 246, 0.2);
    border-radius: 16px;
    cursor: pointer;
    transition:
      background 0.15s,
      border-color 0.15s,
      transform 0.12s;

    &:hover {
      background: rgba(255, 253, 246, 0.12);
      border-color: rgba(255, 253, 246, 0.35);
    }

    &:active {
      transform: scale(0.985);
    }

    &.is-selected {
      background: ${colors.yellow};
      border: 3px solid ${colors.cream};

      .QuestionSets__setIndex {
        color: ${colors.navy};
      }

      .QuestionSets__setName {
        color: ${colors.navy};
      }

      .QuestionSets__setMeta {
        color: #6B5714;
      }

      .QuestionSets__setChevron {
        color: ${colors.navy};
      }
    }
  }

  .QuestionSets__setIndex {
    width: 26px;
    flex-shrink: 0;
    font: 700 22px ${fonts.display};
    color: #9DBDD1;
  }

  .QuestionSets__setDot {
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    border-radius: 50%;
    border: 2.5px solid ${colors.cream};
  }

  .QuestionSets__setText {
    flex: 1;
    min-width: 0;
  }

  .QuestionSets__setName {
    display: block;
    font: 700 17px ${fonts.display};
    color: ${colors.cream};
  }

  .QuestionSets__setMeta {
    display: block;
    font: 700 11px ${fonts.body};
    color: #9DBDD1;
  }

  .QuestionSets__setChevron {
    flex-shrink: 0;
    font: 700 22px ${fonts.display};
    color: ${colors.cream};
  }

  .QuestionSets__hint {
    margin-top: 6px;
    padding: 14px 16px;
    border: 2.5px dashed rgba(94, 200, 245, 0.5);
    border-radius: 14px;
    font: 400 13px/1.5 ${fonts.body};
    color: #9DBDD1;

    strong {
      color: ${colors.blue};
    }
  }

  .QuestionSets__footer {
    position: relative;
    padding: 16px 22px max(25px, env(safe-area-inset-bottom));
  }

  .QuestionSets__startButton {
    box-sizing: border-box;
    width: 100%;
    padding: 21px;
    text-align: center;
    background: ${colors.blue};
    color: ${colors.navy};
    border: 3px solid ${colors.cream};
    border-radius: 16px;
    font: 700 20px ${fonts.display};
    cursor: pointer;
    transition: opacity 0.2s;

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  }
`

interface locationState {
  questionSets: QuestionSets
}

function QuestionSets() {
  const socket = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const { roomCode } = useParams();

  const [playerId] = useState<string | null>(() => sessionStorage.getItem('playerId'));
  const [activeButtonIndex, setActiveButtonIndex] = useState(-1);
  const [questionSet, setQuestionSet] = useState<QuestionSet>();

  const state = location.state as locationState | null;

  useEffect(() => {
    const onGameStarted: ServerToClientEvents['gameStarted'] = (data) => {
      navigate(`/questions/${roomCode}`, {
          state: {
            questionSet: data.questionSet,
        }
      });
    };

    socket.on('gameStarted', onGameStarted);

    return () => {
      socket.off('gameStarted', onGameStarted);
    };
  }, []);

  if (roomCode === undefined || state === null || playerId === null) {
    return <Navigate to="/" replace />;
  }

  const { questionSets } = state;

  const handleQuestionSetSelect = (key: string, index: number) => {
    setActiveButtonIndex(index);
    setQuestionSet(questionSets[key]);
  }

  const handleStartGame = () => {
    if (!questionSet) return;
    
    socket.emit('startGame', { roomCode, questionSet: questionSet, playerId })
  }

  return (
    <div className={styles}>
      <div className="QuestionSets__stripes" />

      <div className="QuestionSets__heading">
        <span className="QuestionSets__eyebrow">PICK A QUESTION SET</span>
        <h1 className="QuestionSets__title">Question Sets</h1>
      </div>

      <div className="QuestionSets__list">
        {Object.entries(questionSets).map(([key, set], index) => (
          <button
            type="button"
            key={key}
            onClick={() => handleQuestionSetSelect(key, index)}
            className={`QuestionSets__setButton ${index === activeButtonIndex ? 'is-selected' : ''}`}
          >
            <span className="QuestionSets__setIndex">{index + 1}</span>
            <span
              className="QuestionSets__setDot"
              style={{ background: dotColors[index % dotColors.length] }}
            />
            <span className="QuestionSets__setText">
              <span className="QuestionSets__setName">{key}</span>
              <span className="QuestionSets__setMeta">
                {set.questions.length} questions
              </span>
            </span>
            <span className="QuestionSets__setChevron">›</span>
          </button>
        ))}

        <div className="QuestionSets__hint">
          Pick a set — everyone answers the same <strong>questions</strong> before
          the first round.
        </div>
      </div>

      <div className="QuestionSets__footer">
        <button type="button" className="QuestionSets__startButton" onClick={handleStartGame}>
          Start Game
        </button>
      </div>
    </div>
  )
}

export default QuestionSets;
