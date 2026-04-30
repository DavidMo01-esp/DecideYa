import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.resolve(scriptDirectory, '..');
const serverDirectory = path.join(rootDirectory, 'server');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const isWindows = process.platform === 'win32';
const shouldOpenBrowser = process.env.DECIDEYA_OPEN_BROWSER === '1';

const isServiceAvailable = async (url) => {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(1500),
    });
    return response.ok;
  } catch {
    return false;
  }
};

const clientAlreadyRunning = await isServiceAvailable('http://localhost:5173/');
const serverAlreadyRunning = await isServiceAvailable(
  'http://localhost:3001/health',
);

if (!serverAlreadyRunning) {
  const serverBuild = spawnSync(npmCommand, ['run', 'build'], {
    cwd: serverDirectory,
    env: process.env,
    shell: isWindows,
    stdio: 'inherit',
  });

  if (serverBuild.status !== 0) {
    process.exit(serverBuild.status ?? 1);
  }
}

const processDefinitions = [];

if (!clientAlreadyRunning) {
  processDefinitions.push({
    label: 'client',
    command: npmCommand,
    args: shouldOpenBrowser
      ? ['run', 'dev', '--', '--open']
      : ['run', 'dev'],
    cwd: rootDirectory,
    shell: isWindows,
  });
}

if (!serverAlreadyRunning) {
  processDefinitions.push({
    label: 'server',
    command: 'node',
    args: ['dist/index.js'],
    cwd: serverDirectory,
    shell: false,
  });
}

const children = [];
let isShuttingDown = false;

const stopChildren = () => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  }
};

for (const definition of processDefinitions) {
  const child = spawn(definition.command, definition.args, {
    cwd: definition.cwd,
    env: process.env,
    shell: definition.shell,
    stdio: 'inherit',
  });

  children.push(child);

  child.on('exit', (code) => {
    if (!isShuttingDown && code !== 0) {
      console.error(
        `[${definition.label}] termino con codigo ${code ?? 'desconocido'}.`,
      );
    }

    stopChildren();

    if (!isShuttingDown || code === 0) {
      return;
    }

    process.exit(code ?? 1);
  });
}

process.on('SIGINT', () => {
  stopChildren();
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopChildren();
  process.exit(0);
});

console.log('Iniciando DecideYa...');
console.log(
  clientAlreadyRunning
    ? 'Frontend ya estaba activo en http://localhost:5173/.'
    : 'Frontend: http://localhost:5173/ (o el siguiente puerto libre)',
);
if (!clientAlreadyRunning && !shouldOpenBrowser) {
  console.log(
    'El navegador no se abrira automaticamente. Usa DECIDEYA_OPEN_BROWSER=1 si quieres activarlo.',
  );
}
console.log(
  serverAlreadyRunning
    ? 'Backend ya estaba activo en http://localhost:3001/health.'
    : 'Backend: http://localhost:3001/health',
);

if (processDefinitions.length === 0) {
  console.log('No habia nada mas que iniciar.');
}
