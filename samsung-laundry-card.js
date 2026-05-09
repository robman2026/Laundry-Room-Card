/**
 * Laundry Card
 * Appliance-style front panel for washer + dryer — any brand
 * Author: robman2026
 * GitHub: https://github.com/robman2026/laundry-card
 * Version: 1.0.0
 * License: MIT
 */

const LC_VERSION = '1.0.0';

const LitElement = Object.getPrototypeOf(customElements.get('ha-panel-lovelace'));
const { html, css } = LitElement.prototype;

// ─── State normaliser ────────────────────────────────────────────────────────
const RUN_STATES  = ['run','running','active','on','washing','drying','inuse','in_use'];
const PAUSE_STATES = ['pause','paused','holding'];
const DONE_STATES  = ['end','done','finished','complete','completed','ready','idle_end'];

function normaliseState(raw) {
  if (!raw) return 'stopped';
  const s = String(raw).toLowerCase().replace(/[\s-]/g,'_');
  if (RUN_STATES.some(r => s.includes(r)))   return 'running';
  if (PAUSE_STATES.some(r => s.includes(r))) return 'paused';
  if (DONE_STATES.some(r => s.includes(r)))  return 'done';
  return 'stopped';
}

function stateVal(hass, entityId) {
  if (!hass || !entityId) return null;
  const s = hass.states[entityId];
  return s ? s.state : null;
}

function attr(hass, entityId, attrName) {
  if (!hass || !entityId) return null;
  const s = hass.states[entityId];
  return s && s.attributes ? s.attributes[attrName] : null;
}

function friendlyVal(hass, entityId) {
  const v = stateVal(hass, entityId);
  if (v === null || v === 'unavailable' || v === 'unknown') return '—';
  return v;
}

// ─── Logo URLs ───────────────────────────────────────────────────────────────
const LOGO_URLS = {
  samsung: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Samsung_wordmark.svg',
  lg:      'https://upload.wikimedia.org/wikipedia/commons/8/8d/LG_logo_%282014%29.svg',
  bosch:   'https://upload.wikimedia.org/wikipedia/commons/1/16/Bosch-logo.svg',
  siemens: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Siemens-logo.svg',
  miele:   'https://upload.wikimedia.org/wikipedia/commons/2/25/Miele_logo.svg',
  generic: null,
};

const LOGO_DIMS = {
  samsung: {h:11, maxw:72},
  lg:      {h:20, maxw:56},
  bosch:   {h:14, maxw:56},
  siemens: {h:11, maxw:64},
  miele:   {h:14, maxw:52},
  generic: null,
};

function logoImg(brand) {
  const url = LOGO_URLS[brand];
  if (!url) return html`<span style="font-size:9px;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.45);font-weight:600;">${brand}</span>`;
  const d = LOGO_DIMS[brand] || {h:12, maxw:60};
  const filter = (brand === 'lg') ? '' : (brand === 'miele') ? 'filter:brightness(10);' : 'filter:brightness(0) invert(1);';
  const opacity = (brand === 'lg') ? '0.85' : '0.65';
  return html`<img src="${url}" alt="${brand}"
    style="height:${d.h}px;width:auto;max-width:${d.maxw}px;display:block;object-fit:contain;${filter}opacity:${opacity};"
    @error=${(e) => { e.target.style.display='none'; }}/>`;
}

