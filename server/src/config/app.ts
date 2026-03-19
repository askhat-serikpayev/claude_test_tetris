export const APP_CONFIG = {
  port: parseInt(process.env['PORT'] ?? '3001', 10),
  corsOrigin: process.env['CORS_ORIGIN'] ?? 'http://localhost:5173',
  leaderboardLimit: 10,
} as const;
