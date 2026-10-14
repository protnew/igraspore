export function mdToHtml(md) {
  const lines = String(md || '').replace(/\r\n/g, '\n').split('\n');
  let html = '';
  let inCode = false;
  let inTable = false;
  let inList = false;
  const close = () => {
    if (inTable) { html += '</tbody></table>'; inTable = false; }
    if (inList) { html += '</ul>'; inList = false; }
  };
  for (const raw of lines) {
    const line = raw;
    if (line.startsWith('```')) {
      close();
      html += inCode ? '</code></pre>' : '<pre><code>';
      inCode = !inCode;
      continue;
    }
    if (inCode) { html += esc(line) + '\n'; continue; }
    if (line.startsWith('|') && line.endsWith('|')) {
      if (/^\|\s*-+/.test(line)) continue;
      if (!inTable) { close(); html += '<table><tbody>'; inTable = true; }
      const cells = line.slice(1, -1).split('|').map((c) => '<td>' + inline(c.trim()) + '</td>').join('');
      html += '<tr>' + cells + '</tr>';
      continue;
    }
    close();
    if (!line.trim()) { html += ''; continue; }
    if (line.startsWith('# ')) html += '<h1>' + inline(line.slice(2)) + '</h1>';
    else if (line.startsWith('## ')) html += '<h2>' + inline(line.slice(3)) + '</h2>';
    else if (line.startsWith('### ')) html += '<h3>' + inline(line.slice(4)) + '</h3>';
    else if (line.startsWith('- ')) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += '<li>' + inline(line.slice(2)) + '</li>';
    } else html += '<p>' + inline(line) + '</p>';
  }
  close();
  if (inCode) html += '</code></pre>';
  return html;
}
function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function inline(s) {
  return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}
