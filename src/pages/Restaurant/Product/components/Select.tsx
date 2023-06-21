import { Select as ChakraSelect, FormLabel } from '@chakra-ui/react'
import { CategoryResponse } from '../../Category'
import { UseFormRegister } from 'react-hook-form'

interface SelectProps {
  category: CategoryResponse[]
  name: string
  value?: string
  label?: string
  register: UseFormRegister<any>
  defaultValue?: string
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

export function Select(props: SelectProps) {
  const options = props.category.map((category) => ({
    value: category.id,
    label: category.name,
  }))

  return (
    <>
      {!!props.label && (
        <FormLabel htmlFor={props.name}>{props.label}</FormLabel>
      )}
      <ChakraSelect
        {...props.register(props.name)}
        value={props.value ?? props.defaultValue ?? ''}
        focusBorderColor="gray.500"
        bgColor="gray.900"
        textColor="gray.400"
        variant="filled"
        size="lg"
        onChange={props.onChange}
      >
        {options.map((option) => {
          return(
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        )})}
      </ChakraSelect>
    </>
  )
}
