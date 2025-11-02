import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'

interface FormFieldProps {
  label: string;
  id: string;
  type: string;
  spellCheck?: boolean;
  autoComplete?: string;
  isRequired?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label, 
  id, 
  type, 
  spellCheck=true,
  autoComplete="on",
  isRequired=true
}) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1">
      <Label htmlFor={id} className='text-sm font-medium'>{label}</Label>
      <Input 
        id={id}
        type= {type}
        placeholder={label}
        spellCheck={spellCheck} 
        autoComplete={autoComplete}
        required={isRequired}/>
    </div>
  )
}

export default FormField
