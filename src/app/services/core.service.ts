import { Injectable } from '@angular/core';
import { HomeyApiService } from './homey-api.service';

export interface PanelSettings {
  icon: string;
  info?: string[];
}

export interface PanelDevice {
  id: string;
  settings: PanelSettings;
}

export interface PanelZoneDevices {
  action: PanelDevice[];
  alarm: PanelDevice[];
  temperature: PanelDevice[];
}

export interface PanelZone {
  id: string;
  settings: PanelSettings;
  devices: PanelZoneDevices;
  new?: boolean;
}

const DEFAULT_ICONS = {
  DEFAULT_ZONE: '',
  DEFAULT_DEVICE: '',
  'action-light': 'lighting-025-lamp',
  'action-blinds': 'home-living-052-blinds',
  'action-socket': 'home-living-053-socket',
  'action-heater': 'heating-001-heater',
  'action-tv': 'home-living-043-television',
  'action-homealarm': 'home-living-056-siren',
  'action.button': ''
};
const DEFAULT_INFO = {
  light: ['dim', 'measure_power'],
  socket: ['measure_power', 'measure_voltage', 'measure_current'],
  blinds: ['windowcoverings_set']
};

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  zones;
  devices;
  panelZones: PanelZone[];

  constructor(private homeyAPI: HomeyApiService) {
    const savedZones = localStorage.getItem('panelZones');
    if (savedZones) {
      this.panelZones = JSON.parse(savedZones);
    }
  }

  async init() {
    await this.homeyAPI.connect();
    await this.homeyAPI.login();
    const homeys = await this.homeyAPI.getHomeys();
    await this.homeyAPI.setHomey(homeys[0]);
    await this.sync();
  }

  async sync() {
    // Get current devices and zones from Homey
    this.zones = await this.homeyAPI.getZones();
    this.devices = await this.homeyAPI.getDevices();
    // Restart the panelZonesMap
    for (const id in this.devices) {
      const device = this.devices[id];
      // Initialize zone
      const zone = <any>(this.panelZones || []).find(zone => zone.id === device.zone) || {
        new: true,
        id: device.zone,
        settings: {
          icon: DEFAULT_ICONS.DEFAULT_ZONE
        },
        devices: {
          action: [],
          alarm: [],
          temperature: [],
          other: []
        }
      };
      // Updating device
      device.type = this.getDeviceType(device) || 'other';
      const current = this.findCurrentDevice(device.id, zone);
      if (!current) {
        // New device found
        zone.devices[device.type].push({
          id: device.id,
          settings: {
            icon: DEFAULT_ICONS[device.type + '-' + (device.virtualClass || device.class)] || DEFAULT_ICONS.DEFAULT_DEVICE,
            info: (DEFAULT_INFO[device.virtualClass || device.class] || []).filter(info => device.capabilitiesObj[info])
          }
        });
      } else if (current) {
        if (current.type !== device.type) {
          // Device has changed it's type
          zone.devices[device.type].push({
            id: device.id,
            settings: current.device.settings
          });
          zone.devices[current.type].splice(current.index, 1);
        } else {
          // Already existing device
        }
      }
      // Set getTemperatureMethod
      if (zone.devices.temperature.length) {
        zone.getTemperature = this.getZoneTemperature.bind(this, zone.id);
      }
      if (zone.new) {
        delete zone.new;
        this.panelZones.push(zone);
      }
    }
  }

  getDeviceType(device) {
    // TODO Allow multiple types per device
    if (device.capabilities.includes('onoff') || device.capabilities.includes('button') || device.capabilities.includes('dim')) {
      return 'action';
    } else if (device.capabilities.includes('measure_temperature') || device.capabilities.includes('target_temperature')) {
      return 'temperature';
    } else if (device.capabilities.find(capability => capability.includes('alarm'))) {
      return 'alarm';
    }
  }

  // TODO Find device in other zones also and handle device zone changes
  findCurrentDevice(deviceId, zone) {
    if (!zone) {
      return;
    }
    const actionIndex = (zone.devices && zone.devices.action || []).findIndex(device => device.id === deviceId);
    if (actionIndex !== -1) {
      return {
        type: 'action',
        index: actionIndex,
        device: zone.devices.action[actionIndex]
      };
    }
    const alarmIndex = (zone.devices && zone.devices.alarm || []).findIndex(device => device.id === deviceId);
    if (alarmIndex !== -1) {
      return {
        type: 'alarm',
        index: alarmIndex,
        device: zone.devices.alarm[alarmIndex]
      };
    }
    const temperatureIndex = (zone.devices && zone.devices.temperature || []).findIndex(device => device.id === deviceId);
    if (temperatureIndex !== -1) {
      return {
        type: 'temperature',
        index: temperatureIndex,
        device: zone.devices.temperature[temperatureIndex]
      };
    }
  }

  getZoneTemperature(zoneId) {
    const zone = (this.panelZones || []).find(zone => zone.id === zoneId);
    if (!zone || !zone.devices || !zone.devices.temperature || !zone.devices.temperature.length) {
      return NaN;
    }
    let temp = 0;
    zone.devices.temperature.forEach(device => temp += this.devices[device.id].capabilitiesObj['measure_temperature'].value);
    return temp / zone.devices.temperature.length;
  }

  getDevicesByZone() {
    return this.panelZones;
  }

  getZones() {
    return this.zones;
  }

  getDevices() {
    return this.devices;
  }

  save(collection, item) {
    localStorage.setItem(collection, JSON.stringify(item));
  }
}
