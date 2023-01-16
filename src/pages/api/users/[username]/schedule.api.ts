/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { z } from 'zod'
import dayjs from 'dayjs'
import { google } from 'googleapis'
import { getGoogleOauthToken } from '../../../../lib/google'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }
  const username = String(req.query.username)
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })
  if (!user) {
    return res.status(400).json({ message: 'User does not exist' })
  }

  const createScehdulingBody = z.object({
    name: z.string(),
    email: z.string().email(),
    observations: z.string(),
    date: z.string().datetime(),
  })

  const { name, email, observations, date } = createScehdulingBody.parse(
    req.body,
  )

  const schedulingDate = dayjs(date).startOf('hour')

  if (schedulingDate.isBefore(new Date())) {
    return res.status(400).json({
      message: 'Unavailable date',
    })
  }

  const conflictingScheduling = await prisma.scheduling.findFirst({
    where: {
      user_id: user.id,
      date: schedulingDate.toDate(),
    },
  })
  if (conflictingScheduling) {
    return res.status(400).json({
      message: 'That date is already reserved',
    })
  }
  const scheduling = await prisma.scheduling.create({
    data: {
      name,
      email,
      observations,
      user_id: user.id,
      date: schedulingDate.toDate(),
    },
  })
  const calendar = google.calendar({
    version: 'v3',
    auth: await getGoogleOauthToken(user.id),
  })
  await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    requestBody: {
      summary: `Call Demo: ${name}`,
      description: observations,
      start: {
        dateTime: schedulingDate.format(),
      },
      end: {
        dateTime: schedulingDate.add(1, 'hour').format(),
      },
      attendees: [{ email, displayName: name }],
      conferenceData: {
        createRequest: {
          requestId: scheduling.id,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    },
  })

  return res.status(201)
}
