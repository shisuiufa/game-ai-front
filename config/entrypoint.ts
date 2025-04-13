export const useApiPath = () => {
  const config = useRuntimeConfig();
  return config.public?.apiPath || 'http://localhost';
};

export const useWsPath = () => {
  const config = useRuntimeConfig();
  return config.public?.wsPath || 'ws://localhost:3001';
}
