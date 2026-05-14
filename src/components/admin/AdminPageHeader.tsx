import { cn } from '@/lib/cn'

interface AdminPageHeaderProps {
  title: string
  subtitle: string
  accentColor?: string
  children?: React.ReactNode
}

export default function AdminPageHeader({
  title,
  subtitle,
  accentColor = 'bg-brand-olive',
  children,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className={cn('h-8 w-1 rounded-full', accentColor)} />
            <h1 className="font-display text-[28px] text-brand-brown">{title}</h1>
          </div>
          <p className="mt-2 pl-4 font-body text-[14px] text-brand-text/60">
            {subtitle}
          </p>
        </div>
        {children}
      </div>
      <div className="mt-4 h-px bg-gradient-to-r from-brand-olive-light via-brand-cream to-transparent" />
    </div>
  )
}
