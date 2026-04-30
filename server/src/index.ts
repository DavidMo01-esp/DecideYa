import app from './app';

const PORT = Number(process.env.PORT ?? 3001);
const HOST = process.env.DECIDEYA_SERVER_HOST ?? '0.0.0.0';
const displayHost = HOST === '0.0.0.0' ? 'localhost' : HOST;

app.listen(PORT, HOST, () => {
  console.log(`Backend listo en http://${displayHost}:${PORT}`);
});
