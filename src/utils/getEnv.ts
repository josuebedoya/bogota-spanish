import { getSecret } from 'astro:env/server';

const getEnv = async (key: string, defaultValue: string = ''): Promise<string> => {
  const value = getSecret(key);
  return value ?? defaultValue;
};

export default getEnv;