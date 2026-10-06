import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { maskBRLTyping, formatValueForInput } from '@/lib/currency'

interface CurrencyInputProps {
  id?: string
  label?: string
  value: number
  onChange: (val: number) => void
  placeholder?: string
  icon?: React.ReactNode
  helperText?: string
  className?: string
  size?: 'default' | 'large'
  disabled?: boolean
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = '0,00',
  icon,
  helperText,
  className = '',
  size = 'default',
  disabled = false,
}) => {
  const [displayValue, setDisplayValue] = useState<string>(() =>
    value > 0 ? formatValueForInput(value) : '',
  )

  useEffect(() => {
    // Sincroniza se o valor mudar externamente (ex: carregar cenário ou preset)
    if (value > 0) {
      setDisplayValue(formatValueForInput(value))
    } else {
      setDisplayValue('')
    }
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const { display, numericValue } = maskBRLTyping(raw)
    setDisplayValue(display)
    onChange(numericValue)
  }

  const isLarge = size === 'large'

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <Label
          htmlFor={id}
          className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 flex items-center gap-1.5"
        >
          {icon && <span className="text-[#7c3aed] dark:text-[#C084FC]">{icon}</span>}
          {label}
        </Label>
      )}
      <div className="relative rounded-[8px] shadow-xs">
        <span
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-semibold select-none pointer-events-none transition-colors ${
            isLarge
              ? 'text-lg text-[#7c3aed] dark:text-[#C084FC]'
              : 'text-sm text-slate-600 dark:text-[#A1A1AA]'
          }`}
        >
          R$
        </span>
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          disabled={disabled}
          value={displayValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`pl-11 pr-3 text-slate-900 dark:text-white bg-white dark:bg-[#0A0A14] border-slate-300 dark:border-[#27272A] placeholder:text-slate-500 dark:placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-[#7c3aed] dark:focus-visible:ring-[#C084FC] focus-visible:border-transparent rounded-[8px] transition-all font-mono font-medium ${
            isLarge ? 'h-14 text-2xl tracking-tight' : 'h-11 text-base'
          }`}
        />
      </div>
      {helperText && (
        <p className="text-[11px] font-mono text-slate-600 dark:text-zinc-400 pl-0.5">
          {helperText}
        </p>
      )}
    </div>
  )
}
