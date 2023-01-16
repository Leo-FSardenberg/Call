import { Box, styled, Text } from '@ignite-ui/react'

export const Form = styled(Box, {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  padding: '$4',
  gap: '$2',
  margintop: '$4',

  '@media(max-width: 600px)': {
    gridTemplateColumns: '1fr',
  },
})

export const FormNote = styled('div', {
  marginTop: '$2',

  [`> ${Text}`]: { color: '$gray400' },
})
