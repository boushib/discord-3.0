import classNames from 'classnames'
import styles from './Button.module.sass'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'brand' | 'danger' | 'link' | 'secondary' | 'success'
}

const Button = ({ variant = 'brand', className, type = 'button', ...props }: Props) => (
  <button type={type} className={classNames(styles.button, styles[variant], className)} {...props} />
)

export default Button
