import { spawn } from 'child_process';

console.log('🚀 Launching LIFE RPG Ecosystem (Backend API + Frontend App)...');

const isWin = process.platform === 'win32';
const npxCmd = isWin ? 'npx.cmd' : 'npx';

// 1. Start Express Backend
const serverProc = spawn(npxCmd, ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  shell: isWin,
});

// 2. Start Vite Frontend Dev Server
const viteProc = spawn(npxCmd, ['vite', '--port=3000', '--host=0.0.0.0'], {
  stdio: 'inherit',
  shell: isWin,
});

const cleanup = () => {
  console.log('\n🛑 Shutting down LIFE RPG servers...');
  serverProc.kill();
  viteProc.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
