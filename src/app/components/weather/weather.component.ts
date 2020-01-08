import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { RGBColor, ColorGradient, COLORS } from './color-gradient.class';

const FIVE_MINUTES = 5 * 60 * 1000;

const weatherInfo = '{"latitude":41.59128,"longitude":2.3147713,"timezone":"Europe/Madrid","currently":{"time":1578468511,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":43.63,"apparentTemperature":41.58,"dewPoint":37.59,"humidity":0.79,"pressure":1030.9,"windSpeed":3.93,"windGust":4.39,"windBearing":352,"cloudCover":0.63,"uvIndex":0,"visibility":10,"ozone":318.7},"hourly":{"summary":"Clear throughout the day.","icon":"clear-day","data":[{"time":1578466800,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":43.04,"apparentTemperature":40.97,"dewPoint":37.13,"humidity":0.8,"pressure":1030.6,"windSpeed":3.84,"windGust":4,"windBearing":356,"cloudCover":0.63,"uvIndex":0,"visibility":10,"ozone":318.6},{"time":1578470400,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":44.53,"apparentTemperature":42.56,"dewPoint":38.17,"humidity":0.78,"pressure":1031.2,"windSpeed":3.98,"windGust":4.88,"windBearing":348,"cloudCover":0.61,"uvIndex":0,"visibility":10,"ozone":318.8},{"time":1578474000,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":47.22,"apparentTemperature":45.85,"dewPoint":39.46,"humidity":0.74,"pressure":1031.6,"windSpeed":3.76,"windGust":5.53,"windBearing":346,"cloudCover":0.6,"uvIndex":0,"visibility":10,"ozone":318.9},{"time":1578477600,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":51.08,"apparentTemperature":51.08,"dewPoint":40.82,"humidity":0.68,"pressure":1031.7,"windSpeed":3.19,"windGust":4.96,"windBearing":4,"cloudCover":0.61,"uvIndex":1,"visibility":10,"ozone":318.4},{"time":1578481200,"summary":"Clear","icon":"clear-day","precipIntensity":0,"precipProbability":0,"temperature":55.48,"apparentTemperature":55.48,"dewPoint":40.91,"humidity":0.58,"pressure":1031.4,"windSpeed":2.63,"windGust":3.81,"windBearing":284,"cloudCover":0.22,"uvIndex":1,"visibility":10,"ozone":317.7},{"time":1578484800,"summary":"Clear","icon":"clear-day","precipIntensity":0,"precipProbability":0,"temperature":58.57,"apparentTemperature":58.57,"dewPoint":41.02,"humidity":0.52,"pressure":1030.9,"windSpeed":2.14,"windGust":3.12,"windBearing":269,"cloudCover":0.24,"uvIndex":2,"visibility":10,"ozone":317.1},{"time":1578488400,"summary":"Clear","icon":"clear-day","precipIntensity":0,"precipProbability":0,"temperature":59.94,"apparentTemperature":59.94,"dewPoint":41.44,"humidity":0.5,"pressure":1030.5,"windSpeed":2.4,"windGust":3.41,"windBearing":166,"cloudCover":0.09,"uvIndex":1,"visibility":10,"ozone":316.7},{"time":1578492000,"summary":"Clear","icon":"clear-day","precipIntensity":0,"precipProbability":0,"temperature":59.93,"apparentTemperature":59.93,"dewPoint":42.21,"humidity":0.52,"pressure":1030.2,"windSpeed":3.22,"windGust":4.18,"windBearing":155,"cloudCover":0.22,"uvIndex":1,"visibility":10,"ozone":316.2},{"time":1578495600,"summary":"Partly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":58.71,"apparentTemperature":58.71,"dewPoint":43.31,"humidity":0.57,"pressure":1030.2,"windSpeed":3.94,"windGust":4.63,"windBearing":138,"cloudCover":0.39,"uvIndex":0,"visibility":10,"ozone":315.8},{"time":1578499200,"summary":"Partly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":56.06,"apparentTemperature":56.06,"dewPoint":43.79,"humidity":0.63,"pressure":1030.3,"windSpeed":3.48,"windGust":4.13,"windBearing":133,"cloudCover":0.42,"uvIndex":0,"visibility":10,"ozone":315},{"time":1578502800,"summary":"Partly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":52.65,"apparentTemperature":52.65,"dewPoint":43.33,"humidity":0.71,"pressure":1030.7,"windSpeed":2.6,"windGust":3.16,"windBearing":112,"cloudCover":0.43,"uvIndex":0,"visibility":10,"ozone":314.4},{"time":1578506400,"summary":"Partly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":50.26,"apparentTemperature":50.26,"dewPoint":42.52,"humidity":0.75,"pressure":1031.1,"windSpeed":1.82,"windGust":2.48,"windBearing":105,"cloudCover":0.36,"uvIndex":0,"visibility":10,"ozone":314.1},{"time":1578510000,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":49.07,"apparentTemperature":49.07,"dewPoint":42.15,"humidity":0.77,"pressure":1031,"windSpeed":1.77,"windGust":2.39,"windBearing":348,"cloudCover":0.26,"uvIndex":0,"visibility":10,"ozone":314.6},{"time":1578513600,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":48.33,"apparentTemperature":48.33,"dewPoint":41.76,"humidity":0.78,"pressure":1031.2,"windSpeed":2.81,"windGust":2.84,"windBearing":348,"cloudCover":0.27,"uvIndex":0,"visibility":10,"ozone":315.5},{"time":1578517200,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":47.08,"apparentTemperature":46.27,"dewPoint":41,"humidity":0.79,"pressure":1031.2,"windSpeed":3.11,"windGust":3.27,"windBearing":328,"cloudCover":0.2,"uvIndex":0,"visibility":10,"ozone":315.9},{"time":1578520800,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":46.06,"apparentTemperature":45.02,"dewPoint":40.52,"humidity":0.81,"pressure":1031.2,"windSpeed":3.2,"windGust":3.45,"windBearing":322,"cloudCover":0.21,"uvIndex":0,"visibility":10,"ozone":315.4},{"time":1578524400,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":45.02,"apparentTemperature":43.63,"dewPoint":40.11,"humidity":0.83,"pressure":1030.9,"windSpeed":3.41,"windGust":3.74,"windBearing":326,"cloudCover":0.19,"uvIndex":0,"visibility":10,"ozone":314.5},{"time":1578528000,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":44.27,"apparentTemperature":42.77,"dewPoint":39.82,"humidity":0.84,"pressure":1030.6,"windSpeed":3.43,"windGust":3.83,"windBearing":326,"cloudCover":0.12,"uvIndex":0,"visibility":10,"ozone":313.7},{"time":1578531600,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":43.94,"apparentTemperature":42.4,"dewPoint":39.85,"humidity":0.85,"pressure":1030.3,"windSpeed":3.41,"windGust":3.8,"windBearing":321,"cloudCover":0.13,"uvIndex":0,"visibility":10,"ozone":313},{"time":1578535200,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":43.72,"apparentTemperature":42.16,"dewPoint":40.05,"humidity":0.87,"pressure":1029.8,"windSpeed":3.41,"windGust":3.7,"windBearing":319,"cloudCover":0.11,"uvIndex":0,"visibility":10,"ozone":312.3},{"time":1578538800,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":43.38,"apparentTemperature":41.75,"dewPoint":40.1,"humidity":0.88,"pressure":1029,"windSpeed":3.42,"windGust":3.64,"windBearing":316,"cloudCover":0.09,"uvIndex":0,"visibility":10,"ozone":311.8},{"time":1578542400,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":42.71,"apparentTemperature":41,"dewPoint":39.76,"humidity":0.89,"pressure":1028.8,"windSpeed":3.41,"windGust":3.67,"windBearing":316,"cloudCover":0.09,"uvIndex":0,"visibility":10,"ozone":311.6},{"time":1578546000,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":42.06,"apparentTemperature":40.28,"dewPoint":39.26,"humidity":0.9,"pressure":1028.4,"windSpeed":3.38,"windGust":3.75,"windBearing":302,"cloudCover":0.06,"uvIndex":0,"visibility":10,"ozone":311.5},{"time":1578549600,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":41.76,"apparentTemperature":39.96,"dewPoint":39.03,"humidity":0.9,"pressure":1028.5,"windSpeed":3.37,"windGust":3.8,"windBearing":306,"cloudCover":0.04,"uvIndex":0,"visibility":10,"ozone":311.7},{"time":1578553200,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":42.15,"apparentTemperature":40.38,"dewPoint":39.33,"humidity":0.9,"pressure":1028.9,"windSpeed":3.39,"windGust":3.72,"windBearing":314,"cloudCover":0.03,"uvIndex":0,"visibility":10,"ozone":312.2},{"time":1578556800,"summary":"Clear","icon":"clear-day","precipIntensity":0,"precipProbability":0,"temperature":42.97,"apparentTemperature":41.39,"dewPoint":39.9,"humidity":0.89,"pressure":1029,"windSpeed":3.32,"windGust":3.6,"windBearing":279,"cloudCover":0.04,"uvIndex":0,"visibility":10,"ozone":313},{"time":1578560400,"summary":"Clear","icon":"clear-day","precipIntensity":0,"precipProbability":0,"temperature":45.56,"apparentTemperature":44.36,"dewPoint":41.15,"humidity":0.84,"pressure":1028.9,"windSpeed":3.3,"windGust":3.68,"windBearing":297,"cloudCover":0.01,"uvIndex":0,"visibility":10,"ozone":314},{"time":1578564000,"summary":"Clear","icon":"clear-day","precipIntensity":0,"precipProbability":0,"temperature":49.92,"apparentTemperature":49.41,"dewPoint":42.64,"humidity":0.76,"pressure":1028.6,"windSpeed":3.2,"windGust":4.55,"windBearing":312,"cloudCover":0.01,"uvIndex":1,"visibility":10,"ozone":315.6},{"time":1578567600,"summary":"Clear","icon":"clear-day","precipIntensity":0,"precipProbability":0,"temperature":53.74,"apparentTemperature":53.74,"dewPoint":43.41,"humidity":0.68,"pressure":1027.8,"windSpeed":4.21,"windGust":5.97,"windBearing":208,"cloudCover":0,"uvIndex":2,"visibility":10,"ozone":317.6},{"time":1578571200,"summary":"Clear","icon":"clear-day","precipIntensity":0,"precipProbability":0,"temperature":56.44,"apparentTemperature":56.44,"dewPoint":43.39,"humidity":0.62,"pressure":1027.1,"windSpeed":5,"windGust":7.52,"windBearing":233,"cloudCover":0.02,"uvIndex":2,"visibility":10,"ozone":318.9},{"time":1578574800,"summary":"Clear","icon":"clear-day","precipIntensity":0,"precipProbability":0,"temperature":57.98,"apparentTemperature":57.98,"dewPoint":43.75,"humidity":0.59,"pressure":1026.4,"windSpeed":5.93,"windGust":9.3,"windBearing":234,"cloudCover":0.07,"uvIndex":1,"visibility":10,"ozone":318.9},{"time":1578578400,"summary":"Clear","icon":"clear-day","precipIntensity":0,"precipProbability":0,"temperature":58.18,"apparentTemperature":58.18,"dewPoint":44.48,"humidity":0.6,"pressure":1025.8,"windSpeed":7.03,"windGust":11.18,"windBearing":220,"cloudCover":0.15,"uvIndex":1,"visibility":10,"ozone":318.4},{"time":1578582000,"summary":"Clear","icon":"clear-day","precipIntensity":0,"precipProbability":0,"temperature":57.29,"apparentTemperature":57.29,"dewPoint":45.23,"humidity":0.64,"pressure":1025.3,"windSpeed":7.51,"windGust":12.57,"windBearing":220,"cloudCover":0.26,"uvIndex":0,"visibility":10,"ozone":317.9},{"time":1578585600,"summary":"Clear","icon":"clear-day","precipIntensity":0,"precipProbability":0,"temperature":55.07,"apparentTemperature":55.07,"dewPoint":45.55,"humidity":0.7,"pressure":1025.3,"windSpeed":7.16,"windGust":13.23,"windBearing":221,"cloudCover":0.27,"uvIndex":0,"visibility":10,"ozone":317.8},{"time":1578589200,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":51.8,"apparentTemperature":51.8,"dewPoint":44.77,"humidity":0.77,"pressure":1025.4,"windSpeed":6.34,"windGust":13.38,"windBearing":223,"cloudCover":0.18,"uvIndex":0,"visibility":10,"ozone":317.7},{"time":1578592800,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":49.67,"apparentTemperature":47.35,"dewPoint":44.37,"humidity":0.82,"pressure":1025.5,"windSpeed":5.86,"windGust":13.02,"windBearing":237,"cloudCover":0.17,"uvIndex":0,"visibility":10,"ozone":318},{"time":1578596400,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":48.92,"apparentTemperature":46.59,"dewPoint":44.27,"humidity":0.84,"pressure":1025.4,"windSpeed":5.62,"windGust":11.93,"windBearing":254,"cloudCover":0.17,"uvIndex":0,"visibility":10,"ozone":318.7},{"time":1578600000,"summary":"Partly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":48.23,"apparentTemperature":45.94,"dewPoint":43.87,"humidity":0.85,"pressure":1025.1,"windSpeed":5.33,"windGust":10.3,"windBearing":284,"cloudCover":0.32,"uvIndex":0,"visibility":10,"ozone":319.9},{"time":1578603600,"summary":"Partly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":47.99,"apparentTemperature":45.8,"dewPoint":43.67,"humidity":0.85,"pressure":1024.9,"windSpeed":5.08,"windGust":8.8,"windBearing":272,"cloudCover":0.43,"uvIndex":0,"visibility":10,"ozone":320.9},{"time":1578607200,"summary":"Partly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":47.92,"apparentTemperature":45.81,"dewPoint":43.95,"humidity":0.86,"pressure":1024.8,"windSpeed":4.93,"windGust":7.62,"windBearing":257,"cloudCover":0.53,"uvIndex":0,"visibility":10,"ozone":321.8},{"time":1578610800,"summary":"Partly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":47.79,"apparentTemperature":46.09,"dewPoint":44.44,"humidity":0.88,"pressure":1024.7,"windSpeed":4.31,"windGust":6.55,"windBearing":302,"cloudCover":0.53,"uvIndex":0,"visibility":10,"ozone":322.6},{"time":1578614400,"summary":"Partly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":47.54,"apparentTemperature":45.88,"dewPoint":44.83,"humidity":0.9,"pressure":1024.4,"windSpeed":4.2,"windGust":5.59,"windBearing":278,"cloudCover":0.4,"uvIndex":0,"visibility":10,"ozone":323.5},{"time":1578618000,"summary":"Partly Cloudy","icon":"partly-cloudy-night","precipIntensity":0.0018,"precipProbability":0.13,"precipType":"rain","temperature":49.15,"apparentTemperature":48.43,"dewPoint":45.96,"humidity":0.89,"pressure":1023.9,"windSpeed":3.33,"windGust":4.38,"windBearing":299,"cloudCover":0.43,"uvIndex":0,"visibility":10,"ozone":324},{"time":1578621600,"summary":"Possible Drizzle","icon":"rain","precipIntensity":0.0081,"precipProbability":0.3,"precipType":"rain","temperature":49.27,"apparentTemperature":49.27,"dewPoint":46.46,"humidity":0.9,"pressure":1024,"windSpeed":2.75,"windGust":3.43,"windBearing":7,"cloudCover":0.69,"uvIndex":0,"visibility":10,"ozone":324.4},{"time":1578625200,"summary":"Possible Light Rain","icon":"rain","precipIntensity":0.0187,"precipProbability":0.39,"precipType":"rain","temperature":49.44,"apparentTemperature":49.44,"dewPoint":46.98,"humidity":0.91,"pressure":1024,"windSpeed":2.94,"windGust":3.44,"windBearing":45,"cloudCover":0.89,"uvIndex":0,"visibility":10,"ozone":325.9},{"time":1578628800,"summary":"Possible Light Rain","icon":"rain","precipIntensity":0.0367,"precipProbability":0.5,"precipType":"rain","temperature":49.31,"apparentTemperature":47.53,"dewPoint":47.48,"humidity":0.93,"pressure":1024,"windSpeed":4.8,"windGust":6.34,"windBearing":61,"cloudCover":0.94,"uvIndex":0,"visibility":10,"ozone":328},{"time":1578632400,"summary":"Possible Light Rain","icon":"rain","precipIntensity":0.0641,"precipProbability":0.54,"precipType":"rain","temperature":49.1,"apparentTemperature":45.9,"dewPoint":47.85,"humidity":0.95,"pressure":1024.1,"windSpeed":7.45,"windGust":10.59,"windBearing":87,"cloudCover":0.94,"uvIndex":0,"visibility":7.061,"ozone":331},{"time":1578636000,"summary":"Possible Light Rain","icon":"rain","precipIntensity":0.0783,"precipProbability":0.59,"precipType":"rain","temperature":48.85,"apparentTemperature":44.96,"dewPoint":48.09,"humidity":0.97,"pressure":1024.3,"windSpeed":9.02,"windGust":13.26,"windBearing":81,"cloudCover":0.94,"uvIndex":0,"visibility":4.188,"ozone":336.9},{"time":1578639600,"summary":"Possible Light Rain","icon":"rain","precipIntensity":0.0577,"precipProbability":0.62,"precipType":"rain","temperature":48.46,"apparentTemperature":44.67,"dewPoint":47.61,"humidity":0.97,"pressure":1024.9,"windSpeed":8.54,"windGust":12.94,"windBearing":59,"cloudCover":0.96,"uvIndex":0,"visibility":4.471,"ozone":348.8}]},"daily":{"summary":"Light rain on Friday.","icon":"rain","data":[{"time":1578438000,"summary":"Partly cloudy throughout the day.","icon":"partly-cloudy-day","sunriseTime":1578467880,"sunsetTime":1578501480,"moonPhase":0.43,"precipIntensity":0,"precipIntensityMax":0.0002,"precipIntensityMaxTime":1578463200,"precipProbability":0.03,"temperatureHigh":60.6,"temperatureHighTime":1578490140,"temperatureLow":41.27,"temperatureLowTime":1578549420,"apparentTemperatureHigh":60.1,"apparentTemperatureHighTime":1578490140,"apparentTemperatureLow":39.96,"apparentTemperatureLowTime":1578549420,"dewPoint":38.92,"humidity":0.69,"pressure":1030.4,"windSpeed":3.26,"windGust":5.53,"windGustTime":1578474060,"windBearing":2,"cloudCover":0.32,"uvIndex":2,"uvIndexTime":1578484860,"visibility":10,"ozone":318.8,"temperatureMin":41.21,"temperatureMinTime":1578459360,"temperatureMax":60.6,"temperatureMaxTime":1578490140,"apparentTemperatureMin":39.37,"apparentTemperatureMinTime":1578457980,"apparentTemperatureMax":60.1,"apparentTemperatureMaxTime":1578490140},{"time":1578524400,"summary":"Possible light rain overnight.","icon":"clear-day","sunriseTime":1578554280,"sunsetTime":1578587940,"moonPhase":0.47,"precipIntensity":0,"precipIntensityMax":0.0001,"precipIntensityMaxTime":1578530400,"precipProbability":0.05,"temperatureHigh":58.74,"temperatureHighTime":1578577140,"temperatureLow":46.99,"temperatureLowTime":1578613620,"apparentTemperatureHigh":58.24,"apparentTemperatureHighTime":1578577140,"apparentTemperatureLow":44.67,"apparentTemperatureLowTime":1578639600,"dewPoint":42.24,"humidity":0.8,"pressure":1027.4,"windSpeed":4.62,"windGust":13.39,"windGustTime":1578588480,"windBearing":261,"cloudCover":0.15,"uvIndex":2,"uvIndexTime":1578571020,"visibility":10,"ozone":316.1,"temperatureMin":41.27,"temperatureMinTime":1578549420,"temperatureMax":58.74,"temperatureMaxTime":1578577140,"apparentTemperatureMin":39.96,"apparentTemperatureMinTime":1578549420,"apparentTemperatureMax":58.24,"apparentTemperatureMaxTime":1578577140},{"time":1578610800,"summary":"Light rain in the morning.","icon":"rain","sunriseTime":1578640680,"sunsetTime":1578674400,"moonPhase":0.5,"precipIntensity":0.0151,"precipIntensityMax":0.0784,"precipIntensityMaxTime":1578635760,"precipProbability":0.84,"precipType":"rain","temperatureHigh":56.53,"temperatureHighTime":1578667020,"temperatureLow":42.46,"temperatureLowTime":1578719100,"apparentTemperatureHigh":56.03,"apparentTemperatureHighTime":1578667020,"apparentTemperatureLow":40.64,"apparentTemperatureLowTime":1578718740,"dewPoint":45.48,"humidity":0.86,"pressure":1026,"windSpeed":4.69,"windGust":13.44,"windGustTime":1578637140,"windBearing":14,"cloudCover":0.65,"uvIndex":1,"uvIndexTime":1578657660,"visibility":9.231,"ozone":356.5,"temperatureMin":44.1,"temperatureMinTime":1578697200,"temperatureMax":56.53,"temperatureMaxTime":1578667020,"apparentTemperatureMin":42.46,"apparentTemperatureMinTime":1578697200,"apparentTemperatureMax":56.03,"apparentTemperatureMaxTime":1578667020},{"time":1578697200,"summary":"Clear throughout the day.","icon":"clear-day","sunriseTime":1578727080,"sunsetTime":1578760860,"moonPhase":0.54,"precipIntensity":0.0001,"precipIntensityMax":0.0004,"precipIntensityMaxTime":1578760200,"precipProbability":0.11,"precipType":"rain","temperatureHigh":54.9,"temperatureHighTime":1578750480,"temperatureLow":42.24,"temperatureLowTime":1578793380,"apparentTemperatureHigh":54.4,"apparentTemperatureHighTime":1578750480,"apparentTemperatureLow":39.95,"apparentTemperatureLowTime":1578792420,"dewPoint":42.54,"humidity":0.85,"pressure":1029.7,"windSpeed":3.37,"windGust":5.26,"windGustTime":1578783600,"windBearing":337,"cloudCover":0.05,"uvIndex":2,"uvIndexTime":1578744060,"visibility":10,"ozone":330.7,"temperatureMin":42.46,"temperatureMinTime":1578719100,"temperatureMax":54.9,"temperatureMaxTime":1578750480,"apparentTemperatureMin":40.64,"apparentTemperatureMinTime":1578718740,"apparentTemperatureMax":54.4,"apparentTemperatureMaxTime":1578750480},{"time":1578783600,"summary":"Clear throughout the day.","icon":"clear-day","sunriseTime":1578813480,"sunsetTime":1578847320,"moonPhase":0.57,"precipIntensity":0.0001,"precipIntensityMax":0.0003,"precipIntensityMaxTime":1578794400,"precipProbability":0.07,"precipType":"rain","temperatureHigh":57.35,"temperatureHighTime":1578836520,"temperatureLow":40.74,"temperatureLowTime":1578880320,"apparentTemperatureHigh":56.85,"apparentTemperatureHighTime":1578836520,"apparentTemperatureLow":38.46,"apparentTemperatureLowTime":1578879540,"dewPoint":39.09,"humidity":0.75,"pressure":1030,"windSpeed":3.82,"windGust":5.53,"windGustTime":1578788100,"windBearing":327,"cloudCover":0.12,"uvIndex":2,"uvIndexTime":1578830400,"visibility":10,"ozone":297.5,"temperatureMin":42.24,"temperatureMinTime":1578793380,"temperatureMax":57.35,"temperatureMaxTime":1578836520,"apparentTemperatureMin":39.95,"apparentTemperatureMinTime":1578792420,"apparentTemperatureMax":56.85,"apparentTemperatureMaxTime":1578836520},{"time":1578870000,"summary":"Mostly cloudy throughout the day.","icon":"partly-cloudy-day","sunriseTime":1578899820,"sunsetTime":1578933780,"moonPhase":0.61,"precipIntensity":0.0001,"precipIntensityMax":0.0003,"precipIntensityMaxTime":1578884400,"precipProbability":0.03,"precipType":"rain","temperatureHigh":56.54,"temperatureHighTime":1578923340,"temperatureLow":39.38,"temperatureLowTime":1578964800,"apparentTemperatureHigh":56.04,"apparentTemperatureHighTime":1578923340,"apparentTemperatureLow":35.82,"apparentTemperatureLowTime":1578962220,"dewPoint":34.67,"humidity":0.67,"pressure":1025.6,"windSpeed":5.08,"windGust":8.5,"windGustTime":1578935520,"windBearing":276,"cloudCover":0.52,"uvIndex":2,"uvIndexTime":1578916440,"visibility":10,"ozone":309.2,"temperatureMin":40.32,"temperatureMinTime":1578956400,"temperatureMax":56.54,"temperatureMaxTime":1578923340,"apparentTemperatureMin":36.88,"apparentTemperatureMinTime":1578956400,"apparentTemperatureMax":56.04,"apparentTemperatureMaxTime":1578923340},{"time":1578956400,"summary":"Partly cloudy throughout the day.","icon":"partly-cloudy-day","sunriseTime":1578986220,"sunsetTime":1579020300,"moonPhase":0.65,"precipIntensity":0.0001,"precipIntensityMax":0.0004,"precipIntensityMaxTime":1578960000,"precipProbability":0.04,"precipType":"rain","temperatureHigh":58.17,"temperatureHighTime":1579009980,"temperatureLow":41.48,"temperatureLowTime":1579053240,"apparentTemperatureHigh":57.67,"apparentTemperatureHighTime":1579009980,"apparentTemperatureLow":38.86,"apparentTemperatureLowTime":1579053300,"dewPoint":35.7,"humidity":0.69,"pressure":1021.5,"windSpeed":5.48,"windGust":11.09,"windGustTime":1579016820,"windBearing":275,"cloudCover":0.31,"uvIndex":2,"uvIndexTime":1579003560,"visibility":10,"ozone":319.8,"temperatureMin":39.38,"temperatureMinTime":1578964800,"temperatureMax":58.17,"temperatureMaxTime":1579009980,"apparentTemperatureMin":35.82,"apparentTemperatureMinTime":1578962220,"apparentTemperatureMax":57.67,"apparentTemperatureMaxTime":1579009980},{"time":1579042800,"summary":"Partly cloudy throughout the day.","icon":"partly-cloudy-day","sunriseTime":1579072560,"sunsetTime":1579106760,"moonPhase":0.69,"precipIntensity":0.0001,"precipIntensityMax":0.0002,"precipIntensityMaxTime":1579068540,"precipProbability":0.04,"precipType":"rain","temperatureHigh":59.9,"temperatureHighTime":1579096020,"temperatureLow":43.76,"temperatureLowTime":1579152420,"apparentTemperatureHigh":59.4,"apparentTemperatureHighTime":1579096020,"apparentTemperatureLow":41.11,"apparentTemperatureLowTime":1579152540,"dewPoint":41.54,"humidity":0.8,"pressure":1020.9,"windSpeed":4.27,"windGust":6.96,"windGustTime":1579042800,"windBearing":264,"cloudCover":0.52,"uvIndex":2,"uvIndexTime":1579089300,"visibility":10,"ozone":300.5,"temperatureMin":41.48,"temperatureMinTime":1579053240,"temperatureMax":59.9,"temperatureMaxTime":1579096020,"apparentTemperatureMin":38.86,"apparentTemperatureMinTime":1579053300,"apparentTemperatureMax":59.4,"apparentTemperatureMaxTime":1579096020}]},"flags":{"sources":["meteoalarm","cmc","gfs","icon","isd","madis"],"meteoalarm-license":"Based on data from EUMETNET - MeteoAlarm [https://www.meteoalarm.eu/]. Time delays between this website and the MeteoAlarm website are possible; for the most up to date information about alert levels as published by the participating National Meteorological Services please use the MeteoAlarm website.","nearest-station":6.462,"units":"us"},"offset":1}';

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

  ngOnInit() {
    this.refresh();
  }

  async refresh() {
    //const weather = await this.getData();
    const weather = JSON.parse(weatherInfo);
    const tempCanvas = (<HTMLCanvasElement>document.getElementById('tempCanvas')).getContext("2d");
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
    })
    this.temperatureLabels = hours;
    this.temperatureData[0].data = tempData;
    this.temperatureData[0].borderColor = temperatureGradient;
    this.rainLabels = hours;
    this.rainData[0].data = rainData;
    // Refresh after 5 mins
    setTimeout(this.refresh.bind(this), FIVE_MINUTES);
  }

  getData():any {
    return this.http.get('/weather').toPromise();
  }

  convertTemperature(temperature) {
    // TODO Add settings to choose the temperature Unit
    if (false) {
      return temperature;
    }
    return parseFloat(((temperature - 32 ) * 5 / 9).toFixed(2));
  }

  getTempColor(context) {
    var index = context.dataIndex;
    var value = context.dataset.data[index];
    return value < 10 ? 'red' :  // draw negative values in red
        index % 2 ? 'blue' :    // else, alternate values in blue and green
        'green';
  }

}
