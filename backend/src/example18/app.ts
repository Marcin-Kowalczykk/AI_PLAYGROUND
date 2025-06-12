import 'dotenv/config'
import { convertHtmlToMarkdown } from './htmlToMarkdown'
import { askOpenAI } from '../middlewares/askOpenAI/askOpenAi'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { sendAnswerToCentralApi } from '../middlewares/sendAnswerToCentralApi/sendAnswerToCentralApi'

const QUESTIONS = `https://c3ntrala.ag3nts.org/data/${process.env.POLIGON_API_KEY}/softo.json`
const BASIC_HTML_DATA_URL = 'https://softo.ag3nts.org/'

const getQuestions = async () => {
  const response = await fetch(QUESTIONS)
  const data = await response.json()

  console.log('default questions: ', data)
  return data
}

const getAllPossibleRoutesFromMarkdown = (markdown: string): string[] => {
  const linkRegex = /(?:\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s)]+))/g
  const uniqueRoutes = new Set<string>()
  let match

  while ((match = linkRegex.exec(markdown)) !== null) {
    const url = match[2] || match[3]

    if (url && (url.startsWith('/') || url.startsWith(BASIC_HTML_DATA_URL))) {
      const absoluteUrl = url.startsWith('/') ? `${BASIC_HTML_DATA_URL}${url.slice(1)}` : url
      const cleanUrl = absoluteUrl.split('#')[0].split('"')[0].trim()
      if (!cleanUrl.includes('/loop')) {
        uniqueRoutes.add(cleanUrl)
      }
    }
  }

  return Array.from(uniqueRoutes)
}

const checkIfPageContainsAnswer = async (
  markdown: string,
  question: string,
): Promise<{ hasAnswer: boolean; answer?: string }> => {
  const systemPrompt = `<role>
You are an expert information extraction specialist with deep understanding of web content analysis, semantic relationships, and multilingual website structures, particularly Polish websites.
</role>

<task>
Your primary task is to carefully analyze webpage content and extract precise information that answers the given question, with special attention to Polish language patterns and conventions.
</task>

<analysis_process>
1. First, thoroughly understand the question:
   - What type of information is being requested?
   - What format should the answer be in?
   - What are the key terms and context?
   - Consider both English and Polish terminology

2. Then, carefully analyze the content:
   - Read the entire content thoroughly
   - Look for semantic relationships
   - Consider both explicit and implicit information
   - Pay attention to context and surrounding text
   - Be aware of Polish language patterns and conventions
   - Look for both English and Polish terms

3. Finally, extract the answer:
   - Ensure the answer is complete and precise
   - Verify it matches the question's requirements
   - Check for any formatting requirements
   - Consider Polish language specifics
</analysis_process>

<answer_types>
1. Email addresses:
   - Must be complete and properly formatted
   - Include domain and @ symbol
   - Example: "kontakt@firma.pl"

2. Web interfaces/URLs:
   - Must be complete URLs with protocol
   - Include all necessary path components
   - Example: "https://firma.pl/interfejs"
   - Be aware of Polish URL patterns

3. Certifications/Standards:
   - Must include full standard names
   - Include version numbers if present
   - Example: "ISO 9001:2015"
   - Consider Polish certification terminology
</answer_types>

<rules>
1. Return ONLY the exact answer without any additional formatting
2. If no answer is found, return "NO_ANSWER"
3. Do not add quotes, explanations, or extra text
4. Ensure the answer is complete and precise
5. Take time to analyze thoroughly before responding
</rules>

<examples>
Question: "What is the contact email?"
Content: "Możesz się z nami skontaktować pod adresem kontakt@firma.pl"
Answer: kontakt@firma.pl

Question: "What is the web interface URL?"
Content: "Interfejs jest dostępny pod adresem https://aplikacja.firma.pl"
Answer: https://aplikacja.firma.pl

Question: "What certifications do they have?"
Content: "Firma posiada certyfikaty ISO 9001 oraz ISO/IEC 27001"
Answer: ISO 9001 oraz ISO/IEC 27001
</examples>`

  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'user',
      content: `Question: ${question}\n\nWebpage content:\n${markdown}`,
    },
  ]

  const response = await askOpenAI({
    systemPrompt,
    messages,
  })

  const answer = response.answer.trim()
  return {
    hasAnswer: answer !== 'NO_ANSWER',
    answer: answer !== 'NO_ANSWER' ? answer : undefined,
  }
}

