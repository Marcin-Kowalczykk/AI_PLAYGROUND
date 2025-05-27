export const generateReportKeywordsPromptV2 = (
  factsSummary: string,
  content: string,
  fileName: string,
) => `
    <document>
    ${content}
    </document>

    Tutaj znajdują się powiązane fakty, które mogą być bardzo pomocne w wygenerowaniu słów kluczowych

    <context>
    ${factsSummary}
    </context>

    <file_name>
    ${fileName}
    </file_name>

   <goal>
   Przeanalizuj powyższy dokument(raport) i wygeneruj listę słów kluczowych w języku polskim. 
   </goal>
    
    <important_rules>
    - Słowa muszą być w języku polskim i w mianowniku
    - Słowa kluczowe powinny być w mianowniku i oddzielone przecinkami
    - Uwzględnij informacje z nazwy pliku (np. sektor)
    - Jeśli pojawiają się osoby, dodaj ich imiona i nazwiska
    - Jeśli pojawiają się zawody lub specjalizacje, dodaj je (np. nauczyciel, hydraulik, programista)
    - Jeśli pojawiają się przedmioty lub technologie, dodaj je
    - Jeśli pojawiają się zwierzęta, użyj ogólnego terminu "zwierzęta"
    - Słowa powinny być oddzielone przecinkami (np. słowo1,słowo2,słowo3)
    - Jeśli w raporcie jest mowa o zatrzymaniu, schwytaniu lub kontroli osoby, dodaj jej zawód/rolę jako słowo kluczowe
    - Jeśli w faktach jest informacja o zawodzie osoby, która pojawia się w raporcie, dodaj ten zawód jako słowo kluczowe
    - Upewnij się, że wszystkie zawody i role są w mianowniku (np. "nauczyciel", "hydraulik", "programista")
    - Jeśli w faktach jest informacja o języku programowania lub technologii, którą zna osoba z raportu, dodaj to jako osobne słowo kluczowe (np. "JavaScript", "Python", "React")
    </important_rules>

    <example_answer>
    "keyword1, keyword2, keyword3, keyword4, keyword5"
    </example_answer>
    
    Wygeneruj listę słów kluczowych, które najlepiej opisują ten raport, uwzględniając zarówno treść raportu jak i powiązane fakty. Pamiętaj, aby uwzględnić wszystkie zawody, role i specjalizacje techniczne osób wymienionych w raporcie lub powiązanych faktach. Przed udzieleniem ostatecznej odpowiedzi upewnij się, czy odpowiedź spełnia ważne reguły, jeśli nie, spójrz jeszcze raz na ważne reguły, raport, powiązane fakty, przykładową odpowiedź i nazwę pliku`
