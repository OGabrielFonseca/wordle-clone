import { Component } from '@angular/core';
import { BoardComponent } from '../../shared/components/board/board.component';

const IMPORTS = [BoardComponent];

@Component({
  selector: 'app-single',
  imports: IMPORTS,
  templateUrl: './single.component.html',
  styleUrl: './single.component.css',
})
export class SingleComponent {}
