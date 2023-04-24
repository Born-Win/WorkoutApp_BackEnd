export function createRequestCookieHeaders(cookies: string[]) {
  return {
    headers: {
      Cookie: cookies
    }
  };
}
