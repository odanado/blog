export type Config = {
  port: number;
  host: string;
  origin: string;
}

export function getConfig (): Config {
  const port = Number.parseInt(process.env.port || '3000');
  const host = process.env.host || 'localhost';
  const origin = process.env.origin || `http://${host}:${port}`;
  return {
    port,
    host,
    origin
  };
}
