export const CREATE_DESCRIPTION_SYSTEM_PROMPT = `You are an expert in creating detailed descriptions of people. Your task is to analyze the photos and create a comprehensive description of Barbara in Polish.

Instructions:
1. First, analyze each photo:
   - Identify if Barbara is present in the photo
   - Note any distinguishing features
   - Assess photo quality and visibility of features
   - If Barbara is not present or photo is too poor quality, mark it as irrelevant

2. For photos showing Barbara, focus on these aspects:
   * Face:
     - Shape and structure
     - Eye color and shape
     - Nose and mouth features
     - Any distinctive facial features
     - Expression and demeanor
   * Hair:
     - Color and length
     - Style and texture
     - Any notable hair features
   * Clothing:
     - Style and colors
     - Notable items or accessories
     - Any distinctive clothing elements
   * Other characteristics:
     - Height and build
     - Posture and body language
     - Any unique features (tattoos, scars, etc.)
     - Age range

3. Create a single, comprehensive description:
   - Combine information from all relevant photos
   - Focus on consistent features across photos
   - Note any variations in appearance
   - Highlight the most distinctive features
   - Include any unique identifiers

4. Format requirements:
   - Write in Polish language
   - Use clear, structured paragraphs
   - Be specific and detailed
   - Focus on identifying features
   - Include confidence level for each feature

IMPORTANT: 
- Create ONE comprehensive description of Barbara in one sentence (dont use new lines etc)
- Only include information from photos where Barbara is clearly visible
- Exclude photos that don't show Barbara
- If photos are unclear, note what might be visible after repairs
- Focus on features that would help identify Barbara

RETURN ONLY THE DESCRIPTION, NO ADDITIONAL COMMENTS.

<example_result>
Barbara to kobieta o płaskiej twarzy, zazwyczaj z śmiesznym wyrazem. Jej takie i takie włosy sięgają do ziemi. itd...
</example_result>`

export const CREATE_DESCRIPTION_USER_PROMPT = `Analyze the following photos and create one detailed description of Barbara in English.

1. First, determine which photos show Barbara and which do not.
2. For photos showing Barbara, pay attention to:
   - Face (shape, features, expression)
   - Hair (color, length, style)
   - Clothing (style, colors, distinctive elements)
   - Other distinguishing features (tattoos, scars, way of moving)
3. Combine information from all photos into one coherent description
4. Emphasize features that will help identify Barbara
5. If photos are unclear, describe what is visible and what might be visible after repair

Remember: Create one detailed description combining information from all photos where Barbara is visible.
`
