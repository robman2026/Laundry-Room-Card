/**
 * Samsung Laundry Card
 * A custom Home Assistant Lovelace card for Samsung SmartThings Washer & Dryer
 * Author: Community
 * Version: 1.0.0
 * License: MIT
 */

const CARD_VERSION = "1.0.0";

// ── Styles ─────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  :host {
    display: block;
    font-family: 'DM Sans', sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .slc-root {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
    padding: 4px 0;
  }

  /* ── Card shell ── */
  .slc-card {
    flex: 1;
    min-width: 240px;
    max-width: 300px;
    background: #181c27;
    border-radius: 24px;
    padding: 22px 20px 20px;
    border: 1px solid rgba(255,255,255,0.07);
    box-shadow: 0 4px 40px rgba(0,0,0,0.5),
                inset 0 1px 0 rgba(255,255,255,0.06);
    position: relative;
    overflow: hidden;
    cursor: default;
    transition: transform .25s ease, box-shadow .25s ease;
  }
  .slc-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 50px rgba(0,0,0,0.6),
                inset 0 1px 0 rgba(255,255,255,0.08);
  }

  /* Glow blob */
  .slc-card::before {
    content: '';
    position: absolute;
    width: 170px; height: 170px;
    border-radius: 50%;
    top: -55px; right: -45px;
    filter: blur(55px);
    opacity: .16;
    pointer-events: none;
  }
  .slc-washer::before { background: #4fa3e0; }
  .slc-dryer::before  { background: #e07c4f; }

  /* ── Header ── */
  .slc-brand {
    font-size: 9px;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: rgba(255,255,255,.2);
    font-weight: 500;
    margin-bottom: 3px;
  }
  .slc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
  }
  .slc-device-name {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: rgba(255,255,255,.4);
  }
  .slc-pill {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .06em;
    padding: 4px 12px;
    border-radius: 20px;
    font-family: 'DM Mono', monospace;
    text-transform: capitalize;
    transition: background .4s, color .4s;
  }
  .pill-stopped { background: rgba(255,255,255,.06); color: rgba(255,255,255,.3); }
  .pill-run     { background: rgba(79,163,224,.15);  color: #6dbfff; }
  .pill-drying  { background: rgba(224,124,79,.15);  color: #ffaa6d; }
  .pill-pause   { background: rgba(255,210,109,.12); color: #ffd26d; }
  .pill-end     { background: rgba(109,219,153,.15); color: #6ddb99; }

  /* Live dot */
  .slc-dot {
    position: absolute;
    top: 14px; right: 14px;
    width: 7px; height: 7px;
    border-radius: 50%;
    background: rgba(255,255,255,.15);
    transition: background .4s;
  }
  .slc-dot.active-w { background: #4fa3e0; animation: slc-pulse 2s ease infinite; }
  .slc-dot.active-d { background: #e07c4f; animation: slc-pulse 2s ease infinite .4s; }

  @keyframes slc-pulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: .4; transform: scale(.7); }
  }

  /* ── Drum ── */
  .slc-drum-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 16px;
    position: relative;
    height: 118px;
  }
  .slc-ring {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    width: 118px; height: 118px;
    pointer-events: none;
  }
  .slc-ring circle {
    fill: none;
    stroke-width: 3;
    stroke-linecap: round;
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
    transition: stroke-dashoffset 1.2s ease;
  }
  .ring-track   { stroke: rgba(255,255,255,.05); }
  .ring-washer  { stroke: #4fa3e0; }
  .ring-dryer   { stroke: #e07c4f; }

  .slc-drum {
    width: 98px; height: 98px;
    border-radius: 50%;
    border: 2.5px solid rgba(255,255,255,.08);
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at 35% 35%, rgba(255,255,255,.04), transparent 70%);
    position: relative;
    z-index: 1;
    transition: transform .3s ease;
  }
  .slc-drum-inner {
    width: 68px; height: 68px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,.06);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .slc-drum-inner::before,
  .slc-drum-inner::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,.05);
  }
  .slc-drum-inner::before { width: 12px; height: 12px; top: 10px; left: 14px; }
  .slc-drum-inner::after  { width: 12px; height: 12px; bottom: 10px; right: 14px; }

  .slc-drum-icon { font-size: 26px; user-select: none; }

  @keyframes slc-spin      { to { transform: rotate(360deg); } }
  @keyframes slc-spin-slow { to { transform: rotate(360deg); } }
  .spinning      .slc-drum { animation: slc-spin 2.5s linear infinite; }
  .spinning-slow .slc-drum { animation: slc-spin-slow 4s linear infinite; }

  /* ── Cycle info ── */
  .slc-cycle {
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: rgba(255,255,255,.88);
    margin-bottom: 3px;
    min-height: 22px;
  }
  .slc-time {
    text-align: center;
    font-size: 12px;
    color: rgba(255,255,255,.3);
    font-family: 'DM Mono', monospace;
    margin-bottom: 16px;
    min-height: 18px;
  }

  /* ── Stats grid ── */
  .slc-stats {
    display: grid;
    gap: 8px;
    margin-bottom: 14px;
  }
  .slc-stats-3 { grid-template-columns: 1fr 1fr 1fr; }
  .slc-stats-2 { grid-template-columns: 1fr 1fr; }

  .slc-stat {
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.05);
    border-radius: 12px;
    padding: 10px 6px;
    text-align: center;
  }
  .slc-stat-val {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,.85);
    display: block;
    margin-bottom: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .slc-stat-lbl {
    font-size: 9px;
    font-weight: 500;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: rgba(255,255,255,.25);
  }

  /* ── Actions ── */
  .slc-actions { display: flex; gap: 8px; margin-bottom: 0; }
  .slc-btn {
    flex: 1;
    padding: 11px 6px;
    border-radius: 12px;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .04em;
    cursor: pointer;
    transition: background .18s, transform .1s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }
  .slc-btn:active { transform: scale(.97); }
  .btn-neutral { background: rgba(255,255,255,.08); color: rgba(255,255,255,.7); border: 1px solid rgba(255,255,255,.08); }
  .btn-neutral:hover { background: rgba(255,255,255,.14); }
  .btn-blue    { background: rgba(79,163,224,.18);   color: #6dbfff; border: 1px solid rgba(79,163,224,.22); }
  .btn-blue:hover    { background: rgba(79,163,224,.3); }
  .btn-orange  { background: rgba(224,124,79,.18);   color: #ffaa6d; border: 1px solid rgba(224,124,79,.22); }
  .btn-orange:hover  { background: rgba(224,124,79,.3); }

  /* ── Wrinkle prevent toggle ── */
  .slc-wrinkle {
    margin-top: 10px;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.05);
    border-radius: 12px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: background .2s, border-color .2s;
    user-select: none;
  }
  .slc-wrinkle:hover { background: rgba(255,255,255,.07); }
  .slc-wrinkle.on {
    background: rgba(224,124,79,.1);
    border-color: rgba(224,124,79,.25);
  }
  .slc-wrinkle-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: .07em;
    text-transform: uppercase;
    color: rgba(255,255,255,.3);
    display: flex;
    align-items: center;
    gap: 7px;
    transition: color .2s;
  }
  .slc-wrinkle.on .slc-wrinkle-label { color: #ffaa6d; }
  .slc-toggle {
    width: 36px; height: 20px;
    border-radius: 10px;
    background: rgba(255,255,255,.1);
    position: relative;
    transition: background .2s;
    flex-shrink: 0;
  }
  .slc-toggle.on { background: #e07c4f; }
  .slc-toggle::after {
    content: '';
    position: absolute;
    width: 14px; height: 14px;
    border-radius: 50%;
    background: white;
    top: 3px; left: 3px;
    transition: left .2s;
    box-shadow: 0 1px 3px rgba(0,0,0,.3);
  }
  .slc-toggle.on::after { left: 19px; }

  /* ── Editor ── */
  .slc-editor {
    padding: 16px;
    font-family: 'DM Sans', sans-serif;
    color: var(--primary-text-color);
  }
  .slc-editor h3 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 16px;
    color: var(--primary-text-color);
    border-bottom: 1px solid var(--divider-color);
    padding-bottom: 8px;
  }
  .slc-editor-section {
    margin-bottom: 20px;
  }
  .slc-editor-section h4 {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .08em;
    color: var(--secondary-text-color);
    margin-bottom: 10px;
  }
  .slc-field {
    margin-bottom: 10px;
  }
  .slc-field label {
    display: block;
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-bottom: 4px;
  }
  .slc-field ha-entity-picker,
  .slc-field ha-textfield {
    width: 100%;
    display: block;
  }
`;

// ── Ring math ──────────────────────────────────────────────────────────────
const CIRCUMFERENCE = 2 * Math.PI * 54; // r=54

function ringOffset(pct) {
  return CIRCUMFERENCE * (1 - Math.max(0, Math.min(1, pct)));
}

// ── State helpers ──────────────────────────────────────────────────────────
function pillClass(state, isWasher) {
  if (!state || state === 'stopped' || state === 'Stopped') return 'pill-stopped';
  const s = state.toLowerCase();
  if (s === 'run' || s === 'running') return isWasher ? 'pill-run' : 'pill-drying';
  if (s === 'pause' || s === 'paused') return 'pill-pause';
  if (s === 'end' || s === 'finished') return 'pill-end';
  return 'pill-stopped';
}

function isRunning(state) {
  if (!state) return false;
  const s = state.toLowerCase();
  return s === 'run' || s === 'running';
}

function isEnded(state) {
  if (!state) return false;
  const s = state.toLowerCase();
  return s === 'end' || s === 'finished';
}

function stateLabel(state) {
  if (!state || state === 'unknown' || state === 'unavailable') return '—';
  return state;
}

// ── Main Card Element ──────────────────────────────────────────────────────
class SamsungLaundryCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass = null;
  }

  static getConfigElement() {
    return document.createElement('samsung-laundry-card-editor');
  }

  static getStubConfig() {
    return {
      washer_machine_state: '',
      washer_completion_time: '',
      washer_current_course: '',
      washer_water_temperature: '',
      washer_spin_level: '',
      washer_power: '',
      washer_energy: '',
      washer_water_consumption: '',
      washer_job_state: '',
      dryer_machine_state: '',
      dryer_completion_time: '',
      dryer_current_course: '',
      dryer_energy: '',
      dryer_power: '',
      dryer_job_state: '',
      dryer_wrinkle_prevent: '',
      show_washer: true,
      show_dryer: true,
    };
  }

  setConfig(config) {
    this._config = { ...SamsungLaundryCard.getStubConfig(), ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _state(entityId) {
    if (!entityId || !this._hass) return null;
    const e = this._hass.states[entityId];
    return e ? e.state : null;
  }

  _attr(entityId, attr) {
    if (!entityId || !this._hass) return null;
    const e = this._hass.states[entityId];
    return e && e.attributes ? e.attributes[attr] : null;
  }

  _callService(domain, service, data) {
    if (!this._hass) return;
    this._hass.callService(domain, service, data);
  }

  _moreInfo(entityId) {
    if (!entityId) return;
    const ev = new CustomEvent('hass-more-info', {
      bubbles: true, composed: true,
      detail: { entityId },
    });
    this.dispatchEvent(ev);
  }

  _buildWasherHTML() {
    const cfg = this._config;
    const state       = this._state(cfg.washer_machine_state) || 'Stopped';
    const course      = stateLabel(this._state(cfg.washer_current_course));
    const completion  = stateLabel(this._state(cfg.washer_completion_time));
    const temp        = stateLabel(this._state(cfg.washer_water_temperature));
    const spin        = stateLabel(this._state(cfg.washer_spin_level));
    const power       = stateLabel(this._state(cfg.washer_power));
    const energy      = stateLabel(this._state(cfg.washer_energy));
    const water       = stateLabel(this._state(cfg.washer_water_consumption));
    const jobState    = stateLabel(this._state(cfg.washer_job_state));

    const running     = isRunning(state);
    const ended       = isEnded(state);
    const spinClass   = running ? 'spinning' : '';
    const dotClass    = running ? 'active-w' : '';
    const pill        = pillClass(state, true);
    const icon        = ended ? '✅' : '🫧';
    const offset      = running ? ringOffset(0.35) : CIRCUMFERENCE;
    const timeLabel   = completion !== '—' ? `Done ${completion}` : (running ? 'Running…' : '—');

    return `
      <div class="slc-card slc-washer" data-device="washer">
        <div class="slc-dot ${dotClass}"></div>
        <div class="slc-brand">Samsung</div>
        <div class="slc-header">
          <div class="slc-device-name">Washer</div>
          <div class="slc-pill ${pill}">${state}</div>
        </div>

        <div class="slc-drum-wrap ${spinClass}">
          <svg class="slc-ring" viewBox="0 0 120 120">
            <circle class="ring-track" cx="60" cy="60" r="54"
              stroke-dasharray="${CIRCUMFERENCE}" stroke-dashoffset="0"/>
            <circle class="ring-washer" cx="60" cy="60" r="54"
              stroke-dasharray="${CIRCUMFERENCE}"
              stroke-dashoffset="${offset}"/>
          </svg>
          <div class="slc-drum">
            <div class="slc-drum-inner">
              <span class="slc-drum-icon">${icon}</span>
            </div>
          </div>
        </div>

        <div class="slc-cycle">${course}</div>
        <div class="slc-time">${timeLabel}</div>

        <div class="slc-stats slc-stats-3">
          <div class="slc-stat">
            <span class="slc-stat-val">${temp}</span>
            <span class="slc-stat-lbl">Temp</span>
          </div>
          <div class="slc-stat">
            <span class="slc-stat-val">${spin}</span>
            <span class="slc-stat-lbl">Spin</span>
          </div>
          <div class="slc-stat">
            <span class="slc-stat-val">${power}</span>
            <span class="slc-stat-lbl">Power</span>
          </div>
          <div class="slc-stat">
            <span class="slc-stat-val">${energy}</span>
            <span class="slc-stat-lbl">Energy</span>
          </div>
          <div class="slc-stat">
            <span class="slc-stat-val">${water}</span>
            <span class="slc-stat-lbl">Water</span>
          </div>
          <div class="slc-stat">
            <span class="slc-stat-val">${jobState}</span>
            <span class="slc-stat-lbl">Job</span>
          </div>
        </div>

        <div class="slc-actions">
          <button class="slc-btn btn-neutral" data-action="more-info" data-entity="${cfg.washer_machine_state}">
            ℹ️ Details
          </button>
        </div>
      </div>
    `;
  }

  _buildDryerHTML() {
    const cfg = this._config;
    const state       = this._state(cfg.dryer_machine_state) || 'Stopped';
    const course      = stateLabel(this._state(cfg.dryer_current_course));
    const completion  = stateLabel(this._state(cfg.dryer_completion_time));
    const energy      = stateLabel(this._state(cfg.dryer_energy));
    const power       = stateLabel(this._state(cfg.dryer_power));
    const jobState    = stateLabel(this._state(cfg.dryer_job_state));
    const wrinkle     = this._state(cfg.dryer_wrinkle_prevent);

    const running     = isRunning(state);
    const ended       = isEnded(state);
    const spinClass   = running ? 'spinning-slow' : '';
    const dotClass    = running ? 'active-d' : '';
    const pill        = pillClass(state, false);
    const pillLabel   = running ? 'Drying' : state;
    const icon        = ended ? '✅' : '🔥';
    const offset      = running ? ringOffset(0.6) : CIRCUMFERENCE;
    const timeLabel   = completion !== '—' ? `Done ${completion}` : (running ? 'Running…' : '—');
    const wrinkleOn   = wrinkle === 'on';

    return `
      <div class="slc-card slc-dryer" data-device="dryer">
        <div class="slc-dot ${dotClass}"></div>
        <div class="slc-brand">Samsung</div>
        <div class="slc-header">
          <div class="slc-device-name">Dryer</div>
          <div class="slc-pill ${pill}">${pillLabel}</div>
        </div>

        <div class="slc-drum-wrap ${spinClass}">
          <svg class="slc-ring" viewBox="0 0 120 120">
            <circle class="ring-track" cx="60" cy="60" r="54"
              stroke-dasharray="${CIRCUMFERENCE}" stroke-dashoffset="0"/>
            <circle class="ring-dryer" cx="60" cy="60" r="54"
              stroke-dasharray="${CIRCUMFERENCE}"
              stroke-dashoffset="${offset}"/>
          </svg>
          <div class="slc-drum">
            <div class="slc-drum-inner">
              <span class="slc-drum-icon">${icon}</span>
            </div>
          </div>
        </div>

        <div class="slc-cycle">${course}</div>
        <div class="slc-time">${timeLabel}</div>

        <div class="slc-stats slc-stats-3">
          <div class="slc-stat">
            <span class="slc-stat-val">${energy}</span>
            <span class="slc-stat-lbl">Energy</span>
          </div>
          <div class="slc-stat">
            <span class="slc-stat-val">${power}</span>
            <span class="slc-stat-lbl">Power</span>
          </div>
          <div class="slc-stat">
            <span class="slc-stat-val">${jobState}</span>
            <span class="slc-stat-lbl">Job</span>
          </div>
        </div>

        <div class="slc-actions">
          <button class="slc-btn btn-neutral" data-action="more-info" data-entity="${cfg.dryer_machine_state}">
            ℹ️ Details
          </button>
        </div>

        ${cfg.dryer_wrinkle_prevent ? `
        <div class="slc-wrinkle ${wrinkleOn ? 'on' : ''}"
          data-action="toggle-wrinkle"
          data-entity="${cfg.dryer_wrinkle_prevent}">
          <span class="slc-wrinkle-label">
            <span>👕</span> Wrinkle Prevent
          </span>
          <div class="slc-toggle ${wrinkleOn ? 'on' : ''}"></div>
        </div>
        ` : ''}
      </div>
    `;
  }

  _render() {
    const cfg = this._config;
    const showWasher = cfg.show_washer !== false;
    const showDryer  = cfg.show_dryer  !== false;

    const html = `
      <style>${STYLES}</style>
      <div class="slc-root">
        ${showWasher ? this._buildWasherHTML() : ''}
        ${showDryer  ? this._buildDryerHTML()  : ''}
      </div>
    `;

    this.shadowRoot.innerHTML = html;
    this._attachListeners();
  }

  _attachListeners() {
    this.shadowRoot.querySelectorAll('[data-action]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = el.dataset.action;
        const entity = el.dataset.entity;

        if (action === 'more-info') {
          this._moreInfo(entity);
        } else if (action === 'toggle-wrinkle') {
          const current = this._state(entity);
          this._callService('switch', current === 'on' ? 'turn_off' : 'turn_on', {
            entity_id: entity,
          });
        }
      });
    });
  }

  getCardSize() { return 5; }
}

// ── Editor Element ─────────────────────────────────────────────────────────
class SamsungLaundryCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
  }

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this.shadowRoot.querySelectorAll('ha-entity-picker').forEach(picker => {
      picker.hass = hass;
    });
  }

  _field(key, label, domain = null) {
    const val = this._config[key] || '';
    return `
      <div class="slc-field">
        <label>${label}</label>
        <ha-entity-picker
          data-key="${key}"
          .value="${val}"
          .hass="${null}"
          allow-custom-entity
          ${domain ? `domain-filter="${domain}"` : ''}
        ></ha-entity-picker>
      </div>
    `;
  }

  _render() {
    this.shadowRoot.innerHTML = `
      <style>${STYLES}</style>
      <div class="slc-editor">
        <h3>🧺 Samsung Laundry Card</h3>

        <div class="slc-editor-section">
          <h4>🫧 Washer Entities</h4>
          ${this._field('washer_machine_state',    'Machine State (sensor)')}
          ${this._field('washer_completion_time',  'Completion Time (sensor)')}
          ${this._field('washer_current_course',   'Current Course / Cycle (sensor)')}
          ${this._field('washer_water_temperature','Water Temperature (sensor or select)')}
          ${this._field('washer_spin_level',       'Spin Level (sensor or select)')}
          ${this._field('washer_power',            'Power (W) (sensor)')}
          ${this._field('washer_energy',           'Energy (kWh) (sensor)')}
          ${this._field('washer_water_consumption','Water Consumption (sensor)')}
          ${this._field('washer_job_state',        'Job State (sensor)')}
        </div>

        <div class="slc-editor-section">
          <h4>🔥 Dryer Entities</h4>
          ${this._field('dryer_machine_state',   'Machine State (sensor)')}
          ${this._field('dryer_completion_time', 'Completion Time (sensor)')}
          ${this._field('dryer_current_course',  'Current Course / Cycle (sensor)')}
          ${this._field('dryer_energy',          'Energy (kWh) (sensor)')}
          ${this._field('dryer_power',           'Power (W) (sensor)')}
          ${this._field('dryer_job_state',       'Job State (sensor)')}
          ${this._field('dryer_wrinkle_prevent', 'Wrinkle Prevent (switch)')}
        </div>
      </div>
    `;

    // Hydrate hass on pickers
    if (this._hass) {
      this.shadowRoot.querySelectorAll('ha-entity-picker').forEach(picker => {
        picker.hass = this._hass;
      });
    }

    // Listen for changes
    this.shadowRoot.querySelectorAll('ha-entity-picker').forEach(picker => {
      picker.addEventListener('value-changed', (e) => {
        const key = picker.dataset.key;
        const val = e.detail.value;
        this._config = { ...this._config, [key]: val };
        this.dispatchEvent(new CustomEvent('config-changed', {
          detail: { config: this._config },
          bubbles: true,
          composed: true,
        }));
      });
    });
  }
}

// ── Register ───────────────────────────────────────────────────────────────
customElements.define('samsung-laundry-card', SamsungLaundryCard);
customElements.define('samsung-laundry-card-editor', SamsungLaundryCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'samsung-laundry-card',
  name: 'Samsung Laundry Card',
  description: 'A beautiful card for Samsung SmartThings Washer & Dryer',
  preview: true,
  documentationURL: 'https://github.com/YOUR_USERNAME/samsung-laundry-card',
});

console.info(
  `%c SAMSUNG-LAUNDRY-CARD %c v${CARD_VERSION} `,
  'background:#4fa3e0;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px;',
  'background:#181c27;color:#6dbfff;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0;'
);
