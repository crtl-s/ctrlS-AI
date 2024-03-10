# ctrlS-AI

U ovom dijelu se nalaze instrukcije za pokretanje servera samo za AI dio projekta. Za ostale dijelove pogledajte repositorije unutar organizacije

## Requiraments

Stvoriti datoteku .env
```
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_DATABASE=
OPENAI_API_KEY = 
```
**Važna napomena**

Account s kojim je povezan OPENAI_API_KEY **MORA** biti imati pristup sljedećim modelima

- gpt-4-1106-preview
- gpt-4-turbo-preview

Kao što možete primjetiti ovo su preview modeli i nisu dostupni na svakom accountu. Bez njih ne možemo garantirati da će sustav raditi ispravno

## Pokretanje servera

Kako biste instalirali sve dependency pokrenite sljedeću komandu 

```shell
npm install
```

Kako biste pokrenuli server idite 

```shell
node index.js
```

## API endpoints

Svi endpointi na apiju se nalaze na linku

Api trenutno podržava
- generiranje roadmapa
- provjera točnosti odgovora
- Generoiranje personaliziranog roadmapa
- Generiranje lekcija
- Klasifikacija tema
- Chat with Expert

https://app.getpostman.com/join-team?invite_code=72bb7d418bd60da24f6add371d7533d0&target_code=39133ae79b475b34fefc0becbaac8646