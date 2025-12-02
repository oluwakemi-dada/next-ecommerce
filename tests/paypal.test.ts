import { generateAccessToken } from '../lib/paypal';

// Test to generate access token from paypal
test('generate a token from paypal', async () => {
  const tokenResponse = await generateAccessToken();

  expect(typeof tokenResponse).toBe('string');
  expect(tokenResponse.length).toBeGreaterThan(0);
});
