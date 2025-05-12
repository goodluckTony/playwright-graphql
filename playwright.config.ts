import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  use: {
    baseURL: process.env.API_URL,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.AUTHORIZATION_TOKEN}`,
    },
  },
});
