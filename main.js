let cantidadParejas = 6;
let $tablero = document.querySelector("#tablero");
let distribucion = [0,0,1,1,2,2,3,3,4,4,5,5];
let tarjetasEnEspera = [];

mezclarArray(distribucion);

comenzarJuego();

function comenzarJuego() {
    habilitarSeleccionTarjetas();
    cambiarAlerta("Juga YA!");
}

function evaluarSeleccion() {
    //pre: hay dos tarjetas DISTINTAS en espera
    if(tarjetasEnEspera.length === 2) {
        $tarjeta1 = tarjetasEnEspera[0];
        $tarjeta2 = tarjetasEnEspera[1];

        deshabilitarSeleccionTarjetas();
        if(obtenerValorTarjeta(tarjetasEnEspera[0]) === obtenerValorTarjeta(tarjetasEnEspera[1])) {
            cantidadParejas--;
            $tarjeta1.classList.add("encontrada");
            $tarjeta2.classList.add("encontrada");
            evaluarJuego();
            setTimeout(cambiarAlerta, 500, "Muy bien!");
        }else {
            setTimeout(cambiarAlerta, 500, "Ups!");
            setTimeout(function() {
                voltearAbajo($tarjeta1);
                voltearAbajo($tarjeta2);
            }, 1000);

        }
        setTimeout(cambiarAlerta, 1000, "Juga YA!");
        setTimeout(habilitarSeleccionTarjetas, 1000);
        tarjetasEnEspera = [];
    }
}

function evaluarJuego() {
    if(cantidadParejas === 0) {
        document.querySelector("#alerta-estado").textContent = "Ganaste!";
    }
}

function manejarSeleccionTarjeta($tarjeta) {
    if(!$tarjeta.classList.contains("encontrada")) {
        if(!$tarjeta.classList.contains("volteada")) {
            $tarjeta.classList.add("volteada");
            voltearArriba($tarjeta);
            tarjetasEnEspera.push($tarjeta);
            evaluarSeleccion();
        } else {
            voltearAbajo($tarjeta);
            tarjetasEnEspera.pop();
        }
    }
}

function habilitarSeleccionTarjetas() {
    $tablero.onclick = function(e) {
        const $elemento = e.target;
        if($elemento.classList.contains("tarjeta")) {
            manejarSeleccionTarjeta($elemento);
        }
    }
}

function deshabilitarSeleccionTarjetas() {
    $tablero.onclick = function(e) {
    }
}

function voltearArriba($tarjeta) {
    $tarjeta.classList.add("bg-primary");
    $tarjeta.textContent = distribucion[Number($tarjeta.id)];
}

function voltearAbajo($tarjeta) {
    $tarjeta.classList.remove("bg-primary");
    $tarjeta.classList.remove("volteada");
    $tarjeta.textContent = "?";
}

function mezclarArray(array){
    array.sort(function() {
        return Math.random() - 0.5;
    });
}

function obtenerValorTarjeta($tarjeta) {
    return $tarjeta.textContent;
}

function cambiarAlerta(mensaje) {
    document.querySelector("#alerta-estado").textContent = mensaje;
}
