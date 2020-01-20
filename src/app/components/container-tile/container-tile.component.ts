import { Component, Input } from '@angular/core';

@Component({
  selector: 'container-tile',
  templateUrl: './container-tile.component.html',
  styleUrls: ['./container-tile.component.scss']
})
export class ContainerTileComponent {

  @Input() title: string;
  @Input() subtitle: string;

}
