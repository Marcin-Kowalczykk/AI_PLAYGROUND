export const generateFactsFileUserPrompt = (documentContent: string) => `
          <document>
          ${documentContent}
          </document>
  
          <goal>
              Please extract from the document all information related to:
              -individuals
              -the professions of those individuals
              -the special skills of those individuals
              - other important information
          </goal>
  
          <rules>
              Respond in Polish language
              Respond precisely in the following format:
              Sektor: Sector described in document or sectors (if there are more than one, separate them with commas)
              Osoba: name surname or title, 
              Profesja / Zawód: job title, 
              Umiejętności specjalne: skills, 
              Inne ważne informacje: other important information,
              with no extra sentences.
          </rules>
  
          <example_answer>
              Sektor: sektor A, sektor B
              Osoba: Marcin Kowalski
              Profesja / Zawód: pilot
              Umiejętności specjalne: latanie, strzelanie, ...,
              Inne ważne informacje: w sektorze A trzeba zrobić X, w sektorze B trzeba zrobić Y,
              …
          </example_answer>`