// ─── Foot panel SVGs ─────────────────────────────────────────────────────────
function footSVG(brand, type) {
  const W=300, H=72, isW=(type==='washer');
  if (brand === 'samsung' || brand === 'generic') {
    const bg='#e8e8e8', pan='#f2f2f2', bdr='rgba(0,0,0,.09)';
    return isW
      ? `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><rect width="${W}" height="${H}" fill="${bg}"/><rect x="88" y="12" width="124" height="48" rx="7" fill="${pan}" stroke="${bdr}" stroke-width="1"/><line x1="0" y1="0.5" x2="${W}" y2="0.5" stroke="rgba(0,0,0,.1)" stroke-width="1"/></svg>`
      : `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><rect width="${W}" height="${H}" fill="${bg}"/><rect x="10" y="10" width="162" height="52" rx="6" fill="${pan}" stroke="${bdr}" stroke-width="1"/><rect x="184" y="10" width="106" height="52" rx="6" fill="${pan}" stroke="${bdr}" stroke-width="1"/>${[18,26,34,42,50,58].map(y=>`<line x1="192" y1="${y}" x2="282" y2="${y}" stroke="rgba(0,0,0,.11)" stroke-width="1.5" stroke-linecap="round"/>`).join('')}<line x1="0" y1="0.5" x2="${W}" y2="0.5" stroke="rgba(0,0,0,.1)" stroke-width="1"/></svg>`;
  }
  if (brand === 'lg') {
    const bg='#1a1a1a', pan='#222', bdr='rgba(255,255,255,.07)';
    return isW
      ? `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><rect width="${W}" height="${H}" fill="${bg}"/><rect x="20" y="14" width="108" height="44" rx="6" fill="${pan}" stroke="${bdr}" stroke-width="1"/><rect x="60" y="33" width="28" height="5" rx="2.5" fill="rgba(255,255,255,.07)"/></svg>`
      : `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><rect width="${W}" height="${H}" fill="${bg}"/><rect x="172" y="14" width="108" height="44" rx="6" fill="${pan}" stroke="${bdr}" stroke-width="1"/><rect x="212" y="33" width="28" height="5" rx="2.5" fill="rgba(255,255,255,.07)"/></svg>`;
  }
  if (brand === 'bosch' || brand === 'siemens') {
    const bg='#e8e8e8', pan='#f0f0f0', bdr='rgba(0,0,0,.09)';
    if (isW) {
      return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><rect width="${W}" height="${H}" fill="${bg}"/><rect x="10" y="10" width="130" height="52" rx="5" fill="${pan}" stroke="${bdr}" stroke-width="1"/><rect x="152" y="10" width="138" height="52" rx="5" fill="${pan}" stroke="${bdr}" stroke-width="1"/><circle cx="221" cy="36" r="18" fill="${bg}" stroke="${bdr}" stroke-width="1"/><circle cx="221" cy="36" r="5" fill="${pan}" stroke="${bdr}" stroke-width="1"/></svg>`;
    } else {
      const cx=248, cy=36; const dots=[];
      for(let r=6;r<=20;r+=5){const steps=Math.max(6,Math.round(2*Math.PI*r/7));for(let i=0;i<steps;i++){const a=i*2*Math.PI/steps;dots.push(`<circle cx="${(cx+r*Math.cos(a)).toFixed(1)}" cy="${(cy+r*Math.sin(a)).toFixed(1)}" r="1.8" fill="${bdr}"/>`);}}
      return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><rect width="${W}" height="${H}" fill="${bg}"/><rect x="10" y="10" width="204" height="52" rx="5" fill="${pan}" stroke="${bdr}" stroke-width="1"/><circle cx="${cx}" cy="${cy}" r="28" fill="${pan}" stroke="${bdr}" stroke-width="1"/>${dots.join('')}</svg>`;
    }
  }
  if (brand === 'miele') {
    const bg='#e4e4e0', pan='#efefeb', bdr='rgba(0,0,0,.08)';
    return isW
      ? `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><rect width="${W}" height="${H}" fill="${bg}"/><rect x="10" y="10" width="130" height="52" rx="5" fill="${pan}" stroke="${bdr}" stroke-width="1"/><circle cx="74" cy="36" r="5" fill="rgba(0,0,0,.1)" stroke="${bdr}" stroke-width="1"/><rect x="152" y="10" width="138" height="52" rx="5" fill="${pan}" stroke="${bdr}" stroke-width="1"/><circle cx="220" cy="36" r="5" fill="rgba(0,0,0,.1)" stroke="${bdr}" stroke-width="1"/></svg>`
      : `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><rect width="${W}" height="${H}" fill="${bg}"/><rect x="10" y="8" width="162" height="56" rx="5" fill="${pan}" stroke="${bdr}" stroke-width="1"/><rect x="180" y="8" width="108" height="56" rx="5" fill="${pan}" stroke="${bdr}" stroke-width="1"/>${[15,22,29,36,43,50,57].map(y=>`<line x1="190" y1="${y}" x2="282" y2="${y}" stroke="${bdr}" stroke-width="2" stroke-linecap="round"/>`).join('')}</svg>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#ddd"/></svg>`;
}

// ─── SVG drum parts — kept for reference, rendered inline in LitElement html ─

// ════════════════════════════════════════════════════════════════════════════
// Main Card
// ════════════════════════════════════════════════════════════════════════════
class LaundryCard extends LitElement {

  static get properties() {
    return { hass: {}, _config: {} };
  }

  static getConfigElement() {
    return document.createElement('laundry-card-editor');
  }

  static getStubConfig() {
    return {
      brand: 'samsung',
      show_washer: true,
      show_dryer:  true,
      washer: {
        machine_state: '',
        completion_time: '',
        current_program: '',
        stats: [
          { label: 'Temp',   entity: '' },
          { label: 'Spin',   entity: '' },
          { label: 'Power',  entity: '' },
          { label: 'Energy', entity: '' },
          { label: 'Water',  entity: '' },
          { label: 'Job',    entity: '' },
        ],
      },
      dryer: {
        machine_state: '',
        completion_time: '',
        current_program: '',
        stats: [
          { label: 'Energy',    entity: '' },
          { label: 'Power',     entity: '' },
          { label: 'Job',       entity: '' },
          { label: 'Dry Level', entity: '' },
          { label: 'Remain',    entity: '' },
          { label: 'Remote',    entity: '' },
        ],
      },
    };
  }

  setConfig(config) {
    if (!config) throw new Error('laundry-card: no config');
    this._config = {
      brand:       'samsung',
      show_washer: true,
      show_dryer:  true,
      ...config,
      washer: { stats: [], ...(config.washer || {}) },
      dryer:  { stats: [], ...(config.dryer  || {}) },
    };
    // Ensure 6 stat slots always exist
    while (this._config.washer.stats.length < 6) this._config.washer.stats.push({ label:'', entity:'' });
    while (this._config.dryer.stats.length  < 6) this._config.dryer.stats.push({  label:'', entity:'' });
  }

  getCardSize() { return 6; }

  _fireMoreInfo(entityId) {
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent('hass-more-info', {
      bubbles: true, composed: true, detail: { entityId },
    }));
  }

  // ── Derive display state ───────────────────────────────────────────────────
  _machineData(cfg, side) {
    const mc = cfg[side] || {};
    const rawState  = stateVal(this.hass, mc.machine_state);
    const normState = normaliseState(rawState);
    const program   = friendlyVal(this.hass, mc.current_program);
    const compTime  = friendlyVal(this.hass, mc.completion_time);
    const lastChanged = mc.machine_state && this.hass?.states[mc.machine_state]?.last_changed;

    let timeText = '—';
    if (normState === 'running' || normState === 'paused') {
      timeText = compTime !== '—' ? 'done ' + compTime : '—';
    } else if (normState === 'done' || normState === 'stopped') {
      if (lastChanged) {
        const d = new Date(lastChanged);
        const dateStr = d.toLocaleDateString('de-CH', { day:'2-digit', month:'short', year:'numeric' });
        const timeStr = d.toLocaleTimeString('de-CH', { hour:'2-digit', minute:'2-digit' });
        timeText = `Last run · ${dateStr} ${timeStr}`;
      }
    }
    return { normState, program, timeText };
  }

  // ── Render one machine panel ───────────────────────────────────────────────
  _renderMachine(side) {
    const cfg   = this._config;
    const mc    = cfg[side] || {};
    const brand = cfg.brand || 'samsung';
    const isW   = (side === 'washer');
    const { normState, program, timeText } = this._machineData(cfg, side);

    // Colors per state
    const COLOR = { running: isW ? '#4fa3e0' : '#e07c4f', paused: '#e0b44f', done: '#3cbe64', stopped: '#888' };
    const arcColor = COLOR[normState] || '#888';

    // Progress arc offset: 540 = full circumference (r=86)
    const arcOffset = normState === 'running' ? 162 : normState === 'paused' ? 162 : normState === 'done' ? 0 : 540;
    const progW     = normState === 'running' ? 70  : normState === 'paused' ? 70  : normState === 'done' ? 100 : 0;

    // LCD state text
    const LCD_TXT = { running: isW ? 'Running' : 'Drying', paused: 'Paused', done: 'Done ✓', stopped: 'Stopped' };
    const lcdTxt  = LCD_TXT[normState] || 'Stopped';

    // LCD dot class
    const DOT_CLS = { running: isW ? 'lv-wr' : 'lv-dr', paused: 'lv-off', done: 'lv-done', stopped: 'lv-off' };
    const dotCls  = DOT_CLS[normState] || 'lv-off';

    // LCD text color class
    const LCD_CLS = { running: isW ? 'lcd-r' : 'lcd-d', paused: 'lcd-p', done: 'lcd-e', stopped: 'lcd-s' };
    const lcdCls  = LCD_CLS[normState] || 'lcd-s';

    // Glow active
    const glowActive = normState === 'running';
    const bgGlowOpacity = glowActive ? 0.12 : 0;
    const glowCls = isW ? (glowActive ? 'ph-glow gw-on' : 'ph-glow') : (glowActive ? 'ph-glow gd-on' : 'ph-glow');

    // Drum spin
    const spinStyle = normState === 'running' ? `animation:${isW?'spin 3s':'spin 4s'} linear infinite;` :
                      normState === 'paused'  ? `animation:${isW?'spin-sl 8s':'spin-sl 10s'} linear infinite;` : '';

    // Washer: bubbles + water shimmer
    const showBub  = normState === 'running';
    const showWS   = normState === 'running' || normState === 'paused';
    // Dryer: heat
    const showHeat = normState === 'running';

    // Stats
    const stats = (mc.stats || []).slice(0, 6);

    const themeMap = { samsung:'t-sam', lg:'t-lg', bosch:'t-bsh', siemens:'t-bsh', miele:'t-miele', generic:'t-sam' };
    const themeCls = themeMap[brand] || 't-sam';

    return html`
      <div class="mc ${themeCls}">

        <!-- PANEL: 3-col grid: logo | knob | lcd -->
        <div class="mc-panel">
          <div class="mc-logo-cell">${logoImg(brand)}</div>
          <div class="mc-knob"></div>
          <div class="mc-lcd-cell">
            <div class="mc-lcd">
              <div class="mc-lcd-dot ${dotCls}"></div>
              <span class="mc-lcd-txt ${lcdCls}">${lcdTxt}</span>
            </div>
          </div>
        </div>

        <!-- BODY -->
        <div class="mc-body">
          <div class="mc-bg-glow" style="background:${isW?'#4fa3e0':'#e07c4f'};animation:bglow 3s ease-in-out infinite${isW?'':' .5s'};opacity:${bgGlowOpacity};"></div>

          <!-- Porthole -->
          <div class="ph">
            <svg style="position:absolute;inset:0;width:var(--ph);height:var(--ph);pointer-events:none;z-index:5;" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="86" fill="none" stroke="rgba(255,255,255,.04)" stroke-width="3.5"/>
              <circle cx="90" cy="90" r="86" fill="none"
                stroke="${arcColor}" stroke-width="3.5" stroke-linecap="round"
                stroke-dasharray="540" stroke-dashoffset="${arcOffset}"
                transform="rotate(-90 90 90)"
                style="transition:stroke-dashoffset 1.4s ease,stroke .6s ease;"/>
            </svg>
            <div class="ph-chrome"></div>
            <div class="ph-rubber"></div>
            <div class="ph-win">
              ${isW ? html`
                <div class="drum-w">
                  <div class="wshim" style="${showWS ? 'animation:wshim 2s ease-in-out infinite;' : 'display:none;'}"></div>
                  <div style="position:absolute;inset:0;border-radius:50%;overflow:hidden;${showBub ? '' : 'display:none;'}">
                    <div class="bub" style="width:10px;height:10px;bottom:10px;left:16px;animation:bub-rise 3.2s ease-in infinite;"></div>
                    <div class="bub" style="width:7px;height:7px;bottom:7px;left:38px;animation:bub-rise 2.8s ease-in infinite .6s;"></div>
                    <div class="bub" style="width:12px;height:12px;bottom:11px;left:58px;animation:bub-rise 3.6s ease-in infinite 1.1s;"></div>
                    <div class="bub" style="width:8px;height:8px;bottom:9px;left:82px;animation:bub-rise 3.9s ease-in infinite .3s;"></div>
                  </div>
                  <div class="drum-w-bowl" style="${spinStyle}">
                    <svg width="100%" height="100%" viewBox="0 0 58 58">
                      <circle cx="29" cy="29" r="27" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="1"/>
                      <path d="M29 29L29 5" stroke="rgba(170,205,255,.3)" stroke-width="4.5" stroke-linecap="round"/>
                      <path d="M29 29L8 42" stroke="rgba(170,205,255,.3)" stroke-width="4.5" stroke-linecap="round"/>
                      <path d="M29 29L50 42" stroke="rgba(170,205,255,.3)" stroke-width="4.5" stroke-linecap="round"/>
                      <circle cx="29" cy="29" r="6" fill="rgba(110,145,200,.3)" stroke="rgba(255,255,255,.1)" stroke-width="1"/>
                      <circle cx="29" cy="29" r="2.5" fill="rgba(170,205,255,.2)"/>
                    </svg>
                  </div>
                </div>
              ` : html`
                <div class="drum-d">
                  <div class="hglow" style="opacity:${showHeat?1:0};animation:${showHeat?'hpulse 1.8s ease-in-out infinite':'none'};"></div>
                  <div style="position:absolute;bottom:8%;left:50%;transform:translateX(-50%);display:${showHeat?'flex':'none'};gap:3px;">
                    <div class="hwave" style="height:10px;animation:hwave 1.1s ease-in-out infinite;"></div>
                    <div class="hwave" style="height:14px;animation:hwave 1.4s ease-in-out infinite .2s;"></div>
                    <div class="hwave" style="height:11px;animation:hwave 0.9s ease-in-out infinite .4s;"></div>
                    <div class="hwave" style="height:13px;animation:hwave 1.3s ease-in-out infinite .1s;"></div>
                    <div class="hwave" style="height:10px;animation:hwave 1.0s ease-in-out infinite .3s;"></div>
                  </div>
                  <div class="drum-d-inner" style="${spinStyle}">
                    <svg width="100%" height="100%" viewBox="0 0 72 72">
                      <ellipse cx="36" cy="11" rx="14" ry="10" fill="rgba(100,100,100,.4)" stroke="rgba(255,255,255,.06)" stroke-width="1"/>
                      <ellipse cx="15" cy="48" rx="14" ry="10" fill="rgba(100,100,100,.4)" stroke="rgba(255,255,255,.06)" stroke-width="1"/>
                      <ellipse cx="57" cy="48" rx="14" ry="10" fill="rgba(100,100,100,.4)" stroke="rgba(255,255,255,.06)" stroke-width="1"/>
                      <line x1="36" y1="36" x2="36" y2="14" stroke="rgba(210,210,210,.68)" stroke-width="4" stroke-linecap="round"/>
                      <line x1="36" y1="36" x2="17" y2="50" stroke="rgba(210,210,210,.68)" stroke-width="4" stroke-linecap="round"/>
                      <line x1="36" y1="36" x2="55" y2="50" stroke="rgba(210,210,210,.68)" stroke-width="4" stroke-linecap="round"/>
                      <circle cx="36" cy="36" r="7.5" fill="rgba(165,165,165,.5)" stroke="rgba(255,255,255,.22)" stroke-width="1.5"/>
                      <circle cx="36" cy="36" r="3" fill="rgba(220,220,220,.36)"/>
                      <circle cx="36" cy="28.5" r="1.4" fill="rgba(255,255,255,.22)"/>
                      <circle cx="42.5" cy="41" r="1.4" fill="rgba(255,255,255,.22)"/>
                      <circle cx="29.5" cy="41" r="1.4" fill="rgba(255,255,255,.22)"/>
                    </svg>
                  </div>
                </div>
              `}
            </div>
            <div class="${glowCls}"></div>
          </div>
        </div>

        <!-- INFO -->
        <div class="mc-info">
          <div class="mc-prog-wrap">
            <div class="mc-prog" style="width:${progW}%;background:${arcColor};"></div>
          </div>
          <div class="mc-cy" @click=${() => this._fireMoreInfo(mc.machine_state)}>
            ${program !== '—' ? program : (normState === 'running' || normState === 'paused') ? '…' : '—'}
          </div>
          <div class="mc-tm">${timeText}</div>
          <div class="mc-sg">
            ${stats.slice(0,3).map(s => html`
              <div class="mc-st" @click=${() => this._fireMoreInfo(s.entity)}>
                <span class="mc-sv">${s.entity ? friendlyVal(this.hass, s.entity) : '—'}</span>
                <span class="mc-sl">${s.label || ''}</span>
              </div>`)}
          </div>
          <div class="mc-sg">
            ${stats.slice(3,6).map(s => html`
              <div class="mc-st" @click=${() => this._fireMoreInfo(s.entity)}>
                <span class="mc-sv">${s.entity ? friendlyVal(this.hass, s.entity) : '—'}</span>
                <span class="mc-sl">${s.label || ''}</span>
              </div>`)}
          </div>
        </div>

        <!-- FOOT -->
        <div class="mc-foot" .innerHTML="${footSVG(brand, side)}"></div>
      </div>`;
  }

  render() {
    if (!this._config) return html``;
    const cfg = this._config;
    const showW = cfg.show_washer !== false;
    const showD = cfg.show_dryer  !== false;
    return html`
      <div class="lc-root">
        ${showW ? this._renderMachine('washer') : ''}
        ${showD ? this._renderMachine('dryer')  : ''}
      </div>`;
  }

  static get styles() {
    return css`
:host{display:block;}
.lc-root{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:stretch;}
@media(max-width:480px){.lc-root{grid-template-columns:1fr;}}

/* ── Card ── */
.mc{display:flex;flex-direction:column;border-radius:18px;overflow:hidden;box-shadow:0 8px 36px rgba(0,0,0,.7);}

/* ── Panel ── */
.mc-panel{height:54px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 12px;gap:8px;flex-shrink:0;}
.mc-logo-cell{display:flex;align-items:center;justify-content:flex-start;overflow:visible;min-width:0;}
.mc-knob{width:32px;height:32px;border-radius:50%;box-shadow:0 3px 8px rgba(0,0,0,.9),inset 0 1px 0 rgba(255,255,255,.2),0 0 0 1.5px rgba(0,0,0,.5);}
.mc-lcd-cell{display:flex;align-items:center;justify-content:flex-end;}
.mc-lcd{display:flex;align-items:center;gap:5px;border-radius:5px;padding:5px 10px 5px 8px;background:#040608;border:1px solid rgba(255,255,255,.12);min-width:82px;}
.mc-lcd-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;transition:all .4s;}
.mc-lcd-txt{font-family:'DM Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.06em;transition:color .4s;white-space:nowrap;}

/* ── Body ── */
.mc-body{padding:16px 14px 10px;display:flex;flex-direction:column;align-items:center;position:relative;overflow:hidden;flex:1;}
.mc-bg-glow{position:absolute;width:190px;height:190px;border-radius:50%;top:-60px;left:50%;transform:translateX(-50%);pointer-events:none;filter:blur(48px);transition:opacity .8s;}

/* ── Porthole ── */
.ph{--ph:180px;--ph-r-t:5px;--ph-w-t:33px;--ph-w-s:114px;position:relative;width:var(--ph);height:var(--ph);flex-shrink:0;}
@media(max-width:480px){.ph{--ph:158px;--ph-r-t:4px;--ph-w-t:28px;--ph-w-s:102px;}}
.ph-chrome{position:absolute;top:0;left:0;width:var(--ph);height:var(--ph);border-radius:50%;background:conic-gradient(from 0deg,#666,#ccc,#eee,#bbb,#888,#ddd,#eee,#aaa,#666);box-shadow:0 3px 12px rgba(0,0,0,.3);z-index:1;}
.ph-rubber{position:absolute;top:var(--ph-r-t);left:var(--ph-r-t);width:calc(var(--ph) - var(--ph-r-t)*2);height:calc(var(--ph) - var(--ph-r-t)*2);border-radius:50%;background:radial-gradient(circle at 30% 26%,#282828 0%,#060606 55%,#000 100%);box-shadow:inset 0 7px 22px rgba(0,0,0,1);z-index:2;}
.ph-win{position:absolute;top:var(--ph-w-t);left:var(--ph-w-t);width:var(--ph-w-s);height:var(--ph-w-s);border-radius:50%;overflow:hidden;z-index:3;}
.ph-glow{position:absolute;top:var(--ph-w-t);left:var(--ph-w-t);width:var(--ph-w-s);height:var(--ph-w-s);border-radius:50%;pointer-events:none;z-index:6;opacity:0;transition:opacity .6s;}
.gw-on{opacity:1;animation:pglow-w 2.2s ease-in-out infinite;}
.gd-on{opacity:1;animation:pglow-d 2.4s ease-in-out infinite .3s;}

/* ── Drums ── */
.drum-w{width:100%;height:100%;border-radius:50%;background:radial-gradient(circle at 38% 32%,rgba(48,78,148,.38),rgba(10,18,58,.78) 48%,rgba(2,4,16,.92) 100%);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
.drum-w::before{content:'';position:absolute;width:70px;height:31px;border-radius:50%;background:radial-gradient(ellipse,rgba(255,255,255,.09),transparent 70%);top:13px;left:14px;transform:rotate(-20deg);}
.drum-w::after{content:'';position:absolute;inset:0;border-radius:50%;box-shadow:inset 0 0 0 2px rgba(255,255,255,.06),inset 0 4px 14px rgba(0,0,0,.5);}
.drum-w-bowl{width:72%;height:72%;border-radius:50%;background:radial-gradient(circle at 38% 32%,rgba(100,130,195,.1),rgba(22,40,115,.06) 50%,rgba(3,6,28,.2) 100%);border:1.5px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:center;position:relative;z-index:2;}
.drum-d{width:100%;height:100%;border-radius:50%;background:radial-gradient(circle at 38% 32%,#484848,#1e1e1e 45%,#0c0c0c 100%);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
.drum-d::before{content:'';position:absolute;inset:0;border-radius:50%;background-image:radial-gradient(circle,rgba(0,0,0,.65) 1.8px,transparent 1.8px);background-size:9px 9px;opacity:.65;}
.drum-d::after{content:'';position:absolute;inset:0;border-radius:50%;background:radial-gradient(ellipse at 36% 30%,rgba(255,255,255,.08),transparent 55%);}
.drum-d-inner{width:68%;height:68%;border-radius:50%;display:flex;align-items:center;justify-content:center;position:relative;z-index:2;}
.hglow{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 50% 70%,rgba(255,90,0,.32),rgba(200,40,0,.1) 50%,transparent 70%);opacity:0;}
.hwave{width:3px;border-radius:2px;background:rgba(255,130,0,.65);}
.bub{position:absolute;border-radius:50%;background:radial-gradient(circle at 35% 30%,rgba(140,190,255,.7),rgba(60,120,220,.3));border:1px solid rgba(140,190,255,.4);opacity:0;}
.wshim{position:absolute;bottom:0;left:0;right:0;height:36%;border-radius:0 0 57px 57px;background:linear-gradient(180deg,transparent,rgba(50,110,200,.18));pointer-events:none;}

@keyframes spin{to{transform:rotate(360deg);}}
@keyframes spin-sl{to{transform:rotate(360deg);}}
@keyframes bub-rise{0%{transform:translateY(0) scale(.4);opacity:0;}20%{opacity:.8;}80%{opacity:.6;}100%{transform:translateY(-90px) scale(1.2);opacity:0;}}
@keyframes wshim{0%,100%{opacity:.5;}50%{opacity:1;}}
@keyframes hpulse{0%,100%{opacity:0;}50%{opacity:1;}}
@keyframes hwave{0%,100%{transform:scaleY(1);opacity:.4;}50%{transform:scaleY(1.7);opacity:.95;}}
@keyframes pglow-w{0%,100%{box-shadow:0 0 0 0 rgba(79,163,224,0);}45%{box-shadow:0 0 22px 11px rgba(79,163,224,.42);}}
@keyframes pglow-d{0%,100%{box-shadow:0 0 0 0 rgba(224,124,79,0);}45%{box-shadow:0 0 22px 11px rgba(224,124,79,.46);}}
@keyframes bglow{0%,100%{opacity:.06;}50%{opacity:.16;}}
@keyframes lp{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.28;transform:scale(.5);}}

/* ── Info ── */
.mc-info{padding:0 13px 13px;display:flex;flex-direction:column;align-items:center;}
.mc-prog-wrap{width:100%;height:3px;border-radius:2px;margin:10px 0 9px;}
.mc-prog{height:3px;border-radius:2px;transition:width 1.3s ease,background .6s ease;}
.mc-cy{font-size:15px;font-weight:600;text-align:center;margin-bottom:2px;min-height:22px;cursor:pointer;}
.mc-tm{font-size:10px;font-family:'DM Mono',monospace;text-align:center;margin-bottom:11px;min-height:15px;color:inherit;}
.mc-sg{display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;width:100%;}
.mc-sg+.mc-sg{margin-top:5px;}
.mc-st{border-radius:10px;padding:8px 3px;text-align:center;cursor:pointer;transition:background .15s;}
.mc-sv{font-size:12px;font-weight:600;display:block;font-family:'DM Mono',monospace;}
.mc-sl{font-size:7px;font-weight:500;letter-spacing:.09em;text-transform:uppercase;}
.mc-foot{flex-shrink:0;line-height:0;}
.mc-foot svg{display:block;width:100%;}

/* ── Live dots ── */
.lv-wr{background:#4fa3e0;box-shadow:0 0 6px #4fa3e0;animation:lp 2s ease infinite;}
.lv-dr{background:#e07c4f;box-shadow:0 0 6px #e07c4f;animation:lp 2s ease infinite .4s;}
.lv-done{background:#3cbe64;box-shadow:0 0 6px #3cbe64;}
.lv-off{background:rgba(255,255,255,.18);}

/* ── Samsung theme ── */
.t-sam .mc-panel{background:linear-gradient(180deg,#111,#0a0a0a);border-bottom:2px solid #000;}
.t-sam .mc-knob{background:radial-gradient(circle at 33% 28%,#d0d0d0,#777 45%,#222 80%);border:2px solid rgba(255,255,255,.3);}
.t-sam .mc-body{background:linear-gradient(172deg,#f7f7f7,#e5e5e5);}
.t-sam .mc-info{background:linear-gradient(172deg,#f0f0f0,#e0e0e0);}
.t-sam .mc-cy{color:#111;}.t-sam .mc-tm{color:rgba(0,0,0,.36);}
.t-sam .mc-prog-wrap{background:rgba(0,0,0,.08);}
.t-sam .mc-st{background:rgba(0,0,0,.05);border:1px solid rgba(0,0,0,.07);}
.t-sam .mc-sv{color:#111;}.t-sam .mc-sl{color:rgba(0,0,0,.28);}
.t-sam .lcd-r{color:#5bb8ff;}.t-sam .lcd-d{color:#ff9555;}
.t-sam .lcd-e{color:#4ddd88;}.t-sam .lcd-p{color:#f0c84a;}.t-sam .lcd-s{color:rgba(255,255,255,.25);}

/* ── LG theme ── */
.t-lg .mc-panel{background:linear-gradient(180deg,#1a1a1a,#111);border-bottom:1px solid rgba(255,255,255,.06);}
.t-lg .mc-knob{background:radial-gradient(circle at 50% 50%,#222,#0a0a0a);border:2px solid rgba(255,255,255,.15);box-shadow:0 0 0 4px rgba(255,255,255,.04),0 3px 8px rgba(0,0,0,.8);width:36px;height:36px;}
.t-lg .mc-body{background:linear-gradient(172deg,#2a2a2a,#1a1a1a);}
.t-lg .mc-info{background:linear-gradient(172deg,#252525,#181818);}
.t-lg .mc-cy{color:rgba(255,255,255,.88);}.t-lg .mc-tm{color:rgba(255,255,255,.35);}
.t-lg .mc-prog-wrap{background:rgba(255,255,255,.08);}
.t-lg .mc-st{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);}
.t-lg .mc-sv{color:rgba(255,255,255,.88);}.t-lg .mc-sl{color:rgba(255,255,255,.3);}
.t-lg .ph-chrome{background:conic-gradient(from 0deg,#333,#666,#888,#555,#333,#666,#888,#555,#333);}
.t-lg .ph{--ph-r-t:8px;--ph-w-t:20px;--ph-w-s:calc(var(--ph) - 40px);}
.t-lg .ph-rubber{background:radial-gradient(circle at 30% 26%,#1a1a1a 0%,#050505 60%,#000 100%);box-shadow:inset 0 4px 16px rgba(0,0,0,.95);}
.t-lg .drum-w{background:radial-gradient(circle at 38% 32%,rgba(30,50,120,.35),rgba(5,10,40,.8) 48%,rgba(0,0,0,.95) 100%);}
.t-lg .lcd-r{color:#6dbfff;}.t-lg .lcd-d{color:#ffaa6d;}
.t-lg .lcd-e{color:#6ddb99;}.t-lg .lcd-p{color:#e0b44f;}.t-lg .lcd-s{color:rgba(255,255,255,.2);}

/* ── Bosch/Siemens theme ── */
.t-bsh .mc-panel{background:linear-gradient(180deg,#1a1a1a,#111);border-bottom:2px solid #222;height:60px;}
.t-bsh .mc-knob{background:radial-gradient(circle at 38% 32%,#3a3a3a,#111 55%,#080808 100%);border:2px solid #333;box-shadow:0 0 0 3px rgba(0,120,255,.3),0 0 0 5px rgba(0,80,200,.08),0 3px 10px rgba(0,0,0,.9);width:38px;height:38px;}
.t-bsh .mc-body{background:linear-gradient(172deg,#f5f5f5,#e8e8e8);}
.t-bsh .mc-info{background:linear-gradient(172deg,#eeeeee,#e0e0e0);}
.t-bsh .mc-cy{color:#111;}.t-bsh .mc-tm{color:rgba(0,0,0,.36);}
.t-bsh .mc-prog-wrap{background:rgba(0,0,0,.08);}
.t-bsh .mc-st{background:rgba(0,0,0,.05);border:1px solid rgba(0,0,0,.07);}
.t-bsh .mc-sv{color:#111;}.t-bsh .mc-sl{color:rgba(0,0,0,.28);}
.t-bsh .ph-chrome{background:conic-gradient(from 0deg,#888,#ddd,#eee,#bbb,#999,#ccc,#eee,#bbb,#888);box-shadow:0 3px 10px rgba(0,0,0,.25);}
.t-bsh .ph{--ph-r-t:8px;--ph-w-t:20px;--ph-w-s:calc(var(--ph) - 40px);}
.t-bsh .ph-rubber{background:radial-gradient(circle at 30% 26%,#1a1a1a 0%,#000 70%);box-shadow:inset 0 5px 18px rgba(0,0,0,.95);}
.t-bsh .lcd-r{color:#4fa3e0;}.t-bsh .lcd-d{color:#e07c4f;}
.t-bsh .lcd-e{color:#3cbe64;}.t-bsh .lcd-p{color:#e0b44f;}.t-bsh .lcd-s{color:rgba(255,255,255,.2);}

/* ── Miele theme ── */
.t-miele .mc-panel{background:linear-gradient(180deg,#1c1c1c,#141414);border-bottom:1px solid #333;height:58px;}
.t-miele .mc-knob{background:radial-gradient(circle at 30% 25%,#f5f5f5,#bbb 28%,#666 68%,#333 100%);border:2.5px solid rgba(255,255,255,.28);width:36px;height:36px;box-shadow:0 4px 12px rgba(0,0,0,.9),inset 0 1px 0 rgba(255,255,255,.35);}
.t-miele .mc-body{background:linear-gradient(172deg,#fafaf8,#f0f0ec);}
.t-miele .mc-info{background:linear-gradient(172deg,#f5f5f2,#ebebea);}
.t-miele .mc-cy{color:#111;}.t-miele .mc-tm{color:rgba(0,0,0,.35);}
.t-miele .mc-prog-wrap{background:rgba(0,0,0,.07);}
.t-miele .mc-st{background:rgba(0,0,0,.04);border:1px solid rgba(0,0,0,.06);}
.t-miele .mc-sv{color:#111;}.t-miele .mc-sl{color:rgba(0,0,0,.27);}
.t-miele .ph-chrome{background:conic-gradient(from 0deg,#aaa,#eee,#fff,#ddd,#aaa,#eee,#fff,#ddd,#aaa);box-shadow:0 4px 16px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.5);}
.t-miele .ph{--ph-r-t:12px;--ph-w-t:26px;--ph-w-s:calc(var(--ph) - 52px);}
.t-miele .ph-rubber{background:radial-gradient(circle at 32% 28%,#222 0%,#060606 70%);}
.t-miele .lcd-r{color:#4fa3e0;}.t-miele .lcd-d{color:#e07c4f;}
.t-miele .lcd-e{color:#3cbe64;}.t-miele .lcd-p{color:#e0b44f;}.t-miele .lcd-s{color:rgba(255,255,255,.2);}
    `;
  }
}

