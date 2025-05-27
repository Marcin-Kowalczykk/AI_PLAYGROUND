export const generateReportKeywordsPromptV1 = (
  factsSummary: string,
  content: string,
  fileName: string,
) => `Przeanalizuj poniższy raport i wygeneruj listę słów kluczowych w języku polskim. 
  Słowa kluczowe powinny być w mianowniku i oddzielone przecinkami.
  
  WAŻNE ZASADY:
  1. Słowa muszą być w języku polskim i w mianowniku
  2. Uwzględnij informacje z nazwy pliku (np. sektor)
  3. Jeśli pojawiają się osoby, dodaj ich imiona i nazwiska
  4. Jeśli pojawiają się zawody lub specjalizacje, dodaj je (np. nauczyciel, hydraulik, programista)
  5. Jeśli pojawiają się przedmioty lub technologie, dodaj je
  6. Jeśli pojawiają się zwierzęta, użyj ogólnego terminu "zwierzęta"
  7. Słowa powinny być oddzielone przecinkami (np. słowo1,słowo2,słowo3)
  8. Jeśli w raporcie jest mowa o zatrzymaniu, schwytaniu lub kontroli osoby, dodaj jej zawód/rolę jako słowo kluczowe
  9. Jeśli w faktach jest informacja o zawodzie osoby, która pojawia się w raporcie, dodaj ten zawód jako słowo kluczowe
  10. Upewnij się, że wszystkie zawody i role są w mianowniku (np. "nauczyciel", "hydraulik", "programista")
  11. Jeśli w faktach jest informacja o języku programowania lub technologii, którą zna osoba z raportu, dodaj to jako osobne słowo kluczowe (np. "JavaScript", "Python", "React")
  
  Dodatkowy kontekst z powiązanych faktów:
  ${factsSummary}
  
  Treść raportu:
  ${content}
  
  Nazwa pliku: ${fileName}
  
  Wygeneruj listę słów kluczowych, które najlepiej opisują ten raport, uwzględniając zarówno treść raportu jak i powiązane fakty. Pamiętaj, aby uwzględnić wszystkie zawody, role i specjalizacje techniczne osób wymienionych w raporcie lub powiązanych faktach.`
