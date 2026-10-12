import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

function FieldShell({ label, containerClassName, children }: { label: string; containerClassName?: string; children: ReactNode }) {
  return (
    <label className={`block text-sm ${containerClassName ?? ''}`}>
      <span className="block font-medium text-ink mb-1">{label}</span>
      {children}
    </label>
  )
}

export const inputCls = 'w-full min-h-11 px-3 rounded-lg border border-border bg-surface text-ink'

type FieldExtras = { label: string; containerClassName?: string }

export function TextField({ label, containerClassName, className, ...props }: FieldExtras & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldShell label={label} containerClassName={containerClassName}>
      <input className={`${inputCls} ${className ?? ''}`} {...props} />
    </FieldShell>
  )
}

export function TextAreaField({ label, containerClassName, className, ...props }: FieldExtras & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldShell label={label} containerClassName={containerClassName}>
      <textarea className={`${inputCls} min-h-24 py-2 ${className ?? ''}`} {...props} />
    </FieldShell>
  )
}

export function SelectField({
  label,
  containerClassName,
  className,
  options,
  ...props
}: FieldExtras & { options: string[] } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <FieldShell label={label} containerClassName={containerClassName}>
      <select className={`${inputCls} ${className ?? ''}`} {...props}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

export type SelectGroup = { label: string; options: { value: string; label: string }[] }

export function GroupedSelectField({
  label,
  containerClassName,
  className,
  placeholder,
  groups,
  ...props
}: FieldExtras & { placeholder?: string; groups: SelectGroup[] } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <FieldShell label={label} containerClassName={containerClassName}>
      <select className={`${inputCls} ${className ?? ''}`} {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {groups.map((g) => (
          <optgroup key={g.label} label={g.label}>
            {g.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </FieldShell>
  )
}
