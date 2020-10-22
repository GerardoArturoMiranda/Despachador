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
import { promise } from 'protractor';
// Variable que no se utiliza.
const URL = 'http://localhost:4000/api/upload';
@Component({
  selector: 'app-despachador',
  templateUrl: './despachador.component.html',
  styleUrls: ['./despachador.component.css'],
  // Animación llamada Fade In con siguientes características:
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
  //Instancia  de FileUploader que recibe en constructor (URL y alías.)
  // Objeto es para servidor.
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo' });
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // Declaración de Variables para Uso General.
  // Se declaran todas las variables Públicas para que el HTML tenga Acceso a Estas.
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  public nProcesos = [] ;
  public procesos : string[] = [];
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // Variables de tipo Array.
  // Explicación: Se declaran de esta forma debido a cada proceso (A, B, C, D, ..., X)
  // tendrá su propio tiempo de Ejecución, Tiempo de Bloqueo y Tiempo de tiempoInicio
  // es decir, variable que va con el lugar [0] => A, [1] => B, de esta forma siguiendo un
  // patrón consecutivo.
  public fillTiempoCambioContexto : number[] = [];
  public fillTiempoVencimientoQuantum : number[] = [];
  public fillTiempoDeBloqueo : number[] = [];
  public tiempoBloqueo : number[] = [];
  public tiempoEjecucion : number[] = [];
  public tiempoInicio : number[] = [];
  // Finalización de Declaración de Variables de tipo arreglo para Procesos.
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // Variables únicas de aplicación General.
  // Explicación: Se declaran las variables de esta forma, debido a que se
  // aplicarán a toda la lógica de programación.
  public tiempoDeCambioDeContexto : number;
  public procesadores : number;
  public tamQuantum : number;
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // Variable que cuenta cuántos procesos hay para analizar.
  public n = 0;
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // Variables de tipo Array.
  // Explicación: Se declaran de esta forma debido a cada microprocesador (1, 2, 3, 4, ..., N)
  // tendrá su propio tiempo inicial y tiempo final
  // es decir, variables con lugar [0] => 1, [1] => 2, de esta forma siguiendo un
  // patrón consecutivo..
  public tiempoInicioMicroprocesador : number[] = [];
  public tiempoFinalMicroprocesador : number[] = [];
  public tiempoDeVencimientoDeQuantumMicroprocesador : number[] = [];
  // Variable de tipo arreglo de string.
  // Explicación: Se declaran de esta forma debido a las líneas de texto
  // se registrarán en forma de arreglo, la línea 1 de texto corresponde al
  // lugar 0 y así consecutivamente.
  // Variables de cálculo.
  public texto : String[] = [];
  // array de los datos o inputs
 public datatype:any[][];
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  constructor() { }
  //Método On Init
  ngOnInit() {
    // Método pero de servidor.
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
  // Método de lectura de archivo, cuando la varible this.texto
  // ya obtuvo la información del archivo que el usuario subió.
  lecturaArchivo(arregloInformacion){
    var lineas = arregloInformacion[0].split("\n");
    var variables : any[] = [];
    console.log(variables);
    for (let i = 0; i < lineas.length; i++) {
      variables.push(lineas[i].split(","));
    }
    this.texto = variables;
  }
  generarDistribucion = (tamQuantum, microprocesadores, tiempoCambio, tiempoDeBloque) => {
    // Se llama al método de CleanData para hacer la limpieza e instancia de los valores cada vez
    // que se aprete el botón de generar.
    this.cleanData();
    // Llenado de variables publicas del Typescript con las variables externas del html.
    this.tiempoDeCambioDeContexto = parseInt(tiempoCambio);
    this.procesadores = parseInt(microprocesadores);
    this.tamQuantum = parseInt(tamQuantum);
    // Impresión de valores internos de Typescript en consola.
    if(this.n < 1){
      this.lecturaArchivo(this.texto);
      for(let i = 0; i < this.texto.length; i++){
        this.procesos[i] = this.texto[i][0];
        console.log(this.procesos[i]);
        this.tiempoEjecucion[i] = parseInt(this.texto[i][1]);
        console.log(this.tiempoEjecucion[i]);
        this.tiempoBloqueo[i] = parseInt(this.texto[i][2]);
        console.log(this.tiempoBloqueo[i]);
        this.tiempoInicio[i] = parseInt(this.texto[i][3]);
        console.log(this.tiempoInicio[i]);
      }
    }
    // Lógica de Programación, primero se le asignan los valores de 0 a
    var limite2 = 0;
    if(this.n < 1){
      limite2 = this.texto.length;
    }else{
      limite2 = this.n-1;
    }
    if (this.procesadores == 1){
        for (let j = 0; j < limite2; j++) {
          var total = 0;
          this.fillTiempoDeBloqueo[j] = tiempoDeBloque * this.tiempoBloqueo[j];
          if(j==0){
            this.fillTiempoCambioContexto[j] = 0;
            this.tiempoInicioMicroprocesador[j] = 0;
          }else{
            this.fillTiempoCambioContexto[j] = this.tiempoDeCambioDeContexto;
          }
          if((this.tiempoEjecucion[j]%this.tamQuantum != 0 && this.tiempoEjecucion[j]>this.tamQuantum) || (this.tiempoEjecucion[j] > this.tamQuantum)){
            var copiaTamQuantum = this.tamQuantum++;
            this.fillTiempoVencimientoQuantum[j] = Math.floor(this.tiempoEjecucion[j]/copiaTamQuantum) * this.tiempoDeCambioDeContexto;
          }else{
            this.fillTiempoVencimientoQuantum[j] = 0
          }
          if(j>0){
            this.tiempoInicioMicroprocesador[j] = this.tiempoFinalMicroprocesador[j-1];
          }
          this.tiempoFinalMicroprocesador[j] = this.fillTiempoCambioContexto[j] + this.fillTiempoVencimientoQuantum[j] + this.tiempoEjecucion[j] + this.fillTiempoDeBloqueo[j] + this.tiempoInicioMicroprocesador[j];
          console.log(this.fillTiempoVencimientoQuantum[j]);
          console.log(this.fillTiempoCambioContexto[j]);
          console.log(this.tiempoInicioMicroprocesador[j]);
          console.log(this.tiempoFinalMicroprocesador[j]);
        }
    } else{
      this.logicaMayorMicroprocesadores(this.procesadores);
    }
    this.agrupar();
  }

    // Método de creación de arreglos acorde al número de microprocesadores, recibe  el número y crea arreglos con base en Acceso
    logicaMayorMicroprocesadores(n){
      var procesos = {};
      var tiempoEjecucion = {};
      var tiempoCambioDeContexto = {};
      var tiempoVencimientoDeQuantum = {};
      var tiempoBloqueoM = {};
      var tiempoInicial = {};
      var tiempoFinal = {};
      for (let i = 0; i < n -1; i++){
        }
      }

  // Método 'cleanData' para hacer limpieza de valores de las variables e instancias.
 cleanData(){
   this.nProcesos = [];
   this.tiempoInicioMicroprocesador = [];
   this.tiempoFinalMicroprocesador = [];
   this.fillTiempoCambioContexto = [];
   this.fillTiempoVencimientoQuantum = [];
   this.fillTiempoDeBloqueo = [];
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
  // Métodos que sirven como listeners de los inputs de procesos de html.
  onKeyProceso(event: any ,i:number){
    this.procesos[i] = event.target.value;
    console.log("Se acaba de Añadir un Proceso con un identificador de: " + this.procesos[i]);
  }
  // Métodos que sirven como listeners de los inputs de los tiempos de ejecución de los procesos de html.
  onKeyTiempoProceso(event: any ,i:number){
    this.tiempoEjecucion[i] = parseInt(event.target.value);
    console.log("Se acaba de Tiempo de Ejecición de un Proceso con un valor de: " + event.target.value);
  }
  // Métodos que sirven como listeners de los inputs de los tiempos de inicio de los procesos de html.
  onKeyTiempoInicio(event: any ,i:number){
    this.tiempoInicio[i] = parseInt(event.target.value);
    console.log("Instancia: " + i + "VALOR: " + this.tiempoInicio[i])
    console.log("Se acaba de Tiempo de Inicio de un Proceso con un valor de: " + event.target.value);
  }
  // Métodos que sirven como listeners de los inputs de los tiempos de bloqueo de los procesos de html.
  onKeyTiempoBloqueo(event: any ,i:number){
    this.tiempoBloqueo[i] = parseInt(event.target.value);
    console.log("Se acaba de Tiempo de Bloque de un Proceso con un valor de: " + event.target.value);
  }
  agrupar(){
    var procesos1:number[]=[];
    var procesos2:number[]=[];
    var procesos3:number[]=[];
    var procesos4:number[]=[];
    var procesos5:number[]=[];
    var limite = 0;
    if(this.n < 1){
      limite = this.texto.length;
    }else{
      limite = this.n;
    }
    for(let i=0;i<limite;i++){
      if(this.tiempoInicio[i]==0){
      procesos1[i]=i;
      console.log(" indice procesos1:"+ procesos1);
      }
      if(this.tiempoInicio[i]==1500){
      procesos2[i]=i;
      console.log(" indice procesos2:"+ procesos2);
      }
      if(this.tiempoInicio[i]==3000){
      procesos3[i]=i;
      console.log("indice procesos3"+ procesos3);
      }
      if(this.tiempoInicio[i]==4000){
      procesos4[i]=i;
      console.log(" indice procesos4"+ procesos4);
      }
      if(this.tiempoInicio[i]==8000){
      procesos5[i]=i;
      console.log("indice procesos5"+ procesos5);
      }
    }
  }
}
