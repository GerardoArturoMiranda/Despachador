import { Component, OnInit } from '@angular/core';
//  Importación de Librerías para la carga de archivos a servidor.
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload';
// Constante que indica el path de la api en el  puerto 4000.
// Importación de animaciones
import { MatSnackBar } from "@angular/material/snack-bar";
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
  public nProcesos = [] ;
  public procesos : string[] = [];
  public fillTiempoCambioContexto : number[] = [];
  public fillTiempoVencimientoQuantum : number[] = [];
  public fillTiempoDeBloqueo : number[] = [];
  public tiempoBloqueo : number[] = [];
  public tiempoEjecucion : number[] = [];
  public tiempoInicio : number[] = [];
  public estadoProcesos : boolean[] = [];
  public tiempoDeCambioDeContexto : number;
  public procesadores : number;
  public tamQuantum : number;
  public n = 0;
  public after = false;
  public after0 = false;
  public tiempoInicioMicroprocesador : number[] = [];
  public tiempoFinalMicroprocesador : number[] = [];
  public tiempoDeVencimientoDeQuantumMicroprocesador : number[] = [];
  public texto : String[] = [];
  public datatype:any[][];
  public procesosD : {};
  public tiempoEjecucionD : {};
  public tiempoCambioDeContextoD : {};
  public tiempoVencimientoDeQuantumD : {};
  public tiempoBloqueoMD : {};
  public tiempoInicialD : {};
  public tiempoFinalD : {};
  public procesos1:number[]=[];
  public procesos2:number[]=[];
  public procesos3:number[]=[];
  public procesos4:number[]=[];
  public procesos5: number[] = [];
  public showhideAgregarEliminarProceso: boolean;
  constructor(public snackBarError: MatSnackBar) { }
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
        if(tamQuantum <= 0){
        this.openErrorDialog('El tamaño de quantum debe ser mayor a 0');

        return false;
      }
      if(microprocesadores <= 0){
      this.openErrorDialog('El número de microprocesadores no puede ser  menor o igual a  0');
      return false;
      }
      if(tiempoCambio <= 0){
      this.openErrorDialog('El tiempo de Cambio de Contexto debe ser mayor a 0');
      return false;
      }
      if(tiempoDeBloque <= 0){
      this.openErrorDialog('El tiempo de Bloqueo debe ser mayor a 0');
      return false;
      }
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
          this.agrupar(this.procesos1, this.procesos2, this.procesos3, this.procesos4, this.procesos5);
          var total = 0;
          this.fillTiempoDeBloqueo[j] = tiempoDeBloque * this.tiempoBloqueo[j];
          if(j==0){
            this.fillTiempoCambioContexto[j] = 0;
            this.tiempoInicioMicroprocesador[j] = 0;
          }else{
            this.fillTiempoCambioContexto[j] = this.tiempoDeCambioDeContexto;
          }
          if((this.tiempoEjecucion[j]%this.tamQuantum != 0 && this.tiempoEjecucion[j]>this.tamQuantum) ||
          (this.tiempoEjecucion[j] > this.tamQuantum)){
            var copiaTamQuantum = this.tamQuantum++;
            this.fillTiempoVencimientoQuantum[j] = Math.floor(this.tiempoEjecucion[j] / copiaTamQuantum) *
              this.tiempoDeCambioDeContexto;
          }else{
            this.fillTiempoVencimientoQuantum[j] = 0
          }
          if(j>0){
            this.tiempoInicioMicroprocesador[j] = this.tiempoFinalMicroprocesador[j-1];
          }
          this.tiempoFinalMicroprocesador[j] = this.fillTiempoCambioContexto[j] + this.fillTiempoVencimientoQuantum[j] +
          this.tiempoEjecucion[j] + this.fillTiempoDeBloqueo[j] + this.tiempoInicioMicroprocesador[j];
          console.log(this.fillTiempoVencimientoQuantum[j]);
          console.log(this.fillTiempoCambioContexto[j]);
          console.log(this.tiempoInicioMicroprocesador[j]);
          console.log(this.tiempoFinalMicroprocesador[j]);
        }
        this.after0 = true;
    } else{
      this.agrupar(this.procesos1, this.procesos2, this.procesos3, this.procesos4, this.procesos5);
      var conjuntoTiemposFinales : number[] = [];
      var i = 0;
      var rondas = 0;
      var n = this.procesadores;
      var segundoCC = false;
      var terceroCC = false;
      var cuartoCC = false;
      var quintoCC = false;
    for(let k = 0; k < n +1; k++ ){
      this.procesosD[k] = [];
      this.tiempoEjecucionD[k] = [];
      this.tiempoCambioDeContextoD[k] = [];
      this.tiempoVencimientoDeQuantumD[k] = [];
      this.tiempoBloqueoMD[k] = [];
      this.tiempoInicialD[k] = [];
      this.tiempoFinalD[k] = [];
      console.log("Valor de K" + k);
    }
    while(this.procesos1.length > 0 ){
        console.log("*** P R O C E S A D O R:"+ i + " ***");
        var proceso = this.peekFirst(this.procesos1);
        console.log("*Se va a analizar al proceso " + proceso + ", es decir al proceso: " + this.procesos[proceso]);
        this.procesosD[i].push(this.procesos[proceso]);
        this.tiempoEjecucionD[i].push(this.tiempoEjecucion[proceso]);
        this.tiempoBloqueoMD[i].push(tiempoDeBloque * this.tiempoBloqueo[proceso])
        console.log("Se ha añadido un tiempo de bloqueo, al arreglo: " + this.tiempoBloqueoMD[i] + " que corresponde al procesador: " + i);
        if(this.peek(this.tiempoFinalD[i]) != null){
          console.log("*Dado que NO es el primer procesos que entra en el procesador " + i + " se realiza lo siguiente:");
          this.tiempoCambioDeContextoD[i].push(this.tiempoDeCambioDeContexto);
          console.log("Se ha añadido un tiempo de cambio de contexto, al arreglo: " + this.tiempoCambioDeContextoD[i] + " que corresponde al procesador: " + i);
          }else{
            console.log("*Dado que es el primer proceso que entra en el procesador " + i + " se realiza lo siguiente:");
            this.tiempoCambioDeContextoD[i].push(0);
            console.log("Se ha añadido un tiempo de cambio de contexto, al arreglo: " + this.tiempoCambioDeContextoD[i] + " que corresponde al procesador: " + i);
            this.tiempoInicialD[i].push(0);
            console.log("Se ha añadido un tiempo incial, al arreglo: " + this.tiempoInicialD[i] + " que corresponde al procesador: " + i);
          }
          if((this.tiempoEjecucion[proceso]%this.tamQuantum != 0 && this.tiempoEjecucion[proceso]>this.tamQuantum) || (this.tiempoEjecucion[proceso] > this.tamQuantum)){
              console.log("*Dado a que el proceso es mayor al tamaño de quantum, se calcula su tiempo de Vencimiento del proceso: " + this.procesos[proceso] + ", se realiza lo siguiente:");
              var copiaTamQuantum = this.tamQuantum++;
              this.tiempoVencimientoDeQuantumD[i].push(Math.floor(this.tiempoEjecucion[proceso]/copiaTamQuantum) *  this.tiempoDeCambioDeContexto);
              console.log("Se ha añadido un tiempo de vencimiento de quantum, al arreglo: " + this.tiempoVencimientoDeQuantumD[i] + " que corresponde al procesador: " + i);
          }else{
              console.log("*Dado a que el proceso NO es mayor al tamaño de quantum, no se calcula su tiempo de Vencimiento del proceso: " + this.procesos[proceso] + ", se realiza lo siguiente:");
              this.tiempoVencimientoDeQuantumD[i].push(0)
              console.log("Se ha añadido un tiempo de vencimiento de quantum, al arreglo: " + this.tiempoVencimientoDeQuantumD[i] + " que corresponde al procesador: " + i);
          }
          if(this.peek(this.tiempoFinalD[i]) > 0){
                console.log("*Dado a que el proceso NO es el primero en ser analizado en el procesador, se realiza lo siguiente:");
                var temporal = this.peek(this.tiempoFinalD[i]);
                console.log("Se ha añadido un tiempo inicial que corresponde al final del mismo procesador, es decir:");
                this.tiempoInicialD[i].push(temporal);
                console.log(this.tiempoInicialD[i]);
          }
          console.log("*Dado a que se han calculado todos los tiempos, se saca el final:");
          this.tiempoFinalD[i].push(this.peek(this.tiempoCambioDeContextoD[i]) + this.peek(this.tiempoVencimientoDeQuantumD[i]) + this.tiempoEjecucion[proceso] + this.peek(this.tiempoBloqueoMD[i]) + this.peek(this.tiempoInicialD[i]));
          console.log("Tiempo final: " + this.tiempoFinalD[i]);
          this.estadoProcesos[i] = true;
          console.log("Se va a añadir el tiempo final: " + this.peek(this.tiempoFinalD[i]) + " al arreglo de tiempos");
          conjuntoTiemposFinales[i] = (this.peek(this.tiempoFinalD[i]));
          let popped = this.procesos1.shift();
          console.log("Se ha quitado a: " + popped);
          console.log("El arreglo queda como: " + this.procesos1);
          rondas++;
          console.log("Valor Rondas"+ rondas);
          console.log("Valor N" + n);
          if(rondas > (n-1)){
              var valor = this.arrayMin(conjuntoTiemposFinales);
              console.log("Estoy entrando, y el valor es:" + conjuntoTiemposFinales);
              console.log("El valor que se quitará es: " + valor );
              var index = conjuntoTiemposFinales.indexOf(valor);
              if(index == 0){
                conjuntoTiemposFinales.shift();
                conjuntoTiemposFinales.unshift(1000000000000);
              }else if(index > 0 && index < conjuntoTiemposFinales.length -1){
                var copiaTiempos = conjuntoTiemposFinales;
                var primeraParte = conjuntoTiemposFinales.slice(0, index);
                var segundaParte = copiaTiempos.slice((index+1),copiaTiempos.length);
                var primeraYExtra = primeraParte.concat(1000000000000);
                conjuntoTiemposFinales = primeraYExtra.concat(segundaParte);
              }else{
                conjuntoTiemposFinales.pop();
                conjuntoTiemposFinales.push(1000000000000);
              }
              i = index;
              console.log("El arreglo queda como: " + conjuntoTiemposFinales);
              console.log("Valor de i: "+ i);
          }else{
            i++;
          }
    }
    console.log("Ha terminado  el ciclo de procesos 1");
    while(this.procesos2.length > 0 ){
        console.log("*** P R O C E S A D O R:"+ i + " ***");
        var proceso = this.peekFirst(this.procesos2);
        console.log("*Se va a analizar al proceso " + proceso + ", es decir al proceso: " + this.procesos[proceso]);
        this.procesosD[i].push(this.procesos[proceso]);
        this.tiempoEjecucionD[i].push(this.tiempoEjecucion[proceso]);
        this.tiempoBloqueoMD[i].push(tiempoDeBloque * this.tiempoBloqueo[proceso])
        console.log("Se ha añadido un tiempo de bloqueo, al arreglo: " + this.tiempoBloqueoMD[i] + " que corresponde al procesador: " + i);
        if(this.peek(this.tiempoFinalD[i]) != null){
            if(segundoCC==false){
              this.tiempoCambioDeContextoD[i].push(0);
              segundoCC = true;
            }else{
              console.log("*Dado que NO es el primer procesos que entra en el procesador " + i + " se realiza lo siguiente:");
              this.tiempoCambioDeContextoD[i].push(this.tiempoDeCambioDeContexto);
              console.log("Se ha añadido un tiempo de cambio de contexto, al arreglo: " + this.tiempoCambioDeContextoD[i] + " que corresponde al procesador: " + i);
            }
          }else{
            console.log("*Dado que es el primer proceso que entra en el procesador " + i + " se realiza lo siguiente:");
            this.tiempoCambioDeContextoD[i].push(0);
            console.log("Se ha añadido un tiempo de cambio de contexto, al arreglo: " + this.tiempoCambioDeContextoD[i] + " que corresponde al procesador: " + i);
            this.tiempoInicialD[i].push(0);
            console.log("Se ha añadido un tiempo incial, al arreglo: " + this.tiempoInicialD[i] + " que corresponde al procesador: " + i);
          }
          if((this.tiempoEjecucion[proceso]%this.tamQuantum != 0 && this.tiempoEjecucion[proceso]>this.tamQuantum) || (this.tiempoEjecucion[proceso] > this.tamQuantum)){
              console.log("*Dado a que el proceso es mayor al tamaño de quantum, se calcula su tiempo de Vencimiento del proceso: " + this.procesos[proceso] + ", se realiza lo siguiente:");
              var copiaTamQuantum = this.tamQuantum++;
              this.tiempoVencimientoDeQuantumD[i].push(Math.floor(this.tiempoEjecucion[proceso]/copiaTamQuantum) *  this.tiempoDeCambioDeContexto);
              console.log("Se ha añadido un tiempo de vencimiento de quantum, al arreglo: " + this.tiempoVencimientoDeQuantumD[i] + " que corresponde al procesador: " + i);
          }else{
              console.log("*Dado a que el proceso NO es mayor al tamaño de quantum, no se calcula su tiempo de Vencimiento del proceso: " + this.procesos[proceso] + ", se realiza lo siguiente:");
              this.tiempoVencimientoDeQuantumD[i].push(0)
              console.log("Se ha añadido un tiempo de vencimiento de quantum, al arreglo: " + this.tiempoVencimientoDeQuantumD[i] + " que corresponde al procesador: " + i);
          }
          if(this.peek(this.tiempoFinalD[i]) > 0){
                var temporal = this.peek(this.tiempoFinalD[i]);
                if(temporal < 1500 ){
                  this.tiempoInicialD[i].push(1500);
                }else{
                console.log("*Dado a que el proceso NO es el primero en ser analizado en el procesador, se realiza lo siguiente:");
                console.log("Se ha añadido un tiempo inicial que corresponde al final del mismo procesador, es decir:");
                this.tiempoInicialD[i].push(temporal);
                console.log(this.tiempoInicialD[i]);
                }
          }
          console.log("*Dado a que se han calculado todos los tiempos, se saca el final:");
          this.tiempoFinalD[i].push(this.peek(this.tiempoCambioDeContextoD[i]) + this.peek(this.tiempoVencimientoDeQuantumD[i]) + this.tiempoEjecucion[proceso] + this.peek(this.tiempoBloqueoMD[i]) + this.peek(this.tiempoInicialD[i]));
          console.log("Tiempo final: " + this.tiempoFinalD[i]);
          this.estadoProcesos[i] = true;
          console.log("Se va a añadir el tiempo final: " + this.peek(this.tiempoFinalD[i]) + " al arreglo de tiempos");
          conjuntoTiemposFinales[i] = (this.peek(this.tiempoFinalD[i]));
          let popped = this.procesos2.shift();
          console.log("Se ha quitado a: " + popped);
          console.log("El arreglo queda como: " + this.procesos2);
          rondas++;
          console.log("Valor Rondas"+ rondas);
          console.log("Valor N" + n);
          if(rondas > (n-1)){
              var valor = this.arrayMin(conjuntoTiemposFinales);
              console.log("Estoy entrando, y el valor es:" + conjuntoTiemposFinales);
              console.log("El valor que se quitará es: " + valor );
              var index = conjuntoTiemposFinales.indexOf(valor);
              if(index == 0){
                conjuntoTiemposFinales.shift();
                conjuntoTiemposFinales.unshift(1000000000000);
              }else if(index > 0 && index < conjuntoTiemposFinales.length -1){
                var copiaTiempos = conjuntoTiemposFinales;
                var primeraParte = conjuntoTiemposFinales.slice(0, index);
                var segundaParte = copiaTiempos.slice((index+1),copiaTiempos.length);
                var primeraYExtra = primeraParte.concat(1000000000000);
                conjuntoTiemposFinales = primeraYExtra.concat(segundaParte);
              }else{
                conjuntoTiemposFinales.pop();
                conjuntoTiemposFinales.push(1000000000000);
              }
              i = index;
              console.log("El arreglo queda como: " + conjuntoTiemposFinales);
              console.log("Valor de i: "+ i);
          }else{
            i++;
          }
    }
    console.log("Ha terminado  el ciclo de procesos 2");
    while(this.procesos3.length > 0 ){
        console.log("*** P R O C E S A D O R:"+ i + " ***");
        var proceso = this.peekFirst(this.procesos3);
        console.log("*Se va a analizar al proceso " + proceso + ", es decir al proceso: " + this.procesos[proceso]);
        this.procesosD[i].push(this.procesos[proceso]);
        this.tiempoEjecucionD[i].push(this.tiempoEjecucion[proceso]);
        this.tiempoBloqueoMD[i].push(tiempoDeBloque * this.tiempoBloqueo[proceso])
        console.log("Se ha añadido un tiempo de bloqueo, al arreglo: " + this.tiempoBloqueoMD[i] + " que corresponde al procesador: " + i);
        if(this.peek(this.tiempoFinalD[i]) != null){
            if(terceroCC==false){
              this.tiempoCambioDeContextoD[i].push(0);
              terceroCC = true;
            }else{
              console.log("*Dado que NO es el primer procesos que entra en el procesador " + i + " se realiza lo siguiente:");
              this.tiempoCambioDeContextoD[i].push(this.tiempoDeCambioDeContexto);
              console.log("Se ha añadido un tiempo de cambio de contexto, al arreglo: " + this.tiempoCambioDeContextoD[i] + " que corresponde al procesador: " + i);
            }
          }else{
            console.log("*Dado que es el primer proceso que entra en el procesador " + i + " se realiza lo siguiente:");
            this.tiempoCambioDeContextoD[i].push(0);
            console.log("Se ha añadido un tiempo de cambio de contexto, al arreglo: " + this.tiempoCambioDeContextoD[i] + " que corresponde al procesador: " + i);
            this.tiempoInicialD[i].push(0);
            console.log("Se ha añadido un tiempo incial, al arreglo: " + this.tiempoInicialD[i] + " que corresponde al procesador: " + i);
          }
          if((this.tiempoEjecucion[proceso]%this.tamQuantum != 0 && this.tiempoEjecucion[proceso]>this.tamQuantum) || (this.tiempoEjecucion[proceso] > this.tamQuantum)){
              console.log("*Dado a que el proceso es mayor al tamaño de quantum, se calcula su tiempo de Vencimiento del proceso: " + this.procesos[proceso] + ", se realiza lo siguiente:");
              var copiaTamQuantum = this.tamQuantum++;
              this.tiempoVencimientoDeQuantumD[i].push(Math.floor(this.tiempoEjecucion[proceso]/copiaTamQuantum) *  this.tiempoDeCambioDeContexto);
              console.log("Se ha añadido un tiempo de vencimiento de quantum, al arreglo: " + this.tiempoVencimientoDeQuantumD[i] + " que corresponde al procesador: " + i);
          }else{
              console.log("*Dado a que el proceso NO es mayor al tamaño de quantum, no se calcula su tiempo de Vencimiento del proceso: " + this.procesos[proceso] + ", se realiza lo siguiente:");
              this.tiempoVencimientoDeQuantumD[i].push(0)
              console.log("Se ha añadido un tiempo de vencimiento de quantum, al arreglo: " + this.tiempoVencimientoDeQuantumD[i] + " que corresponde al procesador: " + i);
          }
          if(this.peek(this.tiempoFinalD[i]) > 0){
            var temporal = this.peek(this.tiempoFinalD[i]);
            if(temporal < 3000 ){
              this.tiempoInicialD[i].push(3000);
            }else{
            console.log("*Dado a que el proceso NO es el primero en ser analizado en el procesador, se realiza lo siguiente:");
            console.log("Se ha añadido un tiempo inicial que corresponde al final del mismo procesador, es decir:");
            this.tiempoInicialD[i].push(temporal);
            console.log(this.tiempoInicialD[i]);
            }
          }
          console.log("*Dado a que se han calculado todos los tiempos, se saca el final:");
          this.tiempoFinalD[i].push(this.peek(this.tiempoCambioDeContextoD[i]) + this.peek(this.tiempoVencimientoDeQuantumD[i]) + this.tiempoEjecucion[proceso] + this.peek(this.tiempoBloqueoMD[i]) + this.peek(this.tiempoInicialD[i]));
          console.log("Tiempo final: " + this.tiempoFinalD[i]);
          this.estadoProcesos[i] = true;
          console.log("Se va a añadir el tiempo final: " + this.peek(this.tiempoFinalD[i]) + " al arreglo de tiempos");
          conjuntoTiemposFinales[i] = (this.peek(this.tiempoFinalD[i]));
          let popped = this.procesos3.shift();
          console.log("Se ha quitado a: " + popped);
          console.log("El arreglo queda como: " + this.procesos3);
          rondas++;
          console.log("Valor Rondas"+ rondas);
          console.log("Valor N" + n);
          if(rondas > (n-1)){
              var valor = this.arrayMin(conjuntoTiemposFinales);
              console.log("Estoy entrando, y el valor es:" + conjuntoTiemposFinales);
              console.log("El valor que se quitará es: " + valor );
              var index = conjuntoTiemposFinales.indexOf(valor);
              if(index == 0){
                conjuntoTiemposFinales.shift();
                conjuntoTiemposFinales.unshift(1000000000000);
              }else if(index > 0 && index < conjuntoTiemposFinales.length -1){
                var copiaTiempos = conjuntoTiemposFinales;
                var primeraParte = conjuntoTiemposFinales.slice(0, index);
                var segundaParte = copiaTiempos.slice((index+1),copiaTiempos.length);
                var primeraYExtra = primeraParte.concat(1000000000000);
                conjuntoTiemposFinales = primeraYExtra.concat(segundaParte);
              }else{
                conjuntoTiemposFinales.pop();
                conjuntoTiemposFinales.push(1000000000000);
              }
              i = index;
              console.log("El arreglo queda como: " + conjuntoTiemposFinales);
              console.log("Valor de i: "+ i);
          }else{
            i++;
          }
    }
    console.log("Ha terminado  el ciclo de procesos 3");
    while(this.procesos4.length > 0 ){
        console.log("*** P R O C E S A D O R:"+ i + " ***");
        var proceso = this.peekFirst(this.procesos4);
        console.log("*Se va a analizar al proceso " + proceso + ", es decir al proceso: " + this.procesos[proceso]);
        this.procesosD[i].push(this.procesos[proceso]);
        this.tiempoEjecucionD[i].push(this.tiempoEjecucion[proceso]);
        this.tiempoBloqueoMD[i].push(tiempoDeBloque * this.tiempoBloqueo[proceso])
        console.log("Se ha añadido un tiempo de bloqueo, al arreglo: " + this.tiempoBloqueoMD[i] + " que corresponde al procesador: " + i);
        if(this.peek(this.tiempoFinalD[i]) != null){
            if(cuartoCC==false){
              this.tiempoCambioDeContextoD[i].push(0);
              cuartoCC = true;
            }else{
              console.log("*Dado que NO es el primer procesos que entra en el procesador " + i + " se realiza lo siguiente:");
              this.tiempoCambioDeContextoD[i].push(this.tiempoDeCambioDeContexto);
              console.log("Se ha añadido un tiempo de cambio de contexto, al arreglo: " + this.tiempoCambioDeContextoD[i] + " que corresponde al procesador: " + i);
            }
          }else{
            console.log("*Dado que es el primer proceso que entra en el procesador " + i + " se realiza lo siguiente:");
            this.tiempoCambioDeContextoD[i].push(0);
            console.log("Se ha añadido un tiempo de cambio de contexto, al arreglo: " + this.tiempoCambioDeContextoD[i] + " que corresponde al procesador: " + i);
            this.tiempoInicialD[i].push(0);
            console.log("Se ha añadido un tiempo incial, al arreglo: " + this.tiempoInicialD[i] + " que corresponde al procesador: " + i);
          }
          if((this.tiempoEjecucion[proceso]%this.tamQuantum != 0 && this.tiempoEjecucion[proceso]>this.tamQuantum) || (this.tiempoEjecucion[proceso] > this.tamQuantum)){
              console.log("*Dado a que el proceso es mayor al tamaño de quantum, se calcula su tiempo de Vencimiento del proceso: " + this.procesos[proceso] + ", se realiza lo siguiente:");
              var copiaTamQuantum = this.tamQuantum++;
              this.tiempoVencimientoDeQuantumD[i].push(Math.floor(this.tiempoEjecucion[proceso]/copiaTamQuantum) *  this.tiempoDeCambioDeContexto);
              console.log("Se ha añadido un tiempo de vencimiento de quantum, al arreglo: " + this.tiempoVencimientoDeQuantumD[i] + " que corresponde al procesador: " + i);
          }else{
              console.log("*Dado a que el proceso NO es mayor al tamaño de quantum, no se calcula su tiempo de Vencimiento del proceso: " + this.procesos[proceso] + ", se realiza lo siguiente:");
              this.tiempoVencimientoDeQuantumD[i].push(0)
              console.log("Se ha añadido un tiempo de vencimiento de quantum, al arreglo: " + this.tiempoVencimientoDeQuantumD[i] + " que corresponde al procesador: " + i);
          }
          if(this.peek(this.tiempoFinalD[i]) > 0){
            var temporal = this.peek(this.tiempoFinalD[i]);
            if(temporal < 4000 ){
              this.tiempoInicialD[i].push(4000);
            }else{
            console.log("*Dado a que el proceso NO es el primero en ser analizado en el procesador, se realiza lo siguiente:");
            console.log("Se ha añadido un tiempo inicial que corresponde al final del mismo procesador, es decir:");
            this.tiempoInicialD[i].push(temporal);
            console.log(this.tiempoInicialD[i]);
            }
          }
          console.log("*Dado a que se han calculado todos los tiempos, se saca el final:");
          this.tiempoFinalD[i].push(this.peek(this.tiempoCambioDeContextoD[i]) + this.peek(this.tiempoVencimientoDeQuantumD[i]) + this.tiempoEjecucion[proceso] + this.peek(this.tiempoBloqueoMD[i]) + this.peek(this.tiempoInicialD[i]));
          console.log("Tiempo final: " + this.tiempoFinalD[i]);
          this.estadoProcesos[i] = true;
          console.log("Se va a añadir el tiempo final: " + this.peek(this.tiempoFinalD[i]) + " al arreglo de tiempos");
          conjuntoTiemposFinales[i] = (this.peek(this.tiempoFinalD[i]));
          let popped = this.procesos4.shift();
          console.log("Se ha quitado a: " + popped);
          console.log("El arreglo queda como: " + this.procesos4);
          rondas++;
          console.log("Valor Rondas"+ rondas);
          console.log("Valor N" + n);
          if(rondas > (n-1)){
              var valor = this.arrayMin(conjuntoTiemposFinales);
              console.log("Estoy entrando, y el valor es:" + conjuntoTiemposFinales);
              console.log("El valor que se quitará es: " + valor );
              var index = conjuntoTiemposFinales.indexOf(valor);
              if(index == 0){
                conjuntoTiemposFinales.shift();
                conjuntoTiemposFinales.unshift(1000000000000);
              }else if(index > 0 && index < conjuntoTiemposFinales.length -1){
                var copiaTiempos = conjuntoTiemposFinales;
                var primeraParte = conjuntoTiemposFinales.slice(0, index);
                var segundaParte = copiaTiempos.slice((index+1),copiaTiempos.length);
                var primeraYExtra = primeraParte.concat(1000000000000);
                conjuntoTiemposFinales = primeraYExtra.concat(segundaParte);
              }else{
                conjuntoTiemposFinales.pop();
                conjuntoTiemposFinales.push(1000000000000);
              }
              i = index;
              console.log("El arreglo queda como: " + conjuntoTiemposFinales);
              console.log("Valor de i: "+ i);
          }else{
            i++;
          }
    }
    console.log("Ha terminado  el ciclo de procesos 4");
    while(this.procesos5.length > 0 ){
        console.log("*** P R O C E S A D O R:"+ i + " ***");
        var proceso = this.peekFirst(this.procesos5);
        console.log("*Se va a analizar al proceso " + proceso + ", es decir al proceso: " + this.procesos[proceso]);
        this.procesosD[i].push(this.procesos[proceso]);
        this.tiempoEjecucionD[i].push(this.tiempoEjecucion[proceso]);
        this.tiempoBloqueoMD[i].push(tiempoDeBloque * this.tiempoBloqueo[proceso])
        console.log("Se ha añadido un tiempo de bloqueo, al arreglo: " + this.tiempoBloqueoMD[i] + " que corresponde al procesador: " + i);
        if(this.peek(this.tiempoFinalD[i]) != null){
            if(quintoCC==false){
              this.tiempoCambioDeContextoD[i].push(0);
              quintoCC = true;
            }else{
              console.log("*Dado que NO es el primer procesos que entra en el procesador " + i + " se realiza lo siguiente:");
              this.tiempoCambioDeContextoD[i].push(this.tiempoDeCambioDeContexto);
              console.log("Se ha añadido un tiempo de cambio de contexto, al arreglo: " + this.tiempoCambioDeContextoD[i] + " que corresponde al procesador: " + i);
            }
          }else{
            console.log("*Dado que es el primer proceso que entra en el procesador " + i + " se realiza lo siguiente:");
            this.tiempoCambioDeContextoD[i].push(0);
            console.log("Se ha añadido un tiempo de cambio de contexto, al arreglo: " + this.tiempoCambioDeContextoD[i] + " que corresponde al procesador: " + i);
            this.tiempoInicialD[i].push(0);
            console.log("Se ha añadido un tiempo incial, al arreglo: " + this.tiempoInicialD[i] + " que corresponde al procesador: " + i);
          }
          if((this.tiempoEjecucion[proceso]%this.tamQuantum != 0 && this.tiempoEjecucion[proceso]>this.tamQuantum) || (this.tiempoEjecucion[proceso] > this.tamQuantum)){
              console.log("*Dado a que el proceso es mayor al tamaño de quantum, se calcula su tiempo de Vencimiento del proceso: " + this.procesos[proceso] + ", se realiza lo siguiente:");
              var copiaTamQuantum = this.tamQuantum++;
              this.tiempoVencimientoDeQuantumD[i].push(Math.floor(this.tiempoEjecucion[proceso]/copiaTamQuantum) *  this.tiempoDeCambioDeContexto);
              console.log("Se ha añadido un tiempo de vencimiento de quantum, al arreglo: " + this.tiempoVencimientoDeQuantumD[i] + " que corresponde al procesador: " + i);
          }else{
              console.log("*Dado a que el proceso NO es mayor al tamaño de quantum, no se calcula su tiempo de Vencimiento del proceso: " + this.procesos[proceso] + ", se realiza lo siguiente:");
              this.tiempoVencimientoDeQuantumD[i].push(0)
              console.log("Se ha añadido un tiempo de vencimiento de quantum, al arreglo: " + this.tiempoVencimientoDeQuantumD[i] + " que corresponde al procesador: " + i);
          }
          if(this.peek(this.tiempoFinalD[i]) > 0){
            if(temporal < 8000 ){
              this.tiempoInicialD[i].push(8000);
            }else{
            console.log("*Dado a que el proceso NO es el primero en ser analizado en el procesador, se realiza lo siguiente:");
            console.log("Se ha añadido un tiempo inicial que corresponde al final del mismo procesador, es decir:");
            this.tiempoInicialD[i].push(temporal);
            console.log(this.tiempoInicialD[i]);
            }
          }
          console.log("*Dado a que se han calculado todos los tiempos, se saca el final:");
          this.tiempoFinalD[i].push(this.peek(this.tiempoCambioDeContextoD[i]) + this.peek(this.tiempoVencimientoDeQuantumD[i]) + this.tiempoEjecucion[proceso] + this.peek(this.tiempoBloqueoMD[i]) + this.peek(this.tiempoInicialD[i]));
          console.log("Tiempo final: " + this.tiempoFinalD[i]);
          this.estadoProcesos[i] = true;
          console.log("Se va a añadir el tiempo final: " + this.peek(this.tiempoFinalD[i]) + " al arreglo de tiempos");
          conjuntoTiemposFinales[i] = (this.peek(this.tiempoFinalD[i]));
          let popped = this.procesos5.shift();
          console.log("Se ha quitado a: " + popped);
          console.log("El arreglo queda como: " + this.procesos5);
          rondas++;
          console.log("Valor Rondas"+ rondas);
          console.log("Valor N" + n);
          if(rondas > (n-1)){
              var valor = this.arrayMin(conjuntoTiemposFinales);
              console.log("Estoy entrando, y el valor es:" + conjuntoTiemposFinales);
              console.log("El valor que se quitará es: " + valor );
              var index = conjuntoTiemposFinales.indexOf(valor);
              if(index == 0){
                conjuntoTiemposFinales.shift();
                conjuntoTiemposFinales.unshift(1000000000000);
              }else if(index > 0 && index < conjuntoTiemposFinales.length -1){
                var copiaTiempos = conjuntoTiemposFinales;
                var primeraParte = conjuntoTiemposFinales.slice(0, index);
                var segundaParte = copiaTiempos.slice((index+1),copiaTiempos.length);
                var primeraYExtra = primeraParte.concat(1000000000000);
                conjuntoTiemposFinales = primeraYExtra.concat(segundaParte);
              }else{
                conjuntoTiemposFinales.pop();
                conjuntoTiemposFinales.push(1000000000000);
              }
              i = index;
              console.log("El arreglo queda como: " + conjuntoTiemposFinales);
              console.log("Valor de i: "+ i);
          }else{
            i++;
          }
    }
    console.log("Ha terminado  el ciclo de procesos 5");
    this.after=true;
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
   this.procesosD = {};
   this.tiempoEjecucionD = {};
   this.tiempoCambioDeContextoD = {};
   this.tiempoVencimientoDeQuantumD = {};
   this.tiempoBloqueoMD = {};
   this.tiempoInicialD = {};
   this.tiempoFinalD = {};
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
    this.estadoProcesos[i] = false;
  }
  // Métodos que sirven como listeners de los inputs de los tiempos de ejecución de los procesos de html.
  onKeyTiempoProceso(event: any ,i:number){
    this.tiempoEjecucion[i] = parseInt(event.target.value);
  }
  // Métodos que sirven como listeners de los inputs de los tiempos de inicio de los procesos de html.
  onKeyTiempoInicio(event: any ,i:number){
    this.tiempoInicio[i] = parseInt(event.target.value);
  }
  // Métodos que sirven como listeners de los inputs de los tiempos de bloqueo de los procesos de html.
  onKeyTiempoBloqueo(event: any ,i:number){
    this.tiempoBloqueo[i] = parseInt(event.target.value);
  }
  agrupar(procesos1, procesos2, procesos3, procesos4, procesos5){
    var limite = 0;
    if(this.n < 1){
      limite = this.texto.length;
    }else{
      limite = this.n;
    }
    for(let i=0;i<limite;i++){
      if(this.tiempoInicio[i]==0){
      procesos1.push(i);
      console.log(" indice procesos1:"+ procesos1);
      }
      if(this.tiempoInicio[i]==1500){
      procesos2.push(i);
      console.log(" indice procesos2:"+ procesos2);
      }
      if(this.tiempoInicio[i]==3000){
      procesos3.push(i);
      console.log("indice procesos3"+ procesos3);
      }
      if(this.tiempoInicio[i]==4000){
      procesos4.push(i);
      console.log(" indice procesos4"+ procesos4);
      }
      if(this.tiempoInicio[i]==8000){
      procesos5.push(i);
      console.log("indice procesos5"+ procesos5);
      }
    }
  }
  peek(arreglo){
      for(let i = 0; i<=arreglo.length -1; i++){
        if(i == arreglo.length-1){
          var resultrado = arreglo[i];
          return resultrado;
        }
      }
  }
  peekFirst(arreglo){
      for(let i = 0; i<=arreglo.length -1; i++){
        if(i == 0){
          var resultrado = arreglo[i];
          return resultrado;
        }
      }
  }
  arrayMin(arr) {
  var len = arr.length, min = Infinity;
  while (len--) {
    if (arr[len] < min) {
      min = arr[len];
    }
  }
  return min;
  };
  openErrorDialog(error){
  this.snackBarError.open("Error: "+ error, "", {
    duration: 6000,
    panelClass: 'error-snackbar'
  });
}
}
