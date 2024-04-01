# .Net 8 api backend + Vue 3 frontend 

A playground app to showcase handling Rfc7807 formatted api errors.

## Backend

- .Net 8
- AspNetCore minimal api's

It uses `builder.Services.AddProblemDetails();` for uniform json data on error.

#### Usage:
`dotnet run -lf https`

## Frontend

- UseFetch from VueUse to handle the api calls
- Tailwind CSS
- PrimeVue Tailwind Presets 0.8.2

A Toast is shown whenever an api call results in an error.

#### Usage:
`npm install`

`npm run dev`
