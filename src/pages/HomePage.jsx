import { css } from '@emotion/css'
import Button from '../components/Button'
import { colors, fonts } from '../theme'
import { Link } from 'react-router-dom'

const styles = css`
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: ${colors.yellow};
  padding-top: max(24px, env(safe-area-inset-top));
  padding-bottom: max(24px, env(safe-area-inset-bottom));

  @media (min-width: 431px) {
    margin: 40px auto;
    min-height: 700px;
    max-width: 430px;
    border-radius: 32px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
    overflow: hidden;
  }

  .HomePage__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 26px;
    padding: 0 24px;
  }

  .HomePage__header {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .HomePage__badge {
    display: inline-block;
    transform: rotate(-3deg);
    background: ${colors.ink};
    color: ${colors.yellow};
    padding: 6px 12px;
    border-radius: 999px;
    font: 700 11px ${fonts.display};
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .HomePage__title {
    margin: 0;
    font:
      700 clamp(44px, 15vw, 66px) / 0.92 ${fonts.display};
    color: ${colors.ink};
    letter-spacing: -2px;

    span {
      color: ${colors.coral};
    }
  }

  .HomePage__subtitle {
    margin: 0;
    max-width: 290px;
    font: 400 16px/1.5 ${fonts.body};
    color: ${colors.brown};
  }

  .HomePage__buttons {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .HomePage__online {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    background: ${colors.inkFaint};
    border-radius: 18px;
  }

  .HomePage__avatars {
    display: flex;
  }

  .HomePage__avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid ${colors.yellow};
    display: inline-block;

    & + & {
      margin-left: -10px;
    }

    &--coral {
      background: ${colors.coral};
    }
    &--teal {
      background: ${colors.teal};
    }
    &--ink {
      background: ${colors.ink};
    }
  }

  .HomePage__onlineText {
    font: 700 13px ${fonts.body};
    color: ${colors.brown};
  }
`

function HomePage() {
  return (
    <div className={styles}>
      <div className="HomePage__content">
        <div className="HomePage__header">
          <span className="HomePage__badge">2–12 players</span>
          <h1 className="HomePage__title">
            Huddle<span>.</span>
          </h1>
          <p className="HomePage__subtitle">
            Grab your people. Pick a game. Ten seconds from open to playing.
          </p>
        </div>
        <div className="HomePage__buttons">
          <Button as={Link} to="/host" variant="primary">
            Host a Game
          </Button>
          <Button as={Link} to="/join" variant="secondary">
            Join a Game
          </Button>
        </div>
        <div className="HomePage__online">
          <div className="HomePage__avatars">
            <span className="HomePage__avatar HomePage__avatar--coral" />
            <span className="HomePage__avatar HomePage__avatar--teal" />
            <span className="HomePage__avatar HomePage__avatar--ink" />
          </div>
          <span className="HomePage__onlineText">Maya, Dev + 5 are online</span>
        </div>
      </div>
    </div>
  )
}

export default HomePage
