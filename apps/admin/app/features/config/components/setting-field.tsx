import { Description, Label, Switch, TextField } from '@heroui/react'
import { useTranslation } from '@app/i18n'
import { OutlineInput } from '../../../shared/components/outline-input'
import type { SettingFieldView } from '../config.types'

type Props = {
  field: SettingFieldView
  value: string
  onChange: (key: string, value: string) => void
}

export function SettingField({ field, value, onChange }: Props) {
  const { t } = useTranslation()
  if (field.kind === 'boolean') {
    return (
      <Switch
        isSelected={value === 'true'}
        onChange={(selected) => onChange(field.key, selected ? 'true' : 'false')}
      >
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          {field.label}
        </Switch.Content>
      </Switch>
    )
  }

  const isPassword = field.kind === 'password'

  return (
    <TextField
      name={field.key}
      type={isPassword ? 'password' : 'text'}
      value={value}
      onChange={(next) => onChange(field.key, next)}
    >
      <Label>{field.label}</Label>
      <OutlineInput
        placeholder={
          isPassword
            ? field.isSet
              ? t('config.secretSet')
              : t('config.secretUnset')
            : field.key
        }
      />
      <Description className="font-mono text-xs">{field.key}</Description>
    </TextField>
  )
}
