import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { ColorGradient, COLORS } from './color-gradient.class';

const FIVE_MINUTES = 5 * 60 * 1000;

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  // TODO Configurable API KEY
  // TODO Get Location from Homey
  temperatureColor: ColorGradient;

  temperatureData: ChartDataSets[] = [{
    data: [],
    label: 'Temperature (ºC)',
    backgroundColor: COLORS.BACKGROUND,
    pointBorderColor: COLORS.TRANSPARENT,
    pointBackgroundColor: COLORS.TRANSPARENT
  }];
  temperatureLabels: Label[];
  temperatureOptions: ChartOptions = {
    responsive: true,
    aspectRatio: 3.5,
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        ticks: {
          stepSize: 5
        }
      }],
      xAxes: [{
        display: false
      }]
    }
  };
  rainData: ChartDataSets[] = [{
    data: [],
    label: 'Rain (%)',
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.BACKGROUND,
    pointBorderColor: COLORS.TRANSPARENT,
    pointBackgroundColor: COLORS.TRANSPARENT
  }];
  rainLabels: Label[];
  rainOptions: ChartOptions = {
    responsive: true,
    aspectRatio: 3.5,
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        ticks: {
          min: 0,
          max: 100,
          stepSize: 33
        }
      }],
      xAxes: [{
        display: false
      }]
    }
  };

  constructor(private http: HttpClient) {
    this.temperatureColor = new ColorGradient(COLORS.COLD, COLORS.HOT, {
      min: -5,
      max: 35
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  async refresh(): Promise<void> {
    const weather = await this.getData();
    const tempCanvas = (document.getElementById('tempCanvas') as HTMLCanvasElement).getContext('2d');
    const temperatureGradient = tempCanvas.createLinearGradient(30, 0, tempCanvas.canvas.offsetWidth, 0);
    const hours = [];
    const tempData = [];
    const rainData = [];
    weather.hourly.data.forEach((row, index) => {
      // Labels
      hours.push(new Date(row.time * 1000).getHours());
      // Temperature data & gradient
      tempData.push(this.convertTemperature(row.temperature));
      temperatureGradient.addColorStop(index / weather.hourly.data.length, this.temperatureColor.findPoint(tempData[tempData.length - 1]).toRGBString());
      // Rain
      rainData.push(row.precipProbability * 100);
    });
    this.temperatureLabels = hours;
    this.temperatureData[0].data = tempData;
    this.temperatureData[0].borderColor = temperatureGradient;
    this.rainLabels = hours;
    this.rainData[0].data = rainData;
    // Refresh after 5 mins
    setTimeout(this.refresh.bind(this), FIVE_MINUTES);
  }

  getData(): Promise<any> {
    return this.http.get('/weather').toPromise();
  }

  convertTemperature(temperature): number {
    // TODO Add settings to choose the temperature Unit
    // eslint-disable-next-line no-constant-condition
    if (false) {
      return temperature;
    }
    return parseFloat(((temperature - 32 ) * 5 / 9).toFixed(2));
  }

}
