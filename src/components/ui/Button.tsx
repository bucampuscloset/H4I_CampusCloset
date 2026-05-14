import Link from 'next/link'
import { cn } from '@/lib/cn'

const variants = {
  primary: 'bg-brand-dark-olive text-white hover:opacity-90 rounded-full',
  secondary: 'bg-white text-brand-text border-2 border-black hover:bg-gray-50 rounded-full',
  dark: 'bg-brand-brown text-white hover:opacity-90 rounded-full',
  olive: 'bg-brand-olive text-white hover:opacity-90 rounded-full',
} as const

const sizes = {
  sm: 'px-4 py-2 text-[14px]',
  md: 'px-8 py-3 text-[16px]',
  lg: 'px-10 py-4 text-[18px]',
} as const

interface ButtonProps {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  href?: string
  fullWidth?: boolean
  className?: string
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  fullWidth = false,
  className,
  children,
  type = 'button',
  disabled,
  onClick,
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center font-heading font-bold transition-opacity',
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    disabled && 'opacity-50 cursor-not-allowed',
    className,
  )

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
