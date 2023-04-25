import axios from 'axios';

type LoginUserResponse = {
  cookies: string[];
};

/**
 * Login and return jwt tokens in http only cookies
 */
export async function loginUser(
  apiDomain: string,
  authUserData: { email: string; password: string }
): Promise<LoginUserResponse> {
  const authRequestUrl = `${apiDomain}/auth/login`;

  const result = await axios.post(authRequestUrl, authUserData, {
    headers: {
      'Content-Type': 'application/json'
    },
    validateStatus: status => status === 200
  });
  return { cookies: result.headers['set-cookie'] };
}

export function createRequestCookieHeaders(cookies: string[]) {
  return {
    headers: {
      Cookie: cookies
    }
  };
}
