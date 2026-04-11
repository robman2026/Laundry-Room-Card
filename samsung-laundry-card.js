class SamsungLaundryCard extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = this.getTemplate();
      this.content = this.shadowRoot.querySelector('.laundry-card');
    }

    const config = this.config;
    const appliance = config.appliance || 'washer'; // 'washer' or 'dryer'
    
    // Fetch entities from Home Assistant state
    const machineStateEntity = hass.states[config.entities.machine_state];
    const completionTimeEntity = hass.states[config.entities.completion_time];
    const energyEntity = hass.states[config.entities.energy];
    const tempEntity = config.entities.temperature ? hass.states[config.entities.temperature] : null;

    if (!machineStateEntity) return;

    // Determine State
    const stateStr = machineStateEntity.state.toLowerCase();
    const isRunning = stateStr === 'run' || stateStr === 'running' || stateStr === 'drying';
    const isDone = stateStr === 'done' || stateStr === 'finished';
    const isStopped = stateStr === 'stop' || stateStr === 'stopped' || stateStr === 'none';

    // Calculate Remaining Time
    let minsRemaining = 0;
    if (completionTimeEntity && completionTimeEntity.state !== 'unknown' && isRunning) {
      const completionTime = new Date(completionTimeEntity.state);
      const now = new Date();
      minsRemaining = Math.max(0, Math.round((completionTime - now) / 60000));
    }

    // Update UI Elements
    this.updateStatus(appliance, isRunning, isDone, isStopped);
    this.updateTimeAndRing(appliance, minsRemaining, isRunning, isDone);
    
    // Update Stats
    if (energyEntity) {
      this.shadowRoot.getElementById('energyVal').textContent = `${parseFloat(energyEntity.state).toFixed(2)} kWh`;
    }
    if (tempEntity) {
      this.shadowRoot.getElementById('tempVal').textContent = `${tempEntity.state}${tempEntity.attributes.unit_of_measurement || '°C'}`;
    }
  }

  updateStatus(appliance, isRunning, isDone, isStopped) {
    const card = this.shadowRoot.getElementById('card');
    const statusPill = this.shadowRoot.getElementById('statusPill');
    const drumIcon = this.shadowRoot.getElementById('drumIcon');

    // Reset classes
    card.className = `laundry-card ${appliance}-card`;
    
    if (isRunning) {
      card.classList.add(appliance === 'washer' ? 'running' : 'drying');
      statusPill.textContent = appliance === 'washer' ? 'Running' : 'Drying';
      statusPill.className = `status-pill status-${appliance === 'washer' ? 'running' : 'drying'}`;
      drumIcon.textContent = appliance === 'washer' ? '🫧' : '🔥';
    } else if (isDone) {
      statusPill.textContent = 'Done';
      statusPill.className = 'status-pill status-done';
      drumIcon.textContent = '✅';
    } else {
      statusPill.textContent = 'Idle';
      statusPill.className = 'status-pill status-idle';
      drumIcon.textContent = appliance === 'washer' ? '🫧' : '🔥';
      this.shadowRoot.querySelector('.live-dot').style.animation = 'none';
      this.shadowRoot.querySelector('.live-dot').style.background = 'rgba(255,255,255,0.15)';
    }
  }

  updateTimeAndRing(appliance, minsRemaining, isRunning, isDone) {
    const timeText = this.shadowRoot.getElementById('timeRemaining');
    const ring = this.shadowRoot.getElementById('progressRing');
    
    // Default total times for ring percentage (can be configured via YAML later)
    const totalMins = appliance === 'washer' ? 55 : 50; 
    
    if (isRunning && minsRemaining > 0) {
      timeText.textContent = `${minsRemaining} min remaining`;
      const pct = 1 - Math.min(minsRemaining / totalMins, 1);
      ring.style.strokeDashoffset = 339.3 * (1 - pct);
    } else if (isDone) {
      timeText.textContent = 'Cycle complete';
      ring.style.strokeDashoffset = 0;
    } else {
      timeText.textContent = 'Ready';
      ring.style.strokeDashoffset = 339.3; // Empty ring
    }
  }

  setConfig(config) {
    if (!config.entities || !config.entities.machine_state) {
      throw new Error('You need to define the machine_state entity');
    }
    this.config = config;
  }

  getCardSize() {
    return 3;
  }

  getTemplate() {
    const appliance = this.config.appliance || 'washer';
    const title = this.config.name || (appliance === 'washer' ? 'Washer' : 'Dryer');
    const colorHex = appliance === 'washer' ? '#4fa3e0' : '#e07c4f';

    return `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; }
        
        :host {
          display: block;
          font-family: 'DM Sans', sans-serif;
        }

        .laundry-card {
          width: 100%;
          background: #181c27;
          border-radius: 24px;
          padding: 24px;
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 4px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
          position: relative;
          overflow: hidden;
        }

        .laundry-card::before {
          content: ''; position: absolute;
          width: 180px; height: 180px; border-radius: 50%;
          top: -60px; right: -50px; filter: blur(60px);
          opacity: 0.18; pointer-events: none;
        }
        .washer-card::before { background: #4fa3e0; }
        .dryer-card::before  { background: #e07c4f; }

        .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .device-name { font-size: 13px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.45); }
        
        .status-pill { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; padding: 4px 10px; border-radius: 20px; font-family: 'DM Mono', monospace; }
        .status-running { background: rgba(79,163,224,0.15); color: #6dbfff; }
        .status-drying  { background: rgba(224,124,79,0.15);  color: #ffaa6d; }
        .status-done    { background: rgba(80,200,120,0.15);  color: #6ddb99; }
        .status-idle    { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.3); }

        .drum-wrap { display: flex; justify-content: center; margin-bottom: 22px; position: relative; }
        .drum { width: 110px; height: 110px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at 35% 35%, rgba(255,255,255,0.05), transparent 70%); }
        .drum-inner { width: 78px; height: 78px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; position: relative; }
        .drum-icon { font-size: 28px; z-index: 1; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .running .drum { animation: spin 2.5s linear infinite; }
        .drying  .drum { animation: spin-slow 4s linear infinite; }

        .progress-ring { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 120px; height: 120px; }
        .progress-ring circle { fill: none; stroke-width: 3; stroke-linecap: round; transform: rotate(-90deg); transform-origin: 50% 50%; transition: stroke-dashoffset 1s ease; }
        .progress-track { stroke: rgba(255,255,255,0.05); }
        .progress-fill { stroke: ${colorHex}; }

        .live-dot { position: absolute; top: 12px; right: 12px; width: 8px; height: 8px; border-radius: 50%; }
        @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.7); } }
        .washer-card .live-dot { background: #4fa3e0; animation: pulse 2s ease infinite; }
        .dryer-card  .live-dot { background: #e07c4f; animation: pulse 2s ease infinite 0.4s; }

        .cycle-label { text-align: center; font-size: 16px; font-weight: 600; color: rgba(255,255,255,0.88); margin-bottom: 4px; }
        .cycle-sub { text-align: center; font-size: 12px; color: rgba(255,255,255,0.32); margin-bottom: 20px; font-family: 'DM Mono', monospace; }

        .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; }
        .stat { background: rgba(255,255,255,0.04); border-radius: 12px; padding: 10px 8px; text-align: center; border: 1px solid rgba(255,255,255,0.05); }
        .stat-value { font-family: 'DM Mono', monospace; font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.85); display: block; margin-bottom: 2px; }
        .stat-label { font-size: 9.5px; font-weight: 500; letter-spacing: 0.07em; text-transform: uppercase; color: rgba(255,255,255,0.28); }

        .samsung-badge { display: flex; align-items: center; margin-bottom: 14px; opacity: 0.3; }
      </style>

      <div class="laundry-card ${appliance}-card" id="card">
        <div class="live-dot"></div>
        
        <div class="samsung-badge">
          <svg width="48" height="10" viewBox="0 0 48 10" fill="none">
            <text x="0" y="9" font-family="sans-serif" font-size="9" font-weight="700" fill="white" letter-spacing="1">SAMSUNG</text>
          </svg>
        </div>

        <div class="card-header">
          <span class="device-name">${title}</span>
          <span class="status-pill status-idle" id="statusPill">Idle</span>
        </div>

        <div class="drum-wrap">
          <svg class="progress-ring" viewBox="0 0 120 120">
            <circle class="progress-track" cx="60" cy="60" r="54" stroke-dasharray="339.3" stroke-dashoffset="0"/>
            <circle class="progress-fill" id="progressRing" cx="60" cy="60" r="54" stroke-dasharray="339.3" stroke-dashoffset="339.3"/>
          </svg>
          <div class="drum">
            <div class="drum-inner">
              <span class="drum-icon" id="drumIcon">${appliance === 'washer' ? '🫧' : '🔥'}</span>
            </div>
          </div>
        </div>

        <div class="cycle-label" id="cycleName">Smart Control</div>
        <div class="cycle-sub" id="timeRemaining">Ready</div>

        <div class="stats">
          <div class="stat">
            <span class="stat-value" id="energyVal">-- kWh</span>
            <span class="stat-label">Energy</span>
          </div>
          <div class="stat">
            <span class="stat-value" id="tempVal">--</span>
            <span class="stat-label">Temp / Status</span>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('samsung-laundry-card', SamsungLaundryCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "samsung-laundry-card",
  name: "Samsung Laundry Card",
  description: "A custom animated card for Samsung Washers and Dryers"
});
