import { Langfuse } from 'langfuse'
import 'dotenv/config'

export const langfuseConfig = new Langfuse({
  secretKey: process.env.LANG_FUSE_API_KEY_SECRET,
  publicKey: process.env.LANG_FUSE_API_KEY_PUBLIC,
  baseUrl: process.env.LANG_FUSE_HOST,
})
