import { css } from '@emotion/css'
import { useEffect, useState } from 'react'
import { useLocation, useParams, useNavigate, Navigate } from 'react-router-dom'
import { type QuestionSets, type QuestionSet, type QuestionAnswer, type Question, type ServerToClientEvents } from '../types';
import { useSocket } from '../context/SocketContext';
import { fonts, navyColors as colors } from '../theme'

const answerLetters = ['A', 'B', 'C', 'D', 'E', 'F']

const styles = css`
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${colors.blue};
  padding-top: max(12px, env(safe-area-inset-top));

  @media (min-width: 431px) {
    margin: 40px auto;
    min-height: 700px;
    max-width: 430px;
    border-radius: 32px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  }

  .Questions__stripes {
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

  .Questions__header {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 18px 22px 0;
  }

  .Questions__headerBadge {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 2.5px solid ${colors.navy};
    background: ${colors.yellow};
    font: 700 16px ${fonts.display};
    color: ${colors.navy};
  }

  .Questions__headerText {
    flex: 1;
    min-width: 0;
  }

  .Questions__headerTitle {
    font: 700 14px ${fonts.display};
    color: ${colors.navy};
  }

  .Questions__headerMeta {
    font: 700 10px ${fonts.body};
    letter-spacing: 1.5px;
    color: #2C5B75;
  }

  .Questions__counter {
    width: 46px;
    height: 46px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 3px solid ${colors.navy};
    background: ${colors.red};
    font: 700 19px ${fonts.display};
    color: ${colors.cream};
  }

  .Questions__progress {
    position: relative;
    margin: 14px 22px 0;
    height: 12px;
    border: 2.5px solid ${colors.navy};
    border-radius: 999px;
    background: ${colors.cream};
    overflow: hidden;
  }

  .Questions__progressFill {
    display: block;
    height: 100%;
    background: ${colors.red};
    transition: width 0.25s;
  }

  .Questions__card {
    position: relative;
    margin: 20px 22px 0;
    padding: 24px 20px;
    background: ${colors.cream};
    border: 3px solid ${colors.navy};
    border-radius: 20px;
    box-shadow: 5px 6px 0 ${colors.navy};
  }

  .Questions__question {
    margin: 0;
    font: 700 27px/1.2 ${fonts.display};
    letter-spacing: -0.5px;
    color: ${colors.navy};
    text-wrap: pretty;
  }

  .Questions__answers {
    position: relative;
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 20px 22px 0;
  }

  .Questions__answerButton {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    padding: 18px;
    text-align: left;
    background: ${colors.cream};
    border: 3px solid ${colors.navy};
    border-radius: 16px;
    box-shadow: 4px 5px 0 ${colors.navy};
    cursor: pointer;
    transition:
      transform 0.12s,
      box-shadow 0.12s,
      background 0.12s;

    &:active {
      transform: translate(4px, 5px);
      box-shadow: 0 0 0 ${colors.navy};
    }

    &.is-selected-you {
      background: ${colors.red};

      .Questions__answerLetter {
        background: ${colors.cream};
      }

      .Questions__answerText {
        color: ${colors.cream};
      }
    }

    &.is-selected-them {
      background: ${colors.blue};

      .Questions__answerLetter {
        background: ${colors.navyFaint25};
      }

      .Questions__answerText {
        color: ${colors.cream};
      }
    }
  }

  .Questions__answerLetter {
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2.5px solid ${colors.navy};
    border-radius: 9px;
    background: ${colors.yellow};
    font: 700 15px ${fonts.display};
    color: ${colors.navy};
  }

  .Questions__answerText {
    font: 600 17px ${fonts.display};
    color: ${colors.navy};
  }

  .Questions__footer {
    position: relative;
    padding: 16px 22px max(25px, env(safe-area-inset-bottom));
  }

  .Questions__nextButton {
    box-sizing: border-box;
    width: 100%;
    padding: 21px;
    text-align: center;
    background: ${colors.navy};
    color: ${colors.cream};
    border: 3px solid ${colors.navy};
    border-radius: 16px;
    box-shadow: 5px 6px 0 rgba(15, 46, 66, 0.35);
    font: 700 20px ${fonts.display};
    cursor: pointer;
    transition:
      transform 0.12s,
      box-shadow 0.12s,
      opacity 0.2s;

    &:active {
      transform: translate(5px, 6px);
      box-shadow: 0 0 0 rgba(15, 46, 66, 0.35);
    }

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
      transform: none;
    }
  }
`

