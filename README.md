# 🧺 Samsung Laundry Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/robman2026/laundry-room-card)
[![HA](https://img.shields.io/badge/Home%20Assistant-2023.1+-green)](https://home-assistant.io)
[![license](https://img.shields.io/badge/license-MIT-lightgrey)](LICENSE)

A polished, animated Lovelace card for your **Samsung SmartThings Washer & Dryer** — featuring a spinning drum animation, progress ring, live cycle info, and real-time sensor stats. No extra plugins required.

---

## ✨ Features

- 🥁 **Animated spinning drum** — rotates while the machine is running
- 🔵🟠 **Color-coded progress ring** — blue for washer, orange for dryer
- 💊 **Live status pill** — Stopped / Running / Drying / Paused / Done
- 📊 **Sensor stats grid** — temp, spin, power, energy, water consumption, job state
- 👕 **Wrinkle Prevent toggle** — tap to toggle directly from the card
- ℹ️ **Details button** — opens the entity's more-info dialog
- 🎨 **Dark design** — looks great on any HA dashboard
- ⚙️ **Visual editor** — configure all entities from the card editor UI, no YAML needed
- 📱 **Responsive** — stacks on mobile, side-by-side on desktop

---

## 📸 Preview

> <img width="418" alt="image" src="https://github.com/user-attachments/assets/908d6833-3d69-40bd-8383-c26b0bfac0c6" />



---

## 📦 Installation

### Option 1 — HACS (recommended)

1. Open **HACS → Frontend → ⋮ → Custom repositories**
2. Add URL: `https://github.com/robman2026/Laundry-Room-Card`
3. Category: **Dashboard**
4. Click **Add**, then search for **Samsung Laundry Card** and install it
5. Hard-reload your browser (`Ctrl+Shift+R`)

### Option 2 — Manual

1. Download [`samsung-laundry-card.js`](https://github.com/robman2026/Laundry-Room-Card/releases/latest)
2. Copy to `/config/www/samsung-laundry-card.js`
3. Go to **Settings → Dashboards → Resources → Add resource**:
   ```
   URL:  /local/samsung-laundry-card.js
   Type: JavaScript module
   ```
4. Hard-reload your browser (`Ctrl+Shift+R`)

---

## ⚙️ Configuration

### Using the visual editor

After adding the card, click **✏️ Edit** and use the entity pickers to configure each sensor.

### YAML configuration

```yaml
type: custom:samsung-laundry-card

# Washer entities
washer_machine_state:     sensor.laundry_room_washer_machine_state
washer_completion_time:   sensor.laundry_room_washer_completion_time
washer_current_course:    sensor.laundry_room_washer_current_course
washer_water_temperature: select.laundry_room_washer_water_temperature
washer_spin_level:        select.laundry_room_washer_spin_level
washer_power:             sensor.laundry_room_washer_power
washer_energy:            sensor.laundry_room_washer_energy
washer_water_consumption: sensor.laundry_room_washer_water_consumption
washer_job_state:         sensor.laundry_room_washer_job_state

# Dryer entities
dryer_machine_state:    sensor.dryer_machine_state
dryer_completion_time:  sensor.dryer_completion_time
dryer_current_course:   sensor.dryer_current_course
dryer_energy:           sensor.dryer_energy
dryer_power:            sensor.dryer_power
dryer_job_state:        sensor.dryer_job_state
dryer_wrinkle_prevent:  switch.dryer_wrinkle_prevent

# Show/hide individual cards (optional, default: true)
show_washer: true
show_dryer: true
```

### Show only one device

```yaml
type: custom:samsung-laundry-card
show_washer: true
show_dryer: false
washer_machine_state: sensor.laundry_room_washer_machine_state
# ... rest of washer entities
```

---

## 🔌 Entity Reference

### Washer

| Config key | Typical entity | Description |
|---|---|---|
| `washer_machine_state` | `sensor.*_machine_state` | Main state: run / pause / end / Stopped |
| `washer_completion_time` | `sensor.*_completion_time` | When the cycle ends |
| `washer_current_course` | `sensor.*_current_course` | Cycle name (e.g. Cotton Normal) |
| `washer_water_temperature` | `select.*_water_temperature` | Wash temperature |
| `washer_spin_level` | `select.*_spin_level` | Spin speed |
| `washer_power` | `sensor.*_power` | Live power draw (W) |
| `washer_energy` | `sensor.*_energy` | Total energy (kWh) |
| `washer_water_consumption` | `sensor.*_water_consumption` | Total water used (L) |
| `washer_job_state` | `sensor.*_job_state` | Job state detail |

### Dryer

| Config key | Typical entity | Description |
|---|---|---|
| `dryer_machine_state` | `sensor.*_machine_state` | Main state: run / pause / end / Stopped |
| `dryer_completion_time` | `sensor.*_completion_time` | When the cycle ends |
| `dryer_current_course` | `sensor.*_current_course` | Cycle name |
| `dryer_energy` | `sensor.*_energy` | Total energy (kWh) |
| `dryer_power` | `sensor.*_power` | Live power draw (W) |
| `dryer_job_state` | `sensor.*_job_state` | Job state detail |
| `dryer_wrinkle_prevent` | `switch.*_wrinkle_prevent` | Wrinkle prevent toggle |

> **Finding your entity IDs:** Go to **Settings → Devices & Services → SmartThings → your device** to see all exposed entities, or use **Developer Tools → States** and search for your device name.

---

## 🖥️ Compatibility

| | |
|---|---|
| Home Assistant | 2023.1+ |
| HACS | 1.0+ |
| Devices | Mobile & Desktop |
| Dependencies | None — fully standalone |
| Browsers | Chrome, Firefox, Safari, Edge |

---

## 📋 Changelog

### v1.0.0
- 🚀 Initial release
- Washer & Dryer cards with animated drum and progress ring
- Live status pill, stats grid, wrinkle prevent toggle
- Visual editor with entity pickers

---

## 📄 License

MIT License — free to use, modify, and distribute.  
If you find this useful, please ⭐ **star the repo**!
