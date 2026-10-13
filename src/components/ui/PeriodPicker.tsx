import { useId } from 'react'
import { PERIOD_LABELS, defaultPeriod, type PeriodPreset, type PeriodState } from '../../utils/period'
import { inputClass } from './styles'

interface Props {
  value: PeriodState
  onChange: (v: PeriodState) => void
  presets?: PeriodPreset[]
}

export function PeriodPicker({ value, onChange, presets = ['week', 'month', 'year', 'custom'] }: Props) {
  const id = useId()
  return (
    <div className="flex flex-wrap items-end gap-2">
      <div>
        <label htmlFor={`${id}-preset`} className="sr-only">
          Период анализа
        </label>
        <select
          id={`${id}-preset`}
          className={`${inputClass} min-w-40`}
          value={value.preset}
          onChange={(e) => {
            const preset = e.target.value as PeriodPreset
            onChange(preset === 'custom' ? { ...defaultPeriod('custom') } : { ...value, preset })
          }}
        >
          {presets.map((p) => (
            <option key={p} value={p}>
              {PERIOD_LABELS[p]}
            </option>
          ))}
        </select>
      </div>
      {value.preset === 'custom' && (
        <>
          <div>
            <label htmlFor={`${id}-from`} className="sr-only">
              Начало периода
            </label>
            <input
              id={`${id}-from`}
              type="date"
              className={inputClass}
              value={value.from}
              max={value.to || undefined}
              onChange={(e) => onChange({ ...value, from: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor={`${id}-to`} className="sr-only">
              Конец периода
            </label>
            <input
              id={`${id}-to`}
              type="date"
              className={inputClass}
              value={value.to}
              min={value.from || undefined}
              onChange={(e) => onChange({ ...value, to: e.target.value })}
            />
          </div>
        </>
      )}
    </div>
  )
}
