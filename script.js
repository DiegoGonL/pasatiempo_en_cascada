var mi_diccionario = [];
var tabla_pasatiempo = [];
var pistas_restantes = 3
var palabra1 = "clan"
var palabra2 = "pena"
var palabra3 = "remato"
var palabra4 = "torero"
var cookies_aceptadas = (window.localStorage.getItem("cookies_aceptadas") == "true")

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
            celda.innerHTML = `<input type="text" maxlength="1" class="input_celda_pasatiempo" oninput="comprobar_pasatiempo()">`

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
                if (en_diccionario(palabra) && es_permutacion(n_fila)) {
                    set_fila_correcta(fila)
                }
                else {
                    set_fila_erronea(fila)
                }
                break;
        }
        if(cookies_aceptadas) {
            guardar_pasatiempo()
        }
    }else {
        set_fila_default(fila)
    }
}

function comprobar_pasatiempo(){
    for (let i = 0; i < tabla_pasatiempo.length; i++) {
        comprobar_fila(i)
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
    return coincidencias >= palabra_lista.length-1;
}

function set_fila_correcta(fila){

    for (let i = 0; i < fila.length; i++) {
        fila[i].firstChild.className = "input_celda_pasatiempo fila_correcta"
    }
}

function set_fila_erronea(fila){

    for (let i = 0; i < fila.length; i++) {
        fila[i].firstChild.className = "input_celda_pasatiempo fila_erronea"
    }
}

function set_fila_default(fila){

    for (let i = 0; i < fila.length; i++) {
        fila[i].firstChild.className = "input_celda_pasatiempo"
    }
}

function mostrar_pistas(){

    console.log("EYEYEY")
    let input = document.getElementById("input_pista")
    if (pistas_restantes > 0) {

        pistas_restantes --;

        window.localStorage.setItem("pistas_restantes", pistas_restantes.toString())

        let palabra = document.getElementById("input_pista").value

        input.placeholder = `Tienes ${pistas_restantes} pistas restantes`
        input.value = ""

        pistas = get_palabras_pistas(palabra)

        document.getElementById("div_lista_pistas").innerHTML = ""

        pistas.forEach(pista => {
            elemento = document.createElement("p")
            elemento.innerHTML = pista
            document.getElementById("div_lista_pistas").appendChild(elemento)
        })
    }else if (pistas_restantes === 0){
        input.placeholder = "No te quedan pistas!"
    }
    input.value = ""
}

function get_palabras_pistas(palabra) {

    palabra = palabra.split("")
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
}

function cargar_pasatiempo(){

    pistas_restantes = window.localStorage.getItem("pistas_restantes")

    let tabla = window.localStorage.getItem("pasatiempo")
    let filas = tabla.split(";")
    let celdas = []

    filas.forEach(f => {
        celdas = celdas.concat(f.split(","))
    })

    tabla_pasatiempo.forEach(f => {
        for (let i = 0; i < f.length ; i++) {
            f[i].firstChild.value = celdas.shift()
        }
    })

    comprobar_pasatiempo()
}

function limpiar_almacenamiento(){
    if (cookies_aceptadas) {
        window.localStorage.clear()
        window.alert("Almacenamiento borrado correctamente.")
    }else {
        window.alert("No hay nada que eliminar.")
    }
}

function set_tema(nombre_tema) {
    localStorage.setItem("tema", nombre_tema);
    document.documentElement.className = nombre_tema;
}

function cambiar_tema() {
    if (localStorage.getItem("tema") === "tema-oscuro") {
        set_tema("tema-claro");
    } else {
        set_tema("tema-oscuro");
    }
}

console.log(document.getElementById("input_pista"))

function on_load() {
    if (window.localStorage.getItem("pistas_restantes")){
        pistas_restantes = window.localStorage.getItem("pistas_restantes")
        document.getElementById("input_pista").placeholder = `Tienes ${pistas_restantes} pistas restantes`
    }else
        window.localStorage.setItem("pistas_restantes", pistas_restantes.toString())

    document.getElementById("input_pista").addEventListener("keydown", event => {
        if (event.key === "Enter" && document.getElementById("input_pista").value.trim() !== "") {
            mostrar_pistas()
        }
    });
}
fetch("https://ordenalfabetix.unileon.es/aw/diccionario.txt")
    .then(response => response.text())
    .then (data => data.split("\n"))
    .then (diccionario => {
        const palabras_ejemplo = ["cria", "nací", "nace", "tolero"]
        mi_diccionario = diccionario.concat(palabras_ejemplo)
        crear_tabla()
    })
    .catch( error => console.log(error));

function set_cookies(aceptadas){
    cookies_aceptadas = aceptadas;
    window.localStorage.setItem("cookies_aceptadas", aceptadas)
    document.getElementById("cookieConsentContainer").style.visibility = "hidden"
}

(function () {
    if (!cookies_aceptadas) {

        document.body.innerHTML += "<div class=\"cookieConsentContainer\" id=\"cookieConsentContainer\" style=\"opacity: 1; display: block;\">\n" +
            "    <div class=\"cookieTitle\">\n" +
            "        <a>Almacenamiento local.</a>\n" +
            "    </div>\n" +
            "    <div class=\"cookieDesc\">\n" +
            "        <p>¿Acepta que almacenemos datos de esta página web como la resolución parcial o el tema para su posterior recuperación?</p>\n" +
            "    </div>\n" +
            "        <div class=\"cookie_aceptar\">\n" +
            "            <a onclick=\"set_cookies(true)\">Acepto</a>\n" +
            "        </div>\n" +
            "        <div class=\"cookie_rechazo\">\n" +
            "            <a onclick=\"set_cookies(false)\">Rechazar</a>\n" +
            "        </div>\n" +
            "</div>"
    }
})();

(function () {
    if (localStorage.getItem('tema') === 'tema-claro') {
        set_tema('tema-claro');
        document.getElementById('slider').checked = true;
    } else {
        set_tema('tema-oscuro');
        document.getElementById('slider').checked = false;
    }
})();
