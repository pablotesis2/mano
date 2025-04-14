// firebase-exercise.service.ts
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Database, getDatabase, ref, onValue } from 'firebase/database';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ExerciseData {
  tipo: string;
  repeticiones: number;
  series: number;
  botonActual?: number;
}

export interface HistoricalExerciseData {
  [timestamp: string]: ExerciseData;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseExerciseService {
  // Solución 1: Inicializar con ! para indicar que será asignada definitivamente
  private db!: Database;
  
  private currentExerciseSubject = new BehaviorSubject<ExerciseData | null>(null);
  private historicalExercisesSubject = new BehaviorSubject<HistoricalExerciseData>({});

  // Observable streams que los componentes pueden suscribirse
  public currentExercise$ = this.currentExerciseSubject.asObservable();
  public historicalExercises$ = this.historicalExercisesSubject.asObservable();

  constructor() {
    const firebaseConfig = {
      databaseURL: 'https://kguasdf-default-rtdb.firebaseio.com',
      // Puedes añadir otros parámetros necesarios de configuración 
      apiKey: "AIzaSyAj3qmxSydL9nMI5Gv9ZfnynRbZhTdQ8G0", // Ejemplo - reemplaza con tu valor real
      // En una aplicación de producción, estas claves deberían estar en environment.ts
    };

    try {
      // Inicializa Firebase
      const app = initializeApp(firebaseConfig);
      this.db = getDatabase(app);
      
      // Inicia los escuchadores para datos en tiempo real
      this.listenToCurrentExercise();
      this.listenToHistoricalExercises();
    } catch (error) {
      console.error("Error al inicializar Firebase:", error);
      // Aún necesitamos manejar el caso donde la db no se inicializa
    }
  }

  private listenToCurrentExercise(): void {
    try {
      // Verificación de seguridad adicional
      if (!this.db) {
        console.error("Database no está inicializada");
        return;
      }
      
      const currentExerciseRef = ref(this.db, 'ejercicios/actual');
      onValue(currentExerciseRef, (snapshot) => {
        const data = snapshot.val() as ExerciseData;
        this.currentExerciseSubject.next(data);
        console.log("Datos recibidos de Firebase:", data);
      }, (error) => {
        console.error("Error al escuchar cambios en ejercicio actual:", error);
      });
    } catch (error) {
      console.error("Error al configurar listener para ejercicio actual:", error);
    }
  }

  private listenToHistoricalExercises(): void {
    try {
      // Verificación de seguridad adicional
      if (!this.db) {
        console.error("Database no está inicializada");
        return;
      }
      
      const historicalExercisesRef = ref(this.db, 'ejercicios/historico');
      onValue(historicalExercisesRef, (snapshot) => {
        const data = snapshot.val() as HistoricalExerciseData;
        this.historicalExercisesSubject.next(data || {});
      }, (error) => {
        console.error("Error al escuchar cambios en histórico de ejercicios:", error);
      });
    } catch (error) {
      console.error("Error al configurar listener para histórico:", error);
    }
  }

  // Método para obtener el último valor (alternativa a suscripción)
  getCurrentExercise(): ExerciseData | null {
    return this.currentExerciseSubject.value;
  }

  // Método para obtener el historial (alternativa a suscripción)
  getHistoricalExercises(): HistoricalExerciseData {
    return this.historicalExercisesSubject.value;
  }
}