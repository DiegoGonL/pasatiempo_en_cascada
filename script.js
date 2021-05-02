var mi_diccionario = [];
var tabla_pasatiempo = [];
var pistas_restantes = 3
var palabra1 = "clan"
var palabra2 = "pena"
var palabra3 = "remato"
var palabra4 = "torero"

function crear_tabla() {

    for (let i = 0; i < 12; i++) {
        let longitud
        if (i < 6)
            longitud = 4
        else
            longitud = 6

        const fila_array = [];
        const fila_html = document.createElement("tr")

        for (let j = 0; j < longitud; j++) {
            const celda = document.createElement("td")
            celda.className = "celda_pasatiempo"
            celda.innerHTML = `<input type="text" maxlength="1" class="input_celda_pasatiempo" onchange="comprobar_fila(${i})">`

            fila_html.appendChild(celda)
            fila_array.push(celda)
        }
        tabla_pasatiempo.push(fila_array)
        document.getElementById("tabla_pasatiempo").appendChild(fila_html)
    }

    window.localStorage.getItem("pasatiempo") && cargar_pasatiempo()

}

function get_palabra(n_fila){
    let palabra = ""
    const fila = tabla_pasatiempo[n_fila]

    for (let i = 0; i < fila.length; i++) {
        palabra += fila[i].firstChild.value.toLowerCase()
    }
    return palabra
}

function comprobar_fila(n_fila){
    const fila = tabla_pasatiempo[n_fila]
    let palabra = get_palabra(n_fila)

    console.log(palabra)

    if (palabra.length === 4 && n_fila < 6 || palabra.length === 6 && n_fila >= 6 ) {
        switch (n_fila) {
            case 0:
                if (palabra === palabra1)
                    set_fila_correcta(fila)
                else
                    set_fila_erronea(fila)
                break;
            case 5:
                if (palabra === palabra2)
                    set_fila_correcta(fila)
                else
                    set_fila_erronea(fila)
                break;
            case 6:
                if (palabra === palabra3)
                    set_fila_correcta(fila)
                else
                    set_fila_erronea(fila)
                break;
            case 11:
                if (palabra === palabra4)
                    set_fila_correcta(fila)
                else
                    set_fila_erronea(fila)
                break;
            default:
                if (en_diccionario(palabra) && es_permutacion(n_fila))
                    set_fila_correcta(fila)
                else
                    set_fila_erronea(fila)
                break;
        }
    }else {
        set_fila_default(fila)
    }
}

function en_diccionario(palabra){
    return mi_diccionario.includes(palabra)
}

function normalizar (string){
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

function es_permutacion(n_fila){
    const palabra_ant = normalizar(get_palabra(n_fila-1))
    const palabra = normalizar(get_palabra(n_fila))

    if (palabra_ant === palabra)
        return false

    let palabra_ant_lista =  palabra_ant.split("")
    let palabra_lista = palabra.split("")
    let coincidencias = 0;

    for (let i = 0; i < palabra_ant_lista.length ; i++) {
        if (palabra_ant_lista.includes(palabra_lista[i])) {
            palabra_ant_lista[palabra_ant_lista.indexOf(palabra_lista[i])] = "-1"
            coincidencias++;
        }
    }
    console.log(coincidencias)
    return coincidencias >= palabra_lista.length-1;
}

function set_fila_correcta(fila){

    for (let i = 0; i < fila.length; i++) {
        fila[i].className = "celda_pasatiempo fila_correcta"
    }
}

function set_fila_erronea(fila){

    for (let i = 0; i < fila.length; i++) {
        fila[i].className = "celda_pasatiempo fila_erronea"
    }
}

function set_fila_default(fila){

    for (let i = 0; i < fila.length; i++) {
        fila[i].className = "celda_pasatiempo"
    }
}

function mostrar_pistas(){

    if (pistas_restantes > 0) {
        pistas_restantes --;

        pistas = get_palabras_pistas()

        document.getElementById("div_lista_pistas").innerHTML = ""

        pistas.forEach(pista => {
            elemento = document.createElement("p")
            elemento.innerHTML = pista
            document.getElementById("div_lista_pistas").appendChild(elemento)
        })
    }
}

function get_palabras_pistas() {

    let palabra = document.getElementById("input_pista").value.split("")
    let pistas = []
    let regex = ""

    palabra.forEach(letra => regex += `(?=.*${letra})`)

    mi_diccionario.forEach(palabra_dicc => {
        if (normalizar(palabra_dicc).match(regex) && (palabra_dicc.length === 4 || palabra_dicc.length === 6))
            pistas.push(palabra_dicc)
    })
    return pistas
}

function guardar_pasatiempo(){
    let filas = []

    tabla_pasatiempo.forEach(f => {
        let fila = []
        for (let i = 0; i < f.length ; i++) {
            fila.push(f[i].firstChild.value)
        }
        filas.push(fila.join())
    })

    window.localStorage.setItem("pasatiempo", filas.join(";"))
    window.localStorage.setItem("pistas_restantes", pistas_restantes.toString())
}

function cargar_pasatiempo(){
    let tabla = window.localStorage.getItem("pasatiempo")
    let filas = tabla.split(";")
    console.log("Filas", ...filas)
}

function limpiar_almacenamiento(){

}

fetch("https://ordenalfabetix.unileon.es/aw/diccionario.txt")
        .then(response => response.text())
        .then (data => data.split("\n"))
        .then (diccionario => {
            const palabras_ejemplo = ["cria", "nací", "nace"]
            mi_diccionario = diccionario.concat(palabras_ejemplo)
            crear_tabla()
        })
        .catch( error => console.log(error));
