export const cookiesExtractor: (req) => string | null = req => {
  return req?.cookies?.accessToken ?? null;
};