const decideWhichRouteMatchesQuestion = async (
  routes: string[],
  question: string,
): Promise<string | null> => {
  const systemPrompt = `<role>
You are an expert URL analyzer and content path finder with deep understanding of web architecture, information hierarchy, and multilingual website structures, particularly Polish websites.
</role>

<task>
Your task is to analyze a set of URLs and determine which one is most likely to contain the answer to the given question, with special attention to Polish URL patterns and conventions.
</task>

<analysis_process>
1. Question Analysis:
   - What type of information is being sought?
   - What would be the most logical place to find this information?
   - What kind of page or section would typically contain this?
   - Consider both English and Polish terminology

2. URL Analysis:
   - Examine each URL's structure and components
   - Consider the semantic meaning of the path
   - Think about typical content organization patterns
   - Consider the hierarchy of information
   - Be aware of Polish URL patterns and conventions
   - Look for both English and Polish path names

3. Decision Making:
   - Compare each URL against the question's requirements
   - Consider the likelihood of finding the answer
   - Evaluate the specificity and relevance
   - Choose the most promising path
   - Consider Polish website structure conventions
</analysis_process>

<url_considerations>
1. Path Structure:
   - Root level pages (/)
   - Section pages (/sekcja/, /section/)
   - Detail pages (/sekcja/pozycja/, /section/item/)
   - Special pages (/o-nas/, /about/, /kontakt/, /contact/)

2. Common Patterns:
   - Information pages (/informacje/, /info/, /o-nas/, /about/)
   - Contact pages (/kontakt/, /contact/, /wsparcie/, /support/)
   - Product pages (/produkty/, /products/, /uslugi/, /services/)
   - Documentation pages (/dokumentacja/, /docs/, /pomoc/, /help/)
   - Portfolio pages (/portfolio/, /projekty/, /projects/)
   - Client pages (/klienci/, /clients/, /case-studies/)
</url_considerations>

<rules>
1. Return ONLY the selected URL without any formatting
2. If no URL seems relevant, return "null"
3. Do not add quotes or explanations
4. Take time to analyze thoroughly
5. Consider the full context of the question
6. Be aware of both English and Polish URL patterns
</rules>

<examples>
Question: "What is their contact email?"
URLs: ["/", "/o-nas/", "/about/", "/kontakt/", "/contact/"]
Answer: /kontakt/

Question: "What products do they offer?"
URLs: ["/", "/produkty/", "/products/", "/o-nas/", "/about/"]
Answer: /produkty/

Question: "What is their company history?"
URLs: ["/", "/o-nas/", "/about/", "/kontakt/", "/contact/"]
Answer: /o-nas/
</examples>`

  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'user',
      content: `URLs: ${JSON.stringify(routes)}\nQuestion: ${question}`,
    },
  ]

  const response = await askOpenAI({
    systemPrompt,
    messages,
  })

  const selectedUrl = response.answer.trim().replace(/^["']|["']$/g, '')
  return selectedUrl === 'null' ? null : selectedUrl
}

const answerQuestionWithLLM = async (question: string, maxDepth = 8): Promise<string | null> => {
  const visitedUrls = new Set<string>()
  let currentUrl = BASIC_HTML_DATA_URL
  let depth = 0

  while (depth < maxDepth) {
    if (visitedUrls.has(currentUrl)) {
      console.log(`\nSkipping already visited URL: ${currentUrl}`)
      break
    }
    visitedUrls.add(currentUrl)
    console.log(`\nSearching URL (depth ${depth + 1}/${maxDepth}): ${currentUrl}`)

    const markdown = await convertHtmlToMarkdown(currentUrl)
    console.log('Page content length:', markdown.length, 'characters')

    const { hasAnswer, answer } = await checkIfPageContainsAnswer(markdown, question)
    if (hasAnswer && answer) {
      console.log('Found answer on current page!')
      return answer
    }
    console.log('No answer found on current page, looking for next URL...')

    const routes = getAllPossibleRoutesFromMarkdown(markdown)
    console.log('Available routes:', routes)

    const nextUrl = await decideWhichRouteMatchesQuestion(routes, question)
    console.log('Selected next URL:', nextUrl)

    if (!nextUrl || visitedUrls.has(nextUrl)) {
      console.log('No more URLs to check or all URLs visited')
      break
    }

    currentUrl = nextUrl
    depth++
  }

  return null
}

const handleProcessExample18 = async () => {
  try {
    const questions = await getQuestions()

    const answers: Record<string, string | null> = {}

    for (const [key, question] of Object.entries(questions)) {
      console.log(`\nProcessing question ${key}: ${question}`)
      const answer = await answerQuestionWithLLM(question as string)
      answers[key] = answer
      console.log(`Answer for question ${key}:`, answer)
    }

    console.log('Questions:', questions)
    console.log('\nFinal answers:', answers)
  } catch (error) {
    console.error('Error in handleProcessExample18:', error)
  }
}
const sendAnswer = async () => {
  const answerFromCentrala = await sendAnswerToCentralApi({
    taskName: 'softo',
    answer: {
      '01': 'kontakt@softoai.whatever',
      '02': 'https://banan.ag3nts.org',
      '03': 'ISO 9001 oraz ISO/IEC 27001',
    },
  })
  console.log('Answer from centrala:', answerFromCentrala)
  return answerFromCentrala
}

handleProcessExample18()

// sendAnswer()