interface locationState {
  questionSet: QuestionSet
}


function Questions() {
  const socket = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const { roomCode } = useParams();

  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [guessingThem, setGuessingThem] = useState<boolean>(false);
  const [yourResponse, setYourResponse] = useState<string>('');
  const [theirResponse, setTheirResponse] = useState<string>('');
  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswer[]>([]);
  const [playerId] = useState<string | null>(() => sessionStorage.getItem('playerId'));

  useEffect(() => {
    const onGameFinished: ServerToClientEvents['gameFinished'] = (data) => {
      navigate(`/questions-review/${roomCode}`, {
          state: {
            players: data.players,
            questionSet: data.questionSet,
        }
      });
    };

    socket.on('gameFinished', onGameFinished);

    return () => {
      socket.off('gameFinished', onGameFinished);
    };
  }, []);

  if (roomCode === undefined || playerId === null) {
    return <Navigate to="/" replace />;
  }

  const { questionSet } = location.state as locationState;
  
  const handleAnswer = (answer: string) => {
    if (guessingThem) {
      setTheirResponse(answer)
    } else {
      setYourResponse(answer)
    }
  }
  
  const handleNextQuestion = () => {
    if (!guessingThem) {
      setGuessingThem(true)
      return;
    }
    setGuessingThem(false);
    const question: Question = questionSet.questions[questionIndex];
    const newQuestionAnswers = [ ...questionAnswers, { questionId: question.id, question: question.question, yourResponse: yourResponse, theirResponse: theirResponse }];
    setQuestionAnswers(newQuestionAnswers);
    if (questionIndex === questionSet.questions.length - 1) {
      socket.emit('finishGame', { roomCode, playerId: playerId , questionAnswers: newQuestionAnswers }, (response) => {
        if (response.status === 'success') {
          navigate(`/waiting-room/${roomCode}`, {
            state: {
              message: response.data.message,
            }
          });
        } else {
          console.error('error', response.message);
        }
      });
    } else {
      setQuestionIndex(questionIndex + 1);
    }
  }


  return (
    <div className={styles}>
      <div className="Questions__stripes" />

      <div className="Questions__header">
        <span className="Questions__headerBadge">Q</span>
        <div className="Questions__headerText">
          <div className="Questions__headerTitle">How would {yourResponse ? 'they' : 'you'} answer?</div>
          <div className="Questions__headerMeta">
            QUESTION {questionIndex + 1} OF {questionSet.questions.length}
          </div>
        </div>
        <span className="Questions__counter">{questionIndex + 1}</span>
      </div>

      <div className="Questions__progress">
        <span
          className="Questions__progressFill"
          style={{
            width: `${((questionIndex + 1) / questionSet.questions.length) * 100}%`,
          }}
        />
      </div>

      <div className="Questions__card">
        <h1 className="Questions__question">
          {questionSet.questions[questionIndex].question}
        </h1>
      </div>

      <div className="Questions__answers">
        {questionSet.questions[questionIndex].answers.map((a, index) => (
          <button
            type="button"
            key={a}
            className={`Questions__answerButton ${yourResponse === a ? 'is-selected-you' : ''} ${theirResponse === a ? 'is-selected-them' : ''}`}
            onClick={() => handleAnswer(a)}
          >
            <span className="Questions__answerLetter">
              {answerLetters[index]}
            </span>
            <span className="Questions__answerText">{a}</span>
          </button>
        ))}
      </div>

      <div className="Questions__footer">
        <button
          type="button"
          className="Questions__nextButton"
          onClick={handleNextQuestion}
        >
          {
            questionIndex === questionSet.questions.length - 1 ? (
              <span>
                Submit Answers
              </span>
            ) : (
              <span>
                {!guessingThem ? 'Submit Your Answer' : 'Guess Their Answer'}
              </span>
            )
          }
        </button>
      </div>
    </div>
  )
}

export default Questions
