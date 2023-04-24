import * as jwt from 'jsonwebtoken';

export async function promisifyJwtSign(
  token: string,
  secretOrPublicKey: string,
  callback?: (
    err: jwt.VerifyErrors,
    decoded: string | jwt.JwtPayload,
    resolve: (value: unknown) => void
  ) => Promise<void>
): Promise<void> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, async (err, decoded) => {
      try {
        if (!callback) {
          return resolve();
        }

        await callback(err, decoded, resolve);
      } catch (err) {
        reject(err);
      }
    });
  });
}