// ════════════════════════════════════════════════════════════════════════════
// Visual Editor
// ════════════════════════════════════════════════════════════════════════════
class LaundryCardEditor extends LitElement {
  static get properties() {
    return { hass: {}, _config: {}, _openSections: {} };
  }

  constructor() {
    super();
    this._openSections = { appearance: true, washer: true, dryer: false };
  }

  setConfig(config) {
    this._config = JSON.parse(JSON.stringify(config));
  }

  _set(key, value) {
    this._config = { ...this._config, [key]: value };
    this._fire();
  }

  _setNested(side, key, value) {
    this._config = {
      ...this._config,
      [side]: { ...this._config[side], [key]: value },
    };
    this._fire();
  }

  _setStat(side, index, field, value) {
    const stats = [...(this._config[side]?.stats || [])];
    stats[index] = { ...stats[index], [field]: value };
    this._setNested(side, 'stats', stats);
  }

  _fire() {
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config }, bubbles: true, composed: true,
    }));
    this.requestUpdate();
  }

  _toggleSec(id) {
    this._openSections = { ...this._openSections, [id]: !this._openSections[id] };
    this.requestUpdate();
  }

  // ── Helper widgets (kitchen-card style) ───────────────────────────────────
  _txt(label, value, onChange, placeholder) {
    return html`<div class="ed-field">
      <label class="ed-label">${label}</label>
      <input class="ed-input" type="text" .value="${value || ''}" placeholder="${placeholder || ''}"
        @change="${(e) => onChange(e.target.value)}"/>
    </div>`;
  }

  _toggle(label, value, onChange) {
    return html`<div class="toggle-row">
      <span class="toggle-label">${label}</span>
      <label class="toggle-wrap">
        <input type="checkbox" ?checked="${!!value}" @change="${(e) => onChange(e.target.checked)}"/>
        <span class="toggle-slider"></span>
      </label>
    </div>`;
  }

  _seg(label, value, options, onChange) {
    return html`<div class="ed-field">
      <label class="ed-label">${label}</label>
      <div class="segmented">
        ${options.map(o => html`
          <div class="seg-opt ${value === o.val ? 'active' : ''}" @click="${() => onChange(o.val)}">${o.label}</div>`)}
      </div>
    </div>`;
  }

  _entityPicker(value, onChange, domains, label) {
    return html`<div class="ed-field">
      <label class="ed-label">${label || 'Entity'}</label>
      <ha-entity-picker
        .hass=${this.hass}
        .value=${value || ''}
        .includeDomains=${domains?.length ? domains : undefined}
        allow-custom-entity
        @value-changed=${(e) => { const v = e.detail.value || ''; if (v !== (value||'')) onChange(v); }}
      ></ha-entity-picker>
    </div>`;
  }

  _section(id, title, count, content) {
    const open = !!this._openSections[id];
    return html`<div class="ed-section ${open ? 'open' : ''}">
      <div class="ed-section-header" @click="${() => this._toggleSec(id)}">
        <div class="ed-section-title">
          ${title}
          ${count !== undefined ? html`<span class="ed-section-count">${count}</span>` : ''}
        </div>
        <span class="ed-section-arrow">▾</span>
      </div>
      <div class="ed-section-body">${open ? content : ''}</div>
    </div>`;
  }

  // ── Section content ────────────────────────────────────────────────────────
  _appearanceContent() {
    const cfg = this._config;
    const brandOpts = [
      { val:'samsung', label:'Samsung' },
      { val:'lg',      label:'LG' },
      { val:'bosch',   label:'Bosch' },
      { val:'siemens', label:'Siemens' },
      { val:'miele',   label:'Miele' },
      { val:'generic', label:'Generic' },
    ];
    return html`
      ${this._seg('Device brand', cfg.brand || 'samsung', brandOpts, (v) => this._set('brand', v))}
      <p class="hint">The brand controls the visual design of the panel, porthole, body color and foot panels.</p>
      ${this._toggle('Show washer panel', cfg.show_washer !== false, (v) => this._set('show_washer', v))}
      ${this._toggle('Show dryer panel',  cfg.show_dryer  !== false, (v) => this._set('show_dryer', v))}
    `;
  }

  _machineContent(side) {
    const cfg  = this._config;
    const mc   = cfg[side] || {};
    const brand = cfg.brand || 'samsung';
    const stats = mc.stats || [];

    // Brand-specific entity name hints
    const HINTS = {
      samsung: { state:'sensor.XXX_machine_state', time:'sensor.XXX_completion_time', prog:'sensor.XXX_current_course' },
      lg:      { state:'sensor.XXX_run_state',     time:'sensor.XXX_remain_time',     prog:'sensor.XXX_course' },
      bosch:   { state:'sensor.XXX_operation_state', time:'sensor.XXX_finish_in_relative', prog:'sensor.XXX_active_program' },
      siemens: { state:'sensor.XXX_operation_state', time:'sensor.XXX_finish_in_relative', prog:'sensor.XXX_active_program' },
      miele:   { state:'sensor.XXX_status',         time:'sensor.XXX_remaining_time',  prog:'sensor.XXX_program' },
      generic: { state:'sensor.XXX_state',          time:'sensor.XXX_completion_time', prog:'sensor.XXX_program' },
    };
    const h = HINTS[brand] || HINTS.generic;

    return html`
      <p class="hint">Entity names vary by brand — placeholder shows typical format for <strong>${brand}</strong>.</p>
      ${this._entityPicker(mc.machine_state, (v) => this._setNested(side,'machine_state',v), ['sensor','binary_sensor'], `Machine state — e.g. ${h.state}`)}
      ${this._entityPicker(mc.completion_time, (v) => this._setNested(side,'completion_time',v), ['sensor'], `Completion time — e.g. ${h.time}`)}
      ${this._entityPicker(mc.current_program, (v) => this._setNested(side,'current_program',v), ['sensor'], `Current program — e.g. ${h.prog}`)}

      <p class="hint-group">📊 Stat tiles (6 configurable slots)</p>
      ${[0,1,2,3,4,5].map(i => {
        const s = stats[i] || { label:'', entity:'' };
        return html`<div class="entity-item">
          <div class="entity-item-hd">
            <span class="entity-item-num">Slot ${i+1}</span>
          </div>
          ${this._txt('Label', s.label, (v) => this._setStat(side, i, 'label', v), 'e.g. Temp')}
          ${this._entityPicker(s.entity, (v) => this._setStat(side, i, 'entity', v), ['sensor','binary_sensor'], 'Entity')}
        </div>`;
      })}
    `;
  }

  render() {
    if (!this._config) return html``;
    const cfg = this._config;
    const wStats = (cfg.washer?.stats || []).filter(s => s.entity).length;
    const dStats = (cfg.dryer?.stats  || []).filter(s => s.entity).length;
    return html`
      <div class="ed-root">
        ${this._section('appearance', '🎨 Appearance & Brand', undefined, this._appearanceContent())}
        ${this._section('washer', '🫧 Washer', wStats, this._machineContent('washer'))}
        ${this._section('dryer',  '🔥 Dryer',  dStats, this._machineContent('dryer'))}
      </div>`;
  }

  static get styles() {
    return css`
:host{display:block;font-family:'Segoe UI',system-ui,sans-serif;}
.ed-root{display:flex;flex-direction:column;padding:8px 0;}
.ed-label{display:block;font-size:12px;font-weight:500;color:var(--primary-text-color,rgba(255,255,255,.7));margin-bottom:6px;letter-spacing:.2px;}
.ed-field{margin-bottom:12px;}
.ed-input{width:100%;padding:10px 12px;font-size:14px;font-family:inherit;border:1px solid var(--divider-color,rgba(255,255,255,.1));border-radius:8px;background:var(--secondary-background-color,rgba(255,255,255,.04));color:var(--primary-text-color,#fff);transition:border-color .15s;box-sizing:border-box;}
.ed-input:focus{outline:none;border-color:var(--primary-color,#4fa3e0);}
.hint{font-size:12px;color:var(--secondary-text-color,rgba(255,255,255,.5));margin:0 0 10px;line-height:1.5;}
.hint-group{font-size:10px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--primary-color,#4fa3e0);margin:12px 0 8px;}
ha-entity-picker{display:block;width:100%;}
.ed-section{background:var(--secondary-background-color,rgba(255,255,255,.025));border:1px solid var(--divider-color,rgba(255,255,255,.06));border-radius:10px;margin-bottom:10px;overflow:hidden;}
.ed-section-header{padding:12px 14px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;user-select:none;transition:background .15s;}
.ed-section-header:hover{background:rgba(255,255,255,.03);}
.ed-section-title{display:flex;align-items:center;gap:10px;font-size:14px;font-weight:500;color:var(--primary-text-color,#fff);}
.ed-section-count{font-size:11px;font-weight:500;color:var(--secondary-text-color,rgba(255,255,255,.4));background:rgba(255,255,255,.05);padding:2px 8px;border-radius:10px;}
.ed-section-arrow{color:var(--secondary-text-color,rgba(255,255,255,.4));font-size:12px;transition:transform .2s;}
.ed-section.open .ed-section-arrow{transform:rotate(180deg);}
.ed-section-body{padding:0 14px;}
.ed-section.open .ed-section-body{padding:4px 14px 14px;}
.entity-item{background:rgba(0,0,0,.18);border:1px solid var(--divider-color,rgba(255,255,255,.05));border-radius:9px;padding:10px;margin-bottom:10px;}
.entity-item-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.entity-item-num{font-size:11px;font-weight:600;color:var(--primary-color,#4fa3e0);letter-spacing:.05em;text-transform:uppercase;}
.segmented{display:flex;flex-wrap:wrap;border:1px solid var(--divider-color,rgba(255,255,255,.1));border-radius:8px;overflow:hidden;}
.seg-opt{flex:1;min-width:60px;padding:8px 4px;font-size:12px;text-align:center;cursor:pointer;color:var(--secondary-text-color,rgba(255,255,255,.5));transition:background .15s,color .15s;}
.seg-opt:hover{background:rgba(255,255,255,.04);}
.seg-opt.active{background:var(--primary-color,#4fa3e0);color:#fff;font-weight:500;}
.toggle-row{display:flex;align-items:center;justify-content:space-between;padding:6px 0;margin-bottom:10px;}
.toggle-label{font-size:13px;color:var(--primary-text-color,rgba(255,255,255,.85));}
.toggle-wrap{position:relative;display:inline-block;width:40px;height:22px;}
.toggle-wrap input{opacity:0;width:0;height:0;}
.toggle-slider{position:absolute;inset:0;background:rgba(255,255,255,.15);border-radius:11px;transition:background .2s;cursor:pointer;}
.toggle-slider::before{content:'';position:absolute;width:16px;height:16px;left:3px;top:3px;background:#fff;border-radius:50%;transition:transform .2s;}
input:checked+.toggle-slider{background:var(--primary-color,#4fa3e0);}
input:checked+.toggle-slider::before{transform:translateX(18px);}
    `;
  }
}

// ─── Register ────────────────────────────────────────────────────────────────
customElements.define('laundry-card', LaundryCard);
customElements.define('laundry-card-editor', LaundryCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type:             'laundry-card',
  name:             'Laundry Card',
  description:      'Appliance-style washer + dryer card — Samsung, LG, Bosch, Siemens, Miele',
  preview:          true,
  documentationURL: 'https://github.com/robman2026/laundry-card',
});

console.info(
  '%c LAUNDRY-CARD %c v' + LC_VERSION + ' ',
  'background:#4fa3e0;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px;',
  'background:#0d1020;color:#6dbfff;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0;'
);
