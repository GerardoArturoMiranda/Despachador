import { Component, OnInit } from '@angular/core';
//  Importación de Librerías para la carga de archivos a servidor.
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload';
// Constante que indica el path de la api en el  puerto 4000.
// Importación de animaciones
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
const URL = 'http://localhost:4000/api/upload';
@Component({
  selector: 'app-despachador',
  templateUrl: './despachador.component.html',
  styleUrls: ['./despachador.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('0.5s ease-out', style({ opacity: '1' })),
      ]),
    ]),
  ],
})
export class DespachadorComponent implements OnInit {

  //Instancia  de FileUploader que recibe en constructor URL y alías.
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo' });
  // Declaración de Variables para uso general.
  // Se declaran públicas para que el html tenga acceso a estas.
  public nProcesos = [] ;
  public procesos : string[] = [];
  public tiempoEjecucion : number[] = [];
  public tiempoBloqueo : number[] = [];
  public tiempoInicio : number[] = [];
  public tiempoDeCambioDeContexto : number;
  public procesadores : number;
  public tamQuantum : number;
  public tablas : any[] = [];
  public n = 0;
  public texto : any;
  constructor() { }
  //Método  On In
  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         console.log('ImageUpload:uploaded:', item, status, response);
         alert('Carga de archivo exitosa');
    };
  }
// Método para captura de texto.
  showFile = ($event) => {
    var loads = [];
    var files = $event.target.files;
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var reader = new FileReader();
        reader.onload = (function (file) { // here we save variable 'file' in closure
            return function (e) {
                var data = this.result; // do some thing with data
                loads.push(data)
            }
        })(file);
        reader.readAsText(file);
    }
    this.texto = loads;
  }
  generarDistribucion = (tamQuantum, microprocesadores, tiempoCambio) => {
    // Se llama al método de CleanData para hacer la limpieza e instancia de los valores cada vez
    // que se aprete el botón de generar.
    this.cleanData();
    // Llenado de variables publicas del Typescript con las variables externas del html.
    this.tiempoDeCambioDeContexto = parseInt(tiempoCambio);
    this.procesadores = parseInt(microprocesadores);
    this.tamQuantum = parseInt(tamQuantum);
    // Impresión de valores internos de Typescript en consola.
    console.log("Tiempo De Cambio De Contexto es: " + this.tiempoDeCambioDeContexto);
    console.log("El valor de Procesadores es: " + this.procesadores);
    console.log("El tamaño de Quantum es: " + this.tamQuantum);
    console.log("El texto del archivo es: " + this.texto);
    // Lógica de Programación
    for (let i = 0; i < this.procesadores; i++) {
      var tabla : any[] = [];
      this.tablas.push(tabla);
    }
    var tiemposDistintos : number[] = [];
    tiemposDistintos.push(0);
    for (let j = 0; j < tiemposDistintos.length; j++) {
      for (let k = 0; k < this.tiempoInicio.length; k++) {
        console.log("Se añade un nuevo valor");
        if(this.tiempoInicio[k] == tiemposDistintos[j]){
        }else{
          tiemposDistintos.push(this.tiempoInicio[k]);
        }
      }
    }
    for (let i = 0; i < tiemposDistintos.length; i++) {
        console.log("El " + (i+1) + " tiempo distinto es: " + tiemposDistintos[i]);
    }
  }
  // Método 'cleanData' para hacer limpieza de valores de las variables e instancias.
 cleanData(){
   this.nProcesos = [];
   this.procesos = [];
   this.tiempoEjecucion = [];
   this.tiempoInicio = [];
   this.tiempoBloqueo = [];
   this.tiempoDeCambioDeContexto = 0;
   this.procesadores = 0;
   this.tamQuantum = 0;
 }
 // Método 'agregarProceso' que sirve para almacenar las instancias de los procesos en html.
  agregarProceso(){
    this.nProcesos.push(1);
    this.n = this.nProcesos.length+1;
  }
  // Método 'eliminarProceso' que sirve para eliminar las instancias de los procesos en html.
  eliminarProceso(){
    this.nProcesos.pop();
    this.n = this.nProcesos.length-1;
  }
  // Métodos que sirven como listeners de los inputs de procesos y tiemposDeEjecución de html.
  onKeyProceso(event: any ,i:number){
    this.procesos[i] = event.target.value;
    console.log("Se acaba de Añadir un Proceso con un identificador de: " + event.target.value);
  }
  onKeyTiempoProceso(event: any ,i:number){
    this.tiempoEjecucion[i] = parseInt(event.target.value);
    console.log("Se acaba de Tiempo de Ejecición de un Proceso con un valor de: " + event.target.value);
  }
  onKeyTiempoInicio(event: any ,i:number){
    this.tiempoInicio[i] = parseInt(event.target.value);
    console.log("Instancia: " + i + "VALOR: " + this.tiempoInicio[i])
    console.log("Se acaba de Tiempo de Inicio de un Proceso con un valor de: " + event.target.value);
  }
  onKeyTiempoBloqueo(event: any ,i:number){
    this.tiempoBloqueo[i] = parseInt(event.target.value);
    console.log("Se acaba de Tiempo de Bloque de un Proceso con un valor de: " + event.target.value);
  }
}
