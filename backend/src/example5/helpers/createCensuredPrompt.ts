export const createCensuredPrompt = (textToCensure: string): string => {
  return `
  Zacznij cenzurować poniższy tekst. Zamień wszystkie dane wrażliwe na słowo "CENZURA".
  Dane wrażliwe to: imię i nazwisko, miasto, nazwa i numer ulicy (łącznie), wiek.
  Pozostałą treść pozostaw bez zmian.
  
  Przykład odpowiedzi:
  Osoba podejrzana to CENZURA. Adres: CENZURA, ul. CENZURA. Wiek: CENZURA lata
  
  Tekst do cenzury:
  ${textToCensure}
  `
}
