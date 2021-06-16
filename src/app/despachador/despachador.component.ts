import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { trigger, state, style, animate, transition } from '@angular/animations';
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
  // Variables de Lectura de Archivo
  public texto : String[] = [];
  // Variables para Visualización de Tabla con Resultados
  public after = false;
  public after0 = false;
  // Variable para contabilizar la cantidad de Procesos.
  // También utiliza para contabilzar procesos ingresados
  // Manualmente.
  public n = 0;
  // Variables para generar distribución de procesos 
  // con un microprocesador.
  public procesos : string[] = [];
  public nProcesos = [] ;
  public fillTiempoCambioContexto : number[] = [];
  public fillTiempoVencimientoQuantum : number[] = [];
  public fillTiempoDeBloqueo : number[] = [];
  public tiempoBloqueo : number[] = [];
  public tiempoEjecucion : number[] = [];
  public tiempoInicio : number[] = [];
  public tiempoDeCambioDeContexto : number;
  public procesadores : number;
  public tamQuantum : number;
  public tiempoInicioMicroprocesador : number[] = [];
  public tiempoFinalMicroprocesador : number[] = [];
  public tiempoDeVencimientoDeQuantumMicroprocesador : number[] = [];
  // Variables para generar distribución de procesos 
  // con más de un microprocesador.
  public procesosD : {};
  public estadoProcesos : boolean[] = [];
  public tiempoEjecucionD : {};
  public tiempoCambioDeContextoD : {};
  public tiempoVencimientoDeQuantumD : {};
  public tiempoBloqueoMD : {};
  public tiempoInicialD : {};
  public tiempoFinalD : {};
  // Variables para agrupar procesos con base
  // en su tiempo de inicio.
  public procesosConIncioEn0:number[]=[];
  public procesosConIncioEn1500:number[]=[];
  public procesosConIncioEn3000:number[]=[];
  public procesosConIncioEn4000:number[]=[];
  public procesosConIncioEn8000: number[] = [];
  // Variable que determina si se se activan los campos
  // para agregar procesos manualmente por medio del ngIg
  // en el .html
  public showhideAgregarEliminarProceso: boolean;
  constructor(public snackBarError: MatSnackBar) { }
  ngOnInit() {}
  /* 
  *                       limpiarInformación  
  *   Método para limpiar variables a usar en 'generarDistribucion', 
  *   ya que el programa se puede ejecutar varias veces.
  *   Información Adicional en: 
  *   Página:
  */
  limipiarInformación(){
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
  /* 
  *                       cargarArchivo  
  *   Método para obtención de información a través de 
  *   archivo 'txt'.
  *   Información Adicional en: 
  *   Página:
  */
  cargarArchivo = ($event) => {
    var informacionGuardada = [];
    var cantidadDeArchivos = $event.target.files;
    for (var i = 0; i < cantidadDeArchivos.length; i++) {
        var archivoDeIndice = cantidadDeArchivos[i];
        var reader = new FileReader();
        reader.onload = (function (file) { 
            return function (e) {
                var data = this.result; 
                informacionGuardada.push(data)
            }
        })(archivoDeIndice);
        reader.readAsText(archivoDeIndice);
    }
    this.texto = informacionGuardada;
  }
  /* 
  *                       lecturaArchivo  
  *   Método para obtención de información a través de 
  *   archivo 'txt' y asignación de infotmación en arreglo de string
  *   'texto'.
  *   Información Adicional en: 
  *   Página:
  */
  lecturaArchivo(arregloInformacion){
    var lineas = arregloInformacion[0].split("\n");
    var variables : any[] = [];
    for (let i = 0; i < lineas.length; i++) {
      variables.push(lineas[i].split(","));
    }
    this.texto = variables;
  }
  /* 
  *                       agregarProceso  
  *   Método para aumentar 4 nuevos bloques de ingreso
  *   de proceso de forma manual, igualmente, aumenta el
  *   valor de n, el cual es parámetro importante en la lógica. 
  *   Información Adicional en: 
  *   Página:
  */
  agregarProceso(){
    this.nProcesos.push(1);
    this.n = this.nProcesos.length+1;
  }
  /* 
  *                       agregarProceso  
  *   Método para eliminar 4 nuevos bloques de ingreso
  *   de proceso de forma manual, igualmente, dminuye el
  *   valor de n, el cual es parámetro importante en la lógica. 
  *   Información Adicional en: 
  *   Página:
  */
  eliminarProceso(){
    this.nProcesos.pop();
    this.n = this.nProcesos.length-1;
  }
  /* 
  *                       agruparProcesoPorTiempoDeInicio  
  *   Método para agrupar procesos con base en su tiempo 
  *   de inico, algunos tienen que ser ejecutador en distinto tiempo
  *   que otros, se guardan en una pila 
  *   Información Adicional en: 
  *   Página:
  */
  agruparProcesoPorTiempoDeInicio(procesosConIncioEn0, procesosConIncioEn1500, procesosConIncioEn3000, procesosConIncioEn4000, procesosConIncioEn8000){
    var limite = 0;
    if(this.n < 1){
      limite = this.texto.length;
    }else{
      limite = this.n;
    }
    for(let i=0;i<limite;i++){
      switch (this.tiempoInicio[i]) {
        case 0:
          procesosConIncioEn0.push(i);
          break;
        case 1500:
          procesosConIncioEn1500.push(i);
          break;
        case 3000:
          procesosConIncioEn3000.push(i);
          break;
        case 4000:
          procesosConIncioEn4000.push(i);
          break;
        case 8000:
          procesosConIncioEn8000.push(i);
          break;
        default:
          console.log('Tiempo de Inicio no válido');
      }
    }
  }
  /* 
  *                       generarDistribución  
  *   Método principal y aquel que hace la mayor lógica 
  *   realiza la distribución de los procesos con base en la cantidad
  *   de microprocesadores y el tiempo de inicio de cada proceso.
  *   Información Adicional en: 
  *   Página:
  */
  generarDistribucion = (tamQuantum, procesadores, tiempoCambio, tiempoDeBloqueo) => {
    // limite2 funge como variable para determinar el número 
    // de procesos que se ejecutaran en los microprocesadores.
    var limite2 = 0;
    this.limipiarInformación();
    // Validaciones, los datos no puedes ser 0 o negativos,
    //                     en caso contrario, se almacenan los 
    //                     valores.
    if(tamQuantum <= 0){
      this.openErrorDialog('El tamaño de quantum debe ser mayor a 0');
      return false;
    }else{
      this.tamQuantum = parseInt(tamQuantum);
    }
    if(procesadores <= 0){
      this.openErrorDialog('El número de microprocesadores no puede ser  menor o igual a  0');
      return false;
    }else{
      this.procesadores = parseInt(procesadores);
    }
    if(tiempoCambio <= 0){
      this.openErrorDialog('El tiempo de Cambio de Contexto debe ser mayor a 0');
      return false;
    }else{
      this.tiempoDeCambioDeContexto = parseInt(tiempoCambio);
    }
    if(tiempoDeBloqueo <= 0){
      this.openErrorDialog('El tiempo de Bloqueo debe ser mayor a 0');
      return false;
    }
    //Terminan Validaciones.    
    /* En el caso de que no se hayan agregado procesos manualmente
    *   se registrarán por medio de lectura de archivos,
    *   'n' es un parámetro que unicamente se incrementa cuando
    *   se agregan procesos manualmente.
    */
    if(this.n < 1){
      this.lecturaArchivo(this.texto);
      for(let i = 0; i < this.texto.length; i++){
        this.procesos[i] = this.texto[i][0];
        this.tiempoEjecucion[i] = parseInt(this.texto[i][1]);
        this.tiempoBloqueo[i] = parseInt(this.texto[i][2]);
        this.tiempoInicio[i] = parseInt(this.texto[i][3]);
      }
      limite2 = this.texto.length;
    }else{
      limite2 = this.n-1;
    }
    this.after0 = true;  
    if (this.procesadores == 1){
      this.agruparProcesoPorTiempoDeInicio(this.procesosConIncioEn0, this.procesosConIncioEn1500, this.procesosConIncioEn3000,
                                                                this.procesosConIncioEn4000, this.procesosConIncioEn8000);
      for (let j = 0; j < limite2; j++) {
        if((this.tiempoEjecucion[j]%this.tamQuantum != 0 && this.tiempoEjecucion[j]>this.tamQuantum) ||
        (this.tiempoEjecucion[j] > this.tamQuantum)){
          var copiaTamQuantum = this.tamQuantum++;
          this.fillTiempoVencimientoQuantum[j] = Math.floor(this.tiempoEjecucion[j] / copiaTamQuantum) * this.tiempoDeCambioDeContexto;
        }else{
          this.fillTiempoVencimientoQuantum[j] = 0
        }
        this.fillTiempoDeBloqueo[j] = tiempoDeBloqueo * this.tiempoBloqueo[j];
        if(j==0){
          this.fillTiempoCambioContexto[j] = 0;
          this.tiempoInicioMicroprocesador[j] = 0;
        }else{
          this.fillTiempoCambioContexto[j] = this.tiempoDeCambioDeContexto;
          this.tiempoInicioMicroprocesador[j] = this.tiempoFinalMicroprocesador[j-1];
        }    
        this.tiempoFinalMicroprocesador[j] = this.fillTiempoCambioContexto[j] + this.fillTiempoVencimientoQuantum[j] +
        this.tiempoEjecucion[j] + this.fillTiempoDeBloqueo[j] + this.tiempoInicioMicroprocesador[j];
        }
    }else{
      this.agruparProcesoPorTiempoDeInicio(this.procesosConIncioEn0, this.procesosConIncioEn1500, this.procesosConIncioEn3000,
                                                                this.procesosConIncioEn4000, this.procesosConIncioEn8000);
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
      }
      while(this.procesosConIncioEn0.length > 0 ){
          var proceso = this.peekFirst(this.procesosConIncioEn0);
          this.procesosD[i].push(this.procesos[proceso]);
          this.tiempoEjecucionD[i].push(this.tiempoEjecucion[proceso]);
          this.tiempoBloqueoMD[i].push(tiempoDeBloqueo * this.tiempoBloqueo[proceso]);
          if(this.peek(this.tiempoFinalD[i]) != null){
            this.tiempoCambioDeContextoD[i].push(this.tiempoDeCambioDeContexto);
          }else{
            this.tiempoCambioDeContextoD[i].push(0);
            this.tiempoInicialD[i].push(0);
          }
          if((this.tiempoEjecucion[proceso]%this.tamQuantum != 0 && this.tiempoEjecucion[proceso]>this.tamQuantum) || (this.tiempoEjecucion[proceso] > this.tamQuantum)){
              var copiaTamQuantum = this.tamQuantum++;
              this.tiempoVencimientoDeQuantumD[i].push(Math.floor(this.tiempoEjecucion[proceso]/copiaTamQuantum) *  this.tiempoDeCambioDeContexto);
          }else{
              this.tiempoVencimientoDeQuantumD[i].push(0)
          }
          if(this.peek(this.tiempoFinalD[i]) > 0){
            var temporal = this.peek(this.tiempoFinalD[i]);
            this.tiempoInicialD[i].push(temporal);
          }
          this.tiempoFinalD[i].push(this.peek(this.tiempoCambioDeContextoD[i]) + this.peek(this.tiempoVencimientoDeQuantumD[i]) + this.tiempoEjecucion[proceso] + this.peek(this.tiempoBloqueoMD[i]) + this.peek(this.tiempoInicialD[i]));
          this.estadoProcesos[i] = true;
          conjuntoTiemposFinales[i] = (this.peek(this.tiempoFinalD[i]));
          let popped = this.procesosConIncioEn0.shift();
          rondas++;
          if(rondas > (n-1)){
            var valor = this.arrayMin(conjuntoTiemposFinales);
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
          }else{
            i++;
          }
      }
      while(this.procesosConIncioEn1500.length > 0 ){
        var proceso = this.peekFirst(this.procesosConIncioEn1500);
        this.procesosD[i].push(this.procesos[proceso]);
        this.tiempoEjecucionD[i].push(this.tiempoEjecucion[proceso]);
        this.tiempoBloqueoMD[i].push(tiempoDeBloqueo * this.tiempoBloqueo[proceso])
        if(this.peek(this.tiempoFinalD[i]) != null){
            if(segundoCC==false){
              this.tiempoCambioDeContextoD[i].push(0);
              segundoCC = true;
            }else{
              this.tiempoCambioDeContextoD[i].push(this.tiempoDeCambioDeContexto);
            }
        }else{
          this.tiempoCambioDeContextoD[i].push(0);
          this.tiempoInicialD[i].push(0);
        }
        if((this.tiempoEjecucion[proceso]%this.tamQuantum != 0 && this.tiempoEjecucion[proceso]>this.tamQuantum) || (this.tiempoEjecucion[proceso] > this.tamQuantum)){
            var copiaTamQuantum = this.tamQuantum++;
            this.tiempoVencimientoDeQuantumD[i].push(Math.floor(this.tiempoEjecucion[proceso]/copiaTamQuantum) *  this.tiempoDeCambioDeContexto);
            }else{
              this.tiempoVencimientoDeQuantumD[i].push(0)
            }
        if(this.peek(this.tiempoFinalD[i]) > 0){
            var temporal = this.peek(this.tiempoFinalD[i]);
            if(temporal < 1500 ){
            this.tiempoInicialD[i].push(1500);
            }else{
            this.tiempoInicialD[i].push(temporal);
            }
        }
        this.tiempoFinalD[i].push(this.peek(this.tiempoCambioDeContextoD[i]) + this.peek(this.tiempoVencimientoDeQuantumD[i]) + this.tiempoEjecucion[proceso] + this.peek(this.tiempoBloqueoMD[i]) + this.peek(this.tiempoInicialD[i]));
        this.estadoProcesos[i] = true;
        conjuntoTiemposFinales[i] = (this.peek(this.tiempoFinalD[i]));
        let popped = this.procesosConIncioEn1500.shift();
        rondas++;
        if(rondas > (n-1)){
          var valor = this.arrayMin(conjuntoTiemposFinales);
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
        }else{
          i++;
        }
      }
      while(this.procesosConIncioEn3000.length > 0 ){
        var proceso = this.peekFirst(this.procesosConIncioEn3000);
        this.procesosD[i].push(this.procesos[proceso]);
        this.tiempoEjecucionD[i].push(this.tiempoEjecucion[proceso]);
        this.tiempoBloqueoMD[i].push(tiempoDeBloqueo * this.tiempoBloqueo[proceso])
        if(this.peek(this.tiempoFinalD[i]) != null){
          if(terceroCC==false){
            this.tiempoCambioDeContextoD[i].push(0);
            terceroCC = true;
            }else{
            this.tiempoCambioDeContextoD[i].push(this.tiempoDeCambioDeContexto);
            }
        }else{
          this.tiempoCambioDeContextoD[i].push(0);
          this.tiempoInicialD[i].push(0);
        }
        if((this.tiempoEjecucion[proceso]%this.tamQuantum != 0 && this.tiempoEjecucion[proceso]>this.tamQuantum) || (this.tiempoEjecucion[proceso] > this.tamQuantum)){
          var copiaTamQuantum = this.tamQuantum++;
          this.tiempoVencimientoDeQuantumD[i].push(Math.floor(this.tiempoEjecucion[proceso]/copiaTamQuantum) *  this.tiempoDeCambioDeContexto);
        }else{
          this.tiempoVencimientoDeQuantumD[i].push(0)
        }
        if(this.peek(this.tiempoFinalD[i]) > 0){
          var temporal = this.peek(this.tiempoFinalD[i]);
          if(temporal < 3000 ){
            this.tiempoInicialD[i].push(3000);
          }else{
            this.tiempoInicialD[i].push(temporal);
          }
        }
        this.tiempoFinalD[i].push(this.peek(this.tiempoCambioDeContextoD[i]) + this.peek(this.tiempoVencimientoDeQuantumD[i]) + this.tiempoEjecucion[proceso] + this.peek(this.tiempoBloqueoMD[i]) + this.peek(this.tiempoInicialD[i]));
        this.estadoProcesos[i] = true;
        conjuntoTiemposFinales[i] = (this.peek(this.tiempoFinalD[i]));
        let popped = this.procesosConIncioEn3000.shift();
        rondas++;
        if(rondas > (n-1)){
          var valor = this.arrayMin(conjuntoTiemposFinales);
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
        }else{
          i++;
        }
      }
      while(this.procesosConIncioEn4000.length > 0 ){
        var proceso = this.peekFirst(this.procesosConIncioEn4000);
        this.procesosD[i].push(this.procesos[proceso]);
        this.tiempoEjecucionD[i].push(this.tiempoEjecucion[proceso]);
        this.tiempoBloqueoMD[i].push(tiempoDeBloqueo * this.tiempoBloqueo[proceso])
        if(this.peek(this.tiempoFinalD[i]) != null){
          if(cuartoCC==false){
            this.tiempoCambioDeContextoD[i].push(0);
            cuartoCC = true;
          }else{
            this.tiempoCambioDeContextoD[i].push(this.tiempoDeCambioDeContexto);
          }
        }else{
          this.tiempoCambioDeContextoD[i].push(0);
          this.tiempoInicialD[i].push(0);
        }
        if((this.tiempoEjecucion[proceso]%this.tamQuantum != 0 && this.tiempoEjecucion[proceso]>this.tamQuantum) || (this.tiempoEjecucion[proceso] > this.tamQuantum)){
          var copiaTamQuantum = this.tamQuantum++;
          this.tiempoVencimientoDeQuantumD[i].push(Math.floor(this.tiempoEjecucion[proceso]/copiaTamQuantum) *  this.tiempoDeCambioDeContexto);
        }else{
          this.tiempoVencimientoDeQuantumD[i].push(0)
        }
        if(this.peek(this.tiempoFinalD[i]) > 0){
          var temporal = this.peek(this.tiempoFinalD[i]);
          if(temporal < 4000 ){
            this.tiempoInicialD[i].push(4000);
          }else{
            this.tiempoInicialD[i].push(temporal);
          }
        }
        this.tiempoFinalD[i].push(this.peek(this.tiempoCambioDeContextoD[i]) + this.peek(this.tiempoVencimientoDeQuantumD[i]) + this.tiempoEjecucion[proceso] + this.peek(this.tiempoBloqueoMD[i]) + this.peek(this.tiempoInicialD[i]));
        this.estadoProcesos[i] = true;
        conjuntoTiemposFinales[i] = (this.peek(this.tiempoFinalD[i]));
        let popped = this.procesosConIncioEn4000.shift();
        rondas++;
        if(rondas > (n-1)){
          var valor = this.arrayMin(conjuntoTiemposFinales);
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
        }else{
          i++;
        }
      }
      while(this.procesosConIncioEn8000.length > 0 ){
        var proceso = this.peekFirst(this.procesosConIncioEn8000);
        this.procesosD[i].push(this.procesos[proceso]);
        this.tiempoEjecucionD[i].push(this.tiempoEjecucion[proceso]);
        this.tiempoBloqueoMD[i].push(tiempoDeBloqueo * this.tiempoBloqueo[proceso])
        if(this.peek(this.tiempoFinalD[i]) != null){
          if(quintoCC==false){
            this.tiempoCambioDeContextoD[i].push(0);
            quintoCC = true;
          }else{
            this.tiempoCambioDeContextoD[i].push(this.tiempoDeCambioDeContexto);
          }
        }else{
          this.tiempoCambioDeContextoD[i].push(0);
          this.tiempoInicialD[i].push(0);
        }
        if((this.tiempoEjecucion[proceso]%this.tamQuantum != 0 && this.tiempoEjecucion[proceso]>this.tamQuantum) || (this.tiempoEjecucion[proceso] > this.tamQuantum)){
          var copiaTamQuantum = this.tamQuantum++;
          this.tiempoVencimientoDeQuantumD[i].push(Math.floor(this.tiempoEjecucion[proceso]/copiaTamQuantum) *  this.tiempoDeCambioDeContexto);
        }else{
          this.tiempoVencimientoDeQuantumD[i].push(0)
        }
        if(this.peek(this.tiempoFinalD[i]) > 0){
          if(temporal < 8000 ){
            this.tiempoInicialD[i].push(8000);
          }else{
            this.tiempoInicialD[i].push(temporal);
          }
        }
        this.tiempoFinalD[i].push(this.peek(this.tiempoCambioDeContextoD[i]) + this.peek(this.tiempoVencimientoDeQuantumD[i]) + this.tiempoEjecucion[proceso] + this.peek(this.tiempoBloqueoMD[i]) + this.peek(this.tiempoInicialD[i]));
        this.estadoProcesos[i] = true;
        conjuntoTiemposFinales[i] = (this.peek(this.tiempoFinalD[i]));
        let popped = this.procesosConIncioEn8000.shift();
        rondas++;
        if(rondas > (n-1)){
          var valor = this.arrayMin(conjuntoTiemposFinales);
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
        }else{
          i++;
        }
      }
    }
    this.after = true; 
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
  // Métodos de peek, peekfirst y array min, no se incluyen en la libreria por default, por lo tanto
  // se crean de forma tradicional.
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
