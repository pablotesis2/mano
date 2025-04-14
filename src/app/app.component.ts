import { Component } from '@angular/core';
import { ExerciseMonitorComponent } from './components/exercise-monitor/exercise-monitor.component';

@Component({
  selector: 'app-root',
  imports: [ExerciseMonitorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'myapp';
}
