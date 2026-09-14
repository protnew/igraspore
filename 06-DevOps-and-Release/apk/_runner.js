
const { spawn } = require('child_process');
const child = spawn('bubblewrap', ['update', '--skipVersionCheck'], {
  cwd: process.argv[2],
  env: { ...process.env, JAVA_HOME: 'C:\\Program Files\\Java\\jdk-24' },
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true
});

child.stdout.on('data', d => {
  const s = d.toString();
  process.stdout.write(s);
  // Answer prompts
  if (s.includes('JDK')) {
    setTimeout(() => {
      child.stdin.write('n\n');
      setTimeout(() => {
        child.stdin.write('C:\\Program Files\\Java\\jdk-24\n');
      }, 500);
    }, 500);
  }
});

child.stderr.on('data', d => process.stderr.write(d));
child.on('close', code => process.exit(code));
