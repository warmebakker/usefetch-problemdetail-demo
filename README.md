# .Net 8 api backend + Vue 3 frontend 

A playground app to showcase handling [rfc7807](https://www.rfc-editor.org/rfc/rfc7807) formatted fetch errors on the frontend with uniform error handling.

## Backend

- .Net 8
- AspNetCore minimal api's

It uses `builder.Services.AddProblemDetails();` for uniform json data on error.

#### Usage:
`dotnet run -lf https`

## Frontend

- Vue 3
- Typescript
- useAxios from vueuse/integrations to handle the api calls
- Tailwind CSS
- PrimeVue Tailwind Presets 0.8.2

A Toast is shown whenever an api call results in an error.

#### Usage:
`npm install`

`npm run dev`
