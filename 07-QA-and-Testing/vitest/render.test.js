import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const srcDir = path.resolve(__dirname, '../../04-Src/js');
const configCode = fs.readFileSync(path.join(srcDir, 'config.js'), 'utf-8');
const renderEntitiesCode = fs.readFileSync(path.join(srcDir, 'render_entities.js'), 'utf-8');

const script = `
  window.window = window;
  window.document = document;
  var navigator = window.navigator || {};
  
  document.body.innerHTML = "<canvas id='c'></canvas><canvas id='mm'></canvas><canvas id='pc'></canvas>";
  window.c = document.getElementById('c');
  window.mm = document.getElementById('mm');
  window.pc = document.getElementById('pc');
  window.api = window.api || {};
  window.api.mockCalls = { arc: 0, beginPath: 0, fill: 0 };
  const mockCtx = {
    save: () => {},
    restore: () => {},
    translate: () => {},
    rotate: () => {},
    scale: () => {},
    beginPath: () => { window.api.mockCalls.beginPath++; },
    arc: () => { window.api.mockCalls.arc++; },
    fill: () => { window.api.mockCalls.fill++; },
    stroke: () => {},
    moveTo: () => {},
    lineTo: () => {},
    quadraticCurveTo: () => {},
    ellipse: () => {},
    createRadialGradient: () => ({ addColorStop: () => {} }),
    createLinearGradient: () => ({ addColorStop: () => {} }),
    set shadowBlur(v) { 
       this._shadowBlur = v; 
       if (v > window.api.mockCalls.maxShadowBlur) window.api.mockCalls.maxShadowBlur = v; 
    },
    get shadowBlur() { return this._shadowBlur || 0; }
  };
  
  window.c.getContext = () => mockCtx;
  window.mm.getContext = () => mockCtx;
  window.pc.getContext = () => mockCtx;
  
  ${configCode}
  var ctx = mockCtx; // override ctx for render_entities.js
  ${renderEntitiesCode}
  
  window.api = window.api || {};
  window.api.renderViruses = (vL, vR, vT, vB) => renderViruses(vL, vR, vT, vB);
  window.api.renderOrg = (o) => renderOrg(o);
  Object.defineProperty(window.api, 'fc', { set: function(v) { fc = v; } });
  Object.defineProperty(window.api, 'dayLight', { set: function(v) { dayLight = v; } });
  Object.defineProperty(window.api, 'zoom', { set: function(v) { zoom = v; } });
  Object.defineProperty(window.api, 'state', { set: function(v) { state = v; } });
  Object.defineProperty(window.api, 'viruses', { set: function(v) { viruses = v; } });
  window.api.getViruses = () => viruses;
  Object.defineProperty(window.api, 'ctx', { get: function() { return ctx; } });
`;

eval(script);

describe('render_entities logic', () => {
  beforeEach(() => {
    window.api.mockCalls.beginPath = 0;
    window.api.mockCalls.fill = 0;
    window.api.mockCalls.arc = 0;
    window.api.mockCalls.maxShadowBlur = 0;
    
    window.api.fc = 0;
    window.api.dayLight = 1.0;
    window.api.zoom = 1;
    window.api.state = 'playing';
    window.api.viruses = [];
  });

  it('skips rendering viruses that are outside the camera viewport', () => {
    window.api.viruses = [
      { id: 1, x: 0, y: 0, angle: 0, wobble: 0 }, // Inside
      { id: 2, x: 100, y: 100, angle: 0, wobble: 0 }, // Inside
      { id: 3, x: -500, y: 0, angle: 0, wobble: 0 }, // Outside Left
      { id: 4, x: 500, y: 0, angle: 0, wobble: 0 }, // Outside Right
      { id: 5, x: 0, y: -500, angle: 0, wobble: 0 }, // Outside Top
      { id: 6, x: 0, y: 500, angle: 0, wobble: 0 }  // Outside Bottom
    ];
    
    // Verify it was set
    expect(window.api.getViruses().length).toBe(6);
    
    // Viewport bounds (-100, 100)
    window.api.renderViruses(-100, 100, -100, 100);
    
    // arc is called to draw the virus head
    expect(window.api.mockCalls.arc).toBe(2);
  });
  
  it('renders bioluminescent glow for producers at night', () => {
    window.api.ctx.shadowBlur = 0;
    window.api.fc = 0;
    window.api.dayLight = 0.2; // Night time
    
    const org = {
      x: 0, y: 0,
      size: 10,
      alive: true,
      pulse: 0,
      angle: 0,
      wobble: 0,
      energy: 50,
      sp: {
        cat: 'producer',
        color: '#00ff00',
        shape: 'circle',
        biolum: true,
        bio: {}
      }
    };
    
    window.api.renderOrg(org);
    
    expect(window.api.mockCalls.maxShadowBlur).toBeGreaterThan(0);
  });
});
