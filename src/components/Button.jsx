import { css } from '@emotion/css'
import { colors, fonts } from '../theme'

const styles = css`
  width: 100%;
  padding: 24px;
  text-align: center;
  display: block;
  border: 3px solid ${colors.ink};
  border-radius: 22px;
  box-shadow: 6px 6px 0 ${colors.ink};
  font: 700 20px ${fonts.display};
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.12s,
    box-shadow 0.12s;

  &:active {
    transform: translate(6px, 6px);
    box-shadow: 0 0 0 ${colors.ink};
  }

  &.Button--primary {
    background: ${colors.coral};
    color: ${colors.cream};
  }

  &.Button--secondary {
    background: ${colors.cream};
    color: ${colors.ink};
  }
`

function Button({ variant = 'primary', as: Component = 'button', children, ...props }) {
  return (
    <Component
      type={Component === 'button' ? 'button' : undefined}
      className={`${styles} Button--${variant}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Button
