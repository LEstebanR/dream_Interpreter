# Dream Interpreter 🌙

Una aplicación web que interpreta tus sueños usando inteligencia artificial con enfoque psicológico.

## Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
# API Key de OpenRouter (obtener en https://openrouter.ai/)
OPENROUTER_API_KEY=tu_api_key_aqui

# URL de la aplicación (para desarrollo local)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Obtener API Key

1. Ve a [OpenRouter.ai](https://openrouter.ai/)
2. Crea una cuenta gratuita
3. Genera tu API key
4. Cópiala en el archivo `.env.local`

### 3. Instalar dependencias

```bash
npm install
# o
yarn install
# o
pnpm install
# o
bun install
```

### 4. Ejecutar el servidor de desarrollo

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver la aplicación.

## Solución de Problemas

### "API key no configurada"

- Verifica que `OPENROUTER_API_KEY` esté en tu archivo `.env.local`
- Asegúrate de que la API key sea válida

### "URL de la aplicación no configurada"

- Verifica que `NEXT_PUBLIC_APP_URL` esté en tu archivo `.env.local`
- Para desarrollo local usa: `http://localhost:3000`

### "API key inválida"

- Verifica que tu API key de OpenRouter sea correcta
- Revisa que tengas créditos disponibles en tu cuenta

### "Error de conexión"

- Verifica tu conexión a internet
- Asegúrate de que las variables de entorno estén configuradas correctamente

## Características

- 🧠 Interpretación psicológica de sueños
- 🎨 Interfaz moderna y responsive
- 🔒 Segura (no almacena datos personales)
- 🚀 Rápida y eficiente

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
