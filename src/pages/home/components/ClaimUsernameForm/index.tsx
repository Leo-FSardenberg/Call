import { Button, TextInput, Text } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormNote } from './styles'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(5, { message: 'usuário precisa ter pelo menos 5 letras' })
    .regex(/^([a-z\\-\\_]+)$/i, {
      message: 'o nome de usuário aceita apenas letras e - _',
    })
    .transform((username) => username.toLowerCase()),
})

type claimUsernameFormData = z.infer<typeof claimUsernameFormSchema>

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<claimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  })

  const router = useRouter()

  async function handleClaimUsername(data: claimUsernameFormData) {
    const { username } = data

    await router.push(`/register?username=${username}`)
  }
  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          size="sm"
          prefix="leo.com/"
          placeholder="seu usuario"
          {...register('username')}
        />
        <Button size="sm" type="submit">
          Reservar usuário
          <ArrowRight />
        </Button>
      </Form>
      <FormNote>
        <Text size="sm">
          {errors.username
            ? errors.username.message
            : 'digite o nome de usuário'}
        </Text>
      </FormNote>
    </>
  )
}
