import { spawn } from 'child_process';

console.log('🚀 Launching LIFE RPG Ecosystem (Backend API + Frontend App)...');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';
const npxCmd = isWin ? 'npx.cmd' : 'npx';

// 1. Start Express Backend
const serverProc = spawn(npxCmd, ['tsx', 'watch', 'server/index.ts'], {
  stdio: 'inherit',
  shell: isWin,
});
serverProc.on('error', (err) => console.error('serverProc error:', err));
serverProc.on('exit', (code) => console.log('serverProc exited with code:', code));

// 2. Start Vite Frontend Dev Server
const viteProc = spawn(npmCmd, ['run', 'dev:frontend'], {
  stdio: 'inherit',
  shell: isWin,
});
viteProc.on('error', (err) => console.error('viteProc error:', err));
viteProc.on('exit', (code) => console.log('viteProc exited with code:', code));

const cleanup = () => {
  console.log('\n🛑 Shutting down LIFE RPG servers...');
  serverProc.kill();
  viteProc.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
