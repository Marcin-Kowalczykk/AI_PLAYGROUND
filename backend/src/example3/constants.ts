import 'dotenv/config'

export const PREPARED_JSON_TO_SEND = {
  task: 'JSON',
  apikey: process.env.POLIGON_API_KEY,
  answer: {
    apikey: process.env.POLIGON_API_KEY,
    description:
      'This is simple calibration data used for testing purposes. Do not use it in production environment!',
    copyright: 'Copyright (C) 2238 by BanAN Technologies Inc.',
  },
}

export const DEFAULT_FILE_URL = `${process.env.CENTRALA_API_URL}/data/${process.env.POLIGON_API_KEY}/json.txt`
