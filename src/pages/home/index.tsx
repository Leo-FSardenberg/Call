import { Heading, Text } from '@ignite-ui/react'
import { Container, Hero, Preview } from './styles'
import previewImage from '../../assets/app-preview.png'
import Image from 'next/image'
import { ClaimUsernameForm } from './components/ClaimUsernameForm'
import { NextSeo } from 'next-seo'

export default function Home() {
  return (
    <>
      <NextSeo
        title="Descomplique sua agenda | Call demo"
        description="Conecte seu calendário e permita que as pessoas marquem agendamentos
        no seu tempo livre."
      />
      <p>Simple Usage</p>
      <Container>
        <Hero>
          <Heading as="h1" size="4xl">
            Agendamento Descomplicado
          </Heading>
          <Text size="xl">
            Conecte seu calendário e permita que as pessoas marquem agendamentos
            no seu tempo livre.
          </Text>

          <ClaimUsernameForm />
        </Hero>

        <Preview>
          <Image
            src={previewImage}
            alt="calendario"
            height={400}
            quality={100}
            priority
          />
        </Preview>
      </Container>
    </>
  )
}
