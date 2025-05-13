const AGENTS_API = import.meta.env.VITE_AGENTS_XYZ_API

export const sendLoginRequest = async (
  answer: string,
  secretPageSetter: React.Dispatch<React.SetStateAction<string>>,
  errorSetter: React.Dispatch<React.SetStateAction<string>>,
) => {
  try {
    const response = await fetch(AGENTS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=tester&password=574e112a&answer=${answer}`,
    })

    if (!response.ok) {
      throw new Error(`Login Error: ${response.status}`)
    }
    const responseData = await response.text()
    secretPageSetter(responseData)
    return responseData
  } catch (error) {
    errorSetter(`Login error: ${error}`)
    throw error
  }
}
