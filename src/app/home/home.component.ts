import { Component, OnInit } from '@angular/core';
declare const AthomCloudAPI: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  CLIENT_ID = '5cbb504da1fc782009f52e46';
  CLIENT_SECRET = 'gvhs0gebgir8vz8yo2l0jfb49u9xzzhrkuo1uvs8';
  REDIRECT_URL = 'https://homey.ink/login.html';
  TOKEN = 'eyJfX2F0aG9tX2FwaV90eXBlIjoiQXRob21DbG91ZEFQSS5Ub2tlbiIsInRva2VuX3R5cGUiOiJiZWFyZXIiLCJhY2Nlc3NfdG9rZW4iOiIwMTQ2YjQ5YTA1MWY0ZDU0NWI5ODAxOTU2YTAxOTRjYTM2NzcyMDFkIiwiZXhwaXJlc19hdCI6IjIwMTktMTItMjhUMTE6MTY6MTkuOTU0WiIsInJlZnJlc2hfdG9rZW4iOiI2NDYzMzEzYWM2MGUxOGY1MzI2NDk5ODkxZTE3MjBlMzViODQzMDk1In0%3D';
  api: any;
  user: any;
  homey: any;
  zoneDevices: any;

  async ngOnInit() {
    await this.connect();
    this.homey = await this.user.homeys[0].authenticate();
    this.zoneDevices = await this.getDevicesByZone(this.homey);
  }

  async connect() {
    this.api = new AthomCloudAPI({
      clientId: this.CLIENT_ID,
      clientSecret: this.CLIENT_SECRET,
      redirectUrl: this.REDIRECT_URL
    });
    this.api.setToken(JSON.parse(atob(decodeURIComponent(this.TOKEN))));
    const logged = await this.api.isLoggedIn();
    if (!logged) {
      console.log('NOT LOGGED IN!');
      return;
    }
    this.user = await this.api.getAuthenticatedUser();
  }

  async getDevicesByZone(homey) {
    const devices = await homey.devices.getDevices();
    const zones = await homey.zones.getZones();
    const zoneDevices = {};
    for (const id in devices) {
      const device = devices[id];
      zoneDevices[device.zone] = zoneDevices[device.zone] || {
        id: device.zone,
        name: zones[device.zone].name,
        parent: zones[device.zone].parent
      };
      const zone = zoneDevices[device.zone]
      zone.devices = zone.devices || [];
      zone.devices.push({
        id: id,
        name: device.name,
        icon: this.getIcon(device),
        settings: device.settings,
        class: device.class,
        virtualClass: device.virtualClass,
        capabilities: device.capabilitiesObj,
        ui: device.ui
      });
      if (device.ui.quickAction) {
        device.makeCapabilityInstance(device.ui.quickAction, () => {});
      }
      if (this.isActionable(device)) {
        zone.devices[zone.devices.length - 1].actionable = true;
      }
      if (device.capabilities.includes('measure_temperature')) {
        device.makeCapabilityInstance('measure_temperature', () => {});
        // TODO Average along all temperature meters in the same room
        zone.temperature = {
          value: device.capabilitiesObj.measure_temperature.value,
          unit: device.capabilitiesObj.measure_temperature.units
        }
      }
    }
    console.log(zoneDevices);
    return Object.values(zoneDevices);
  }

  isActionable(device): boolean {
    return device.capabilities.includes('onoff') || device.capabilities.includes('button') || device.capabilities.includes('dim');
  }

  getIcon(device) {
    console.log(device.virtualClass || device.class);
    if (device.name === 'Fireplace') {
      return 'heating-022-fireplace';
    }
    console.log(device.name, device.name === '3x USB Port');
    if (device.name === '3x USB Port') {
      console.log('returning usb');
      return 'mdi-usb';
    }
    if (device.name === 'Water') {
      return 'home-living-055-hose';
    }
    switch (device.virtualClass || device.class) {
      case 'light':
        return 'lighting-025-lamp';
      case 'blinds':
        return 'home-living-052-blinds';
      case 'socket':
        return 'home-living-053-socket';
      case 'heater':
        return 'heating-001-heater';
      case 'tv':
        return 'home-living-043-television';
      case 'homealarm':
        return 'mdi-alarm-light-outline';
      case 'button':
        return 'home-living-051-teapot';
    }
  }

  async toggle(event) {
    await this.homey.devices.setCapabilityValue({
      deviceId: event.device.id,
      capabilityId: event.capability || event.device.ui.quickAction,
      value: event.value || !event.device.capabilities.onoff.value
    });
  }

}
