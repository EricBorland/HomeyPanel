// HomeyCloudAPI Object declaration
declare const AthomCloudAPI: any;

import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// TODO Properly store this Homey Secrets
const CLIENT_ID = '5cbb504da1fc782009f52e46';
const CLIENT_SECRET = 'gvhs0gebgir8vz8yo2l0jfb49u9xzzhrkuo1uvs8';
const REDIRECT_URL = 'https://homey.ink/login.html';
const TOKEN = 'eyJfX2F0aG9tX2FwaV90eXBlIjoiQXRob21DbG91ZEFQSS5Ub2tlbiIsInRva2VuX3R5cGUiOiJiZWFyZXIiLCJhY2Nlc3NfdG9rZW4iOiIwMTQ2YjQ5YTA1MWY0ZDU0NWI5ODAxOTU2YTAxOTRjYTM2NzcyMDFkIiwiZXhwaXJlc19hdCI6IjIwMTktMTItMjhUMTE6MTY6MTkuOTU0WiIsInJlZnJlc2hfdG9rZW4iOiI2NDYzMzEzYWM2MGUxOGY1MzI2NDk5ODkxZTE3MjBlMzViODQzMDk1In0%3D';

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

  async connect() {
    this.api = new AthomCloudAPI({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      redirectUrl: REDIRECT_URL
    });
  }

  async login() {
    if (!this.api) {
      throw new Error('You must connect first');
    }
    // TODO instead of using TOKEN perform a real login
    this.TOKEN = this.route.snapshot.queryParamMap.get('token') || TOKEN;
    this.api.setToken(JSON.parse(atob(decodeURIComponent(this.TOKEN))));
    const logged = await this.api.isLoggedIn();
    if (!logged) {
      throw new Error('User not logged in');
    }
    this.user = await this.api.getAuthenticatedUser();
  }

  async getUser() {
    if (!this.user) {
      throw new Error('User not logged in');
    }
    return this.user;
  }

  async getHomeys() {
    if (!this.user) {
      throw new Error('User not logged in');
    }
    return this.user.homeys;
  }

  async getHomey() {
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
