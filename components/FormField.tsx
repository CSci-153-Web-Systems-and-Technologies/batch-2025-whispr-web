import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'

interface FormFieldProps {
  label: string;
  id: string;
  type: string;
  value?: string;
  error?: string | undefined;
  isReadOnly?: boolean;
  spellCheck?: boolean;
  autoComplete?: string;
  isRequired?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField: React.FC<FormFieldProps> = ({
  label, 
  id, 
  type, 
  value,
  error,
  isReadOnly = false,
  spellCheck=false,
  autoComplete="on",
  onChange = () => {},
}) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1 relative">
      <Label htmlFor={id} className='text-sm font-medium'>{label}</Label>
      <Input 
        id={id}
        type= {type}
        name={id}
        value={value}
        placeholder={label}
        spellCheck={spellCheck} 
        autoComplete={autoComplete}
        aria-invalid={!!error}
        onChange={onChange}
        readOnly={isReadOnly}
        className={isReadOnly ? 'bg-border cursor-copy' : ''}
      />
      {!!error && (
        <p className='text-destructive text-sm absolute top-0 right-0'>{error}</p>
      )}
    </div>
  )
}

export default FormField
