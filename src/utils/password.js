// @flow

export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return 'password.invalid.short_password';
  }
  return null;
}
