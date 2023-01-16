// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405)
  }

  const { name, username } = req.body

  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })
  if (userExists) {
    return res.status(400).json({
      message: 'User already exists',
    })
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  })

  setCookie({ res }, '@call:userId', user.id, {
    maxAge: 60 * 60 * 10, // 10 horas
    path: '/',
  })

  return res.status(201).json(user)
}
