import { APIRequestContext, expect } from '@playwright/test';

export async function graphqlRequest<T>(
  requestContext: APIRequestContext,
  query: string,
  variables: Record<string, unknown>
): Promise<T> {
  const response = await requestContext.post('', {
    data: { query, variables },
  });

  expect(response.ok()).toBeTruthy();

  const body = await response.json();

  if (body.errors) {
    throw new Error(JSON.stringify(body.errors, null, 2));
  }

  return body.data as T;
}
