import { Injectable } from '@angular/core';
import { HomeyApiService, HomeyCredentials, CHART_SLIDER as CS, UNIT_PERCENT as UP, UI_SLIDER as US } from './homey-api.service';

export const CHART_SLIDER = CS;
export const UNIT_PERCENT = UP;
export const UI_SLIDER = US;

/* Global Settings */
export enum ConnexionTypes {
  Cloud = 'CLOUD',
  Local = 'LOCAL'
}

export interface DarkSkySettings {
  apiKey: string;
  location: string;
}

export interface HomeySettings {
  type: ConnexionTypes;
  credentials?: HomeyCredentials;
  ip?: string;
}

export interface GlobalSettings {
  homey: HomeySettings;
  darkSky: DarkSkySettings;
}

/* Panel Settings */
export interface PanelSettings {
  icon: string;
  info?: string[];
}

export interface PanelDevice {
  id: string;
  settings: PanelSettings;
  loading?: boolean;
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

export interface CurrentDevice {
  type: string;
  index: number;
  device: any;
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
  settings;
  zones;
  devices;
  panelZones: PanelZone[];

  constructor(private homeyAPI: HomeyApiService) {
    const settings = localStorage.getItem('settings') || '{}';
    const savedZones = localStorage.getItem('panelZones') || '[]';
    this.settings = JSON.parse(settings);
    this.panelZones = JSON.parse(savedZones);
  }

  async init(): Promise<void> {
    if (!this.settings.homey || !this.settings.homey.credentials) {
      throw new Error('Homey credentials must be provided!');
    }
    await this.homeyAPI.connect(this.settings.homey.credentials);
    await this.homeyAPI.login();
    const homeys = await this.homeyAPI.getHomeys();
    // TODO Allow users with multiple homeys to select the desired one
    await this.homeyAPI.setHomey(homeys[0]);
    await this.sync();
  }

  async sync(): Promise<void> {
    // TODO Build panelZones as a recursive function to allow zones inside zones
    // Get current devices and zones from Homey
    this.zones = await this.homeyAPI.getZones();
    this.devices = await this.homeyAPI.getDevices();
    const parsedDevices = {};
    for (const id in this.devices) {
      const device = this.devices[id];
      parsedDevices[device.zone] = parsedDevices[device.zone] || {};
      parsedDevices[device.zone][id] = true;
      // Initialize zone
      const zone = (this.panelZones || [] as any).find(zone => zone.id === device.zone) || {
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
        },
        // TODO allow users to change devices type to be shown
        type: 'action'
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
    this.cleanRemovedDevices(parsedDevices);
  }

  cleanRemovedDevices(parsedDevices): void {
    this.panelZones.forEach(zone => {
      for (const type in zone.devices) {
        for (let  i = zone.devices[type].length - 1; i >= 0; --i) {
          const device = zone.devices[type][i];
          if (!parsedDevices[zone.id][device.id]) {
            zone.devices[type].splice(i, 1);
          }
        }
      }
    });
  }

  getDeviceType(device): string {
    // TODO Allow multiple types per device
    if (device.capabilities.includes('onoff') || device.capabilities.includes('button') || device.capabilities.includes('dim')) {
      return 'action';
    } else if (device.capabilities.includes('measure_temperature') || device.capabilities.includes('target_temperature')) {
      return 'temperature';
    } else if (device.capabilities.find(capability => capability.includes('alarm'))) {
      return 'alarm';
    }
  }

  // TODO Find device in other zones and types to keep the settings
  findCurrentDevice(deviceId, zone): void | CurrentDevice {
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

  getZoneTemperature(zoneId): number {
    const zone = (this.panelZones || []).find(zone => zone.id === zoneId);
    if (!zone || !zone.devices || !zone.devices.temperature || !zone.devices.temperature.length) {
      return NaN;
    }
    let temp = 0;
    zone.devices.temperature.forEach(device => temp += this.devices[device.id].capabilitiesObj['measure_temperature'].value);
    return temp / zone.devices.temperature.length;
  }

  getPanelZones(): PanelZone[] {
    return this.panelZones;
  }

  getZones(): any {
    return this.zones;
  }

  getDevices(): any {
    return this.devices;
  }

  getSettings(): GlobalSettings {
    return this.settings;
  }

  save(collection, item): void {
    this[collection] = item;
    localStorage.setItem(collection, JSON.stringify(item));
  }

  async setCapability(device, panelDevice, capabilityId?: string, value?: number | boolean): Promise<void> {
    const homey = this.homeyAPI.getHomey();
    panelDevice.loading = true;
    if (typeof value === 'undefined') {
      value = !device.capabilitiesObj[capabilityId || device.ui.quickAction].value;
    }
    try {
      await homey.devices.setCapabilityValue({
        deviceId: device.id,
        capabilityId: capabilityId || device.ui.quickAction,
        value: value
      });
      panelDevice.loading = false;
    } catch(e) {
      // TODO Show error toast
      panelDevice.loading = false;
    }
  }
}
