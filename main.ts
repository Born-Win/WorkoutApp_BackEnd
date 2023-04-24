import { App } from './src/app/app';

async function start() {
  const PORT = process.env.PORT || 3000;
  const app = await App.createApp();
  await app.listen(PORT);
  console.log(`Server started on port: ${PORT}`);
}

start();
