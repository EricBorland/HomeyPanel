// HomeyCloudAPI Object declaration
declare const AthomCloudAPI: any;

import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

const MAX_LISTENERS = 100;

export interface HomeyCredentials {
  id: string;
  secret: string;
  url: string;
  token: string;
};

@Injectable({
  providedIn: 'root'
})
export class HomeyApiService {
  private TOKEN: string;
  private api;
  private user;
  private homey;
  private zones;
  private devices;

  constructor(private route: ActivatedRoute) { }

  async connect(credentials: HomeyCredentials) {
    this.api = new AthomCloudAPI({
      clientId: credentials.id,
      clientSecret: credentials.secret,
      redirectUrl: credentials.url
    });
    this.TOKEN = credentials.token;
  }

  async login() {
    if (!this.api) {
      throw new Error('You must connect first');
    }
    // TODO instead of using TOKEN perform a real login
    this.api.setToken(JSON.parse(atob(decodeURIComponent(this.TOKEN))));
    const logged = await this.api.isLoggedIn();
    if (!logged) {
      throw new Error('User not logged in');
    }
    this.user = await this.api.getAuthenticatedUser();
  }

  getUser() {
    if (!this.user) {
      throw new Error('User not logged in');
    }
    return this.user;
  }

  getHomeys() {
    if (!this.user) {
      throw new Error('User not logged in');
    }
    return this.user.homeys;
  }

  getHomey() {
    this.requireHomey();
    return this.homey;
  }

  async setHomey(homey) {
    this.homey = await homey.authenticate();
    return await this.sync();
  }

  async syncZones() {
    this.requireHomey();
    this.zones = await this.homey.zones.getZones();
    return this.zones;
  }

  async getZones() {
    if (!this.zones) {
      await this.syncZones();
    }
    return this.zones;
  }

  async syncDevices() {
    this.requireHomey();
    this.devices = await this.homey.devices.getDevices();
    this.homey.devices.setMaxListeners(MAX_LISTENERS);
    this.addDevicesListeners(this.devices);
    return this.devices;
  }

  async getDevices() {
    if (!this.devices) {
      await this.syncDevices();
    }
    return this.devices;
  }

  async sync() {
    await this.syncZones();
    await this.syncDevices();
  }

  addDevicesListeners(devices) {
    for (const id in devices) {
      const device = devices[id];
      device.setMaxListeners(MAX_LISTENERS);
      if (device.ui && device.ui.quickAction) {
        device.makeCapabilityInstance(device.ui.quickAction);
      }
      device.capabilities.forEach(capability => {
        try {
          device.makeCapabilityInstance(capability);
        } catch (e) {
          console.log('Warning', e);
        }
      });
    }
  }

  requireHomey() {
    if (!this.homey) {
      throw new Error('Homey not selected');
    }
  }
}
