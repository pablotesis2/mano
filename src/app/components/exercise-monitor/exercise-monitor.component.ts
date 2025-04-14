// exercise-monitor.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { FirebaseExerciseService, ExerciseData } from '../../services/historical-exercise-data.service';

@Component({
  selector: 'app-exercise-monitor',
  templateUrl: './exercise-monitor.component.html',
  styleUrls: ['./exercise-monitor.component.css'], // Cambiado a .css en lugar de .scss
  standalone: true,
  imports: [CommonModule, DatePipe] // Importamos CommonModule y DatePipe
})
export class ExerciseMonitorComponent implements OnInit, OnDestroy {
  currentExercise: ExerciseData | null = null;
  currentDate = new Date(); // Agregamos esta propiedad para usar en el template
  private exerciseSubscription: Subscription | undefined;

  constructor(private firebaseService: FirebaseExerciseService) {}

  ngOnInit(): void {
    // Suscribirse a los cambios del ejercicio actual
    this.exerciseSubscription = this.firebaseService.currentExercise$.subscribe(
      (data) => {
        this.currentExercise = data;
        this.currentDate = new Date(); // Actualizamos la fecha cuando recibimos datos nuevos
        console.log('Datos actualizados:', data);
      },
      (error) => {
        console.error('Error al obtener datos del ejercicio:', error);
      }
    );
  }

  ngOnDestroy(): void {
    // Limpieza al destruir el componente
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
  }

  // Método para determinar el progreso visual de las repeticiones (máximo 4)
  getRepetitionProgress(): number {
    return this.currentExercise ? (this.currentExercise.repeticiones / 4) * 100 : 0;
  }

  // Método para determinar el nombre completo del tipo de ejercicio
  getExerciseTypeName(): string {
    if (!this.currentExercise) return 'Sin seleccionar';
    
    switch (this.currentExercise.tipo) {
      case 'pinza': return 'Ejercicio de Pinza';
      case 'tijera': return 'Ejercicio de Tijera';
      default: return 'Desconocido';
    }
  }
}