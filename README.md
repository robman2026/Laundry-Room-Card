# Laundry Card

A custom Home Assistant Lovelace card that displays your washer and dryer as a front-panel appliance — complete with a porthole, spinning drum, progress arc, and brand-specific design.

## Features

- 🎨 **5 brand themes**: Samsung, LG, Bosch, Siemens, Miele — body colour, porthole style and panel design all adapt
- 🫧 **Washer**: animated spinning drum, rising bubbles, blue glow when running
- 🔥 **Dryer**: perforated metal drum, heat wave animation, orange glow when running
- 📊 **6 configurable stat tiles** per machine
- 🕐 **Last run date/time** shown when stopped or done
- 📱 **Responsive**: side-by-side on desktop, stacked on mobile
- ⚙️ **Visual editor** with brand-specific entity hints
- 🔄 **Backward-compatible** with v1.x config keys

## Installation via HACS

1. In HACS → Custom repositories → add `https://github.com/robman2026/Laundry-Room-Card`
2. Install **Laundry Card**
3. Add resource: `/local/laundry-card.js` (type: JavaScript Module)

## Quick Start (YAML)

```yaml
type: custom:laundry-card
brand: samsung
washer_machine_state: sensor.laundry_room_washer_machine_state
washer_completion_time: sensor.laundry_room_washer_completion_time
washer_water_temperature: select.laundry_room_washer_water_temperature
washer_spin_level: select.laundry_room_washer_spin_level
washer_power: sensor.em_laundry_power_a
washer_energy: sensor.laundry_room_washer_energy
washer_water_consumption: sensor.laundry_room_washer_water_consumption
washer_job_state: sensor.laundry_room_washer_job_state
dryer_machine_state: sensor.dryer_machine_state
dryer_completion_time: sensor.dryer_completion_time
dryer_energy: sensor.dryer_energy
dryer_power: sensor.em_laundry_power_a
dryer_job_state: sensor.dryer_job_state
```

## Supported Brands

| Brand | Entity hints | Design |
|-------|-------------|--------|
| Samsung | `machine_state`, `completion_time`, `spin_level`, `water_temperature` | White body, black rubber ring |
| LG | `run_state`, `remain_time`, `spin`, `temp_control` | Dark graphite body |
| Bosch/Siemens | `operation_state`, `finish_in_relative`, `spin_speed` | White body, blue knob ring |
| Miele | `status`, `remaining_time`, `spin_speed` | Premium white, thick chrome ring |
| Generic | Any sensor | Samsung-style design |

## Configuration Options

| Key | Type | Description |
|-----|------|-------------|
| `brand` | string | `samsung` `lg` `bosch` `siemens` `miele` `generic` |
| `show_washer` | bool | Show washer panel (default: true) |
| `show_dryer` | bool | Show dryer panel (default: true) |
| `frosted_glass` | bool | Frosted glass effect |
| `frosted_opacity` | float | Glass opacity 0.1–0.9 |
| `frosted_blur` | int | Blur strength 4–40px |
| `washer_label` | string | Custom washer name |
| `dryer_label` | string | Custom dryer name |
