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
    if(tarjetasEnEspera.length === 2) {
        $tarjeta1 = tarjetasEnEspera[0];
        $tarjeta2 = tarjetasEnEspera[1];

        deshabilitarSeleccionTarjetas();
        if(obtenerValorTarjeta(tarjetasEnEspera[0]) === obtenerValorTarjeta(tarjetasEnEspera[1])) {
            cantidadParejas--;
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

function habilitarSeleccionTarjetas() {
    document.querySelectorAll("#tablero .tarjeta").forEach(function($tarjeta) {
        $tarjeta.onclick = function() {
            if(!$tarjeta.classList.contains("seleccionado")) {
                $tarjeta.classList.add("seleccionado");
                voltearArriba($tarjeta);
                tarjetasEnEspera.push($tarjeta);
                evaluarSeleccion();
            }
        };
    });
}

function deshabilitarSeleccionTarjetas() {
    document.querySelectorAll("#tablero .tarjeta").forEach(function($tarjeta) {
        $tarjeta.onclick = function() {

        }
    });
}

function voltearArriba($tarjeta) {
    $tarjeta.classList.remove("seleccionado");
    $tarjeta.querySelector("p").textContent = distribucion[Number($tarjeta.id)];
}

function voltearAbajo($tarjeta) {
    $tarjeta.querySelector("p").textContent = "?";
}

function mezclarArray(array){
    array.sort(function() {
        return Math.random() - 0.5;
    });
}

function obtenerValorTarjeta($tarjeta) {
    return $tarjeta.querySelector("p").textContent;
}

function cambiarAlerta(mensaje) {
    document.querySelector("#alerta-estado").textContent = mensaje;
}
