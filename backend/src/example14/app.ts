import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { askOpenAI } from '../middlewares/askOpenAI/askOpenAi'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import axios from 'axios'
import 'dotenv/config'
import { sendAnswerToCentralApi } from '../middlewares/sendAnswerToCentralApi/sendAnswerToCentralApi'

const DEFAULT_TXT_FILE_NAME = 'example_14_default_data.txt'
const FILES_DIR = 'files'
const OUTPUT_FILE_NAME = 'names_and_cities.md'
const defaultFilePath = join(__dirname, FILES_DIR, DEFAULT_TXT_FILE_NAME)
const outputFilePath = join(__dirname, OUTPUT_FILE_NAME)
const defaultNoteContent = readFileSync(defaultFilePath, 'utf-8')

type DbType = 'people' | 'places'

export const askCentralaDb = async (nameOrCity: string, dbType: DbType): Promise<any> => {
  const payload = {
    apikey: process.env.POLIGON_API_KEY,
    query: nameOrCity.toUpperCase(),
  }
  try {
    const response = await axios.post(`${process.env.CENTRALA_API_URL}/${dbType}`, payload)

    return response.data.message
  } catch (error) {
    console.error('Error in sendDbQuery:', error)
    throw error
  }
}

const systemPrompt = `
You are an expert in analyzing text data.
<goal>
You are given a text and you need to extract all the unique person names and city names mentioned in the text.
You need to return your answer as two separate lists: one for person names and one for city names.
</goal>

<rules>
Return only JSON answer with two arrays (names and cities)
in Names list return only names without Surnames and any other text.
in Cities list return only cities without any other text.
Remove all special characters from names and cities.
Always return only capital letters for names and cities.
Remove Polish characters from names and cities. for example: ą, ć, ę, ł, ń, ś, ź, ż change to a, c, e, l, n, s, z, z
Do not include duplicates.
dont return anything else like comments, explanations, etc.
</rules>

<example_answer>
{
"names": ["JOHN", "JANE", "BOB", "ALICE"],
"cities": ["NEW YORK", "LONDON", "PARIS"]
}
</example_answer>
`

const userPrompt = `<Note> ${defaultNoteContent} </Note>`
const messages: ChatCompletionMessageParam[] = [{ role: 'user', content: userPrompt }]

const getCitiesAndNamesFromDefaultNote = async () => {
  if (existsSync(outputFilePath)) {
    const CitiesAndNamesFileContent = readFileSync(outputFilePath, 'utf-8')
    console.log('File already exists. Content:')
    console.log(CitiesAndNamesFileContent)

    return CitiesAndNamesFileContent
  }

  const response = await askOpenAI({
    systemPrompt,
    messages,
  })

  console.log('Cities and names from LLM: ', response.answer)
  writeFileSync(outputFilePath, response.answer, 'utf-8')
  console.log(`LLM response saved to ${OUTPUT_FILE_NAME}`)

  return response.answer
}

const extractCitiesAndNames = (
  jsonString: string,
): { citiesDefault: string[]; namesDefault: string[] } => {
  try {
    const inputJsonStringTrimmed = jsonString.trim()
    const inputJsonStringParsed = JSON.parse(inputJsonStringTrimmed)

    console.log('CitiesDefault: ', inputJsonStringParsed.cities)
    console.log('NamesDefault: ', inputJsonStringParsed.names)

    return {
      citiesDefault: Array.isArray(inputJsonStringParsed.cities)
        ? inputJsonStringParsed.cities
        : [],
      namesDefault: Array.isArray(inputJsonStringParsed.names) ? inputJsonStringParsed.names : [],
    }
  } catch (e) {
    console.error('Could not parse JSON:', e)
    return { citiesDefault: [], namesDefault: [] }
  }
}

const normalizeName = (name: string): string => {
  return name
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z]/g, '')
}

export const handleProcessExample14 = async () => {
  const citiesAndNames = await getCitiesAndNamesFromDefaultNote()
  const { citiesDefault, namesDefault } = extractCitiesAndNames(citiesAndNames)

  const namesQueue: string[] = [...namesDefault]
  const citiesQueue: string[] = [...citiesDefault]
  const visitedNames: Set<string> = new Set()
  const visitedCities: Set<string> = new Set()
  let foundBarbara = false
  let barbaraLocation = ''

  const initialCities = new Set(citiesDefault)

  while ((namesQueue.length > 0 || citiesQueue.length > 0) && !foundBarbara) {
    while (namesQueue.length > 0 && !foundBarbara) {
      const name = namesQueue.shift()
      if (!name || visitedNames.has(name)) continue

      visitedNames.add(name)
      console.log(`\nChecking person: ${name}`)

      try {
        const nameResponse = await askCentralaDb(name, 'people')
        console.log(`API response for ${name}:`, nameResponse)

        if (nameResponse === '[**RESTRICTED DATA**]') {
          console.log(`Skipping ${name} - RESTRICTED DATA`)
          continue
        }

        const cities = Array.isArray(nameResponse) ? nameResponse : [nameResponse]

        for (const city of cities) {
          if (typeof city === 'string') {
            const cityNames = city
              .split(' ')
              .map((s) => s.trim())
              .filter(Boolean)

            for (const cityName of cityNames) {
              if (!visitedCities.has(cityName)) {
                citiesQueue.push(cityName)
                console.log(`Added city to queue: ${cityName}`)
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error processing person ${name}:`, error)
      }
    }

    while (citiesQueue.length > 0 && !foundBarbara) {
      const city = citiesQueue.shift()
      if (!city || visitedCities.has(city)) continue

      visitedCities.add(city)
      console.log(`\nChecking city: ${city}`)

      try {
        const cityResponse = await askCentralaDb(city, 'places')
        console.log(`API response for ${city}:`, cityResponse)

        if (cityResponse === '[**RESTRICTED DATA**]') {
          console.log(`Skipping ${city} - RESTRICTED DATA`)
          continue
        }

        const people = Array.isArray(cityResponse) ? cityResponse : [cityResponse]

        for (const person of people) {
          if (typeof person === 'string') {
            const personNames = person
              .split(' ')
              .map((s) => s.trim())
              .filter(Boolean)

            for (const personName of personNames) {
              const normalizedName = normalizeName(personName)

              if (!visitedNames.has(normalizedName)) {
                namesQueue.push(normalizedName)
                console.log(`Added person to queue: ${normalizedName}`)
              }

              // Check if this is Barbara in a new city
              if (normalizedName === 'BARBARA' && !initialCities.has(city)) {
                console.log(`Found Barbara in new city: ${city}!`)
                foundBarbara = true
                barbaraLocation = city
                break
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error processing city ${city}:`, error)
      }
    }
  }

  if (foundBarbara) {
    console.log(`Barbara's current location: ${barbaraLocation}`)

    try {
      const answer = await sendAnswerToCentralApi({
        answer: barbaraLocation,
        taskName: 'loop',
      })
      console.log('Answer from central API:', answer?.message)
    } catch (error) {
      console.error('Error sending answer to central API:', error)
    }
  } else {
    console.log('Barbara not found in any new cities.')
  }
}

// handleProcessExample14()
