import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'

interface FormFieldProps {
  label: string;
  id: string;
  type: string;
  error: string | undefined;
  spellCheck?: boolean;
  autoComplete?: string;
  isRequired?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField: React.FC<FormFieldProps> = ({
  label, 
  id, 
  type, 
  error,
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
        placeholder={label}
        spellCheck={spellCheck} 
        autoComplete={autoComplete}
        aria-invalid={!!error}
        onChange={onChange}
      />
      {!!error && (
        <p className='text-destructive text-sm absolute top-0 right-0'>{error}</p>
      )}
    </div>
  )
}

export default FormField
