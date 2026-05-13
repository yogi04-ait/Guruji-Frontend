import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',

  timeout: 60_000,

  expect: {
    timeout: 5_000,
  },

  
  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  retries: 0,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
  ],

  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    actionTimeout: 10_000,
    viewport: {
      width: 1280,
      height: 800,
    },
  },

  webServer: {
    command: 'npm run dev -- --port 8080',
    port: 8080,
    reuseExistingServer: true,
    timeout: 120_000,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});