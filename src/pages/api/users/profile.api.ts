import { NextApiRequest, NextApiResponse } from 'next'
// eslint-disable-next-line camelcase
import { unstable_getServerSession } from 'next-auth'
import { buildNextauthOptions } from '../auth/[...nextauth].api'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

const updateProfileBodySchema = z.object({
  bio: z.string(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'PUT') {
    return res.status(405).end()
  }
  const session = await unstable_getServerSession(
    req,
    res,
    buildNextauthOptions(req, res),
  )

  if (!session) {
    return res.status(401).end()
  }

  const { bio } = updateProfileBodySchema.parse(req.body)

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      bio,
    },
  })
  //  await prisma.userTimeInterval.createMany

  return res.status(204).end()
}
