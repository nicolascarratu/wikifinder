console.log()

let particulas = {
    particles: {
        number: {
            value: 100,
            density: {
                enable: false,
                value_area: 800
            }
        },
        color: {
            value: ["#ae11de", "#471fc8"]
        },
        shape: {
            type: "circle",
            stroke: {
                width: 0,
                color: "#000000"
            },
            polygon: {
                nb_sides: 5
            },
            image: {
                src: "img/github.svg",
                width: 100,
                height: 100
            }
        },
        opacity: {
            value: 0.1,
            random: false,
            anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 0.1,
            random: false,
            anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 200,
            color: "#9321e3",
            opacity: 0.5,
            width: 1
        },
        move: {
            enable: true,
            speed: 9,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "bounce",
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: false,
                mode: "repulse"
            },
            onclick: {
                enable: true,
                mode: "push"
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 250,
                line_linked: {
                    opacity: 0.8
                }
            },
            bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3
            },
            repulse: {
                distance: 200,
                duration: 0.4
            },
            push: {
                particles_nb: 15
            },
            remove: {
                particles_nb: 2
            }
        }
    },
    retina_detect: true
}

let url_wiki_1 = ''
let url_wiki_2 = ''

let url_link = 'https://en.wikipedia.org/?curid='
let url_base = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&explaintext&exsectionformat=wiki&titles='

let flag = false

let form = document.getElementById('form')
let progressBar = document.getElementById('progreso')
let busqueda_1 = document.getElementById('busqueda_1')
let busqueda_2 = document.getElementById('busqueda_2')
let boots_err = '<div class="alert alert-danger d-flex text-center col-8 col-sm-6 col-md-4 col-xl-2 justify-content-center" role="alert">'

let infoWiki_1 = {}
let infoWiki_2 = {}

let error = []
let clean_text = []
let seccion = []
let frases = []
let id = []
let disambiguation = ''
let desambiguada = false
let not_found = false

function testAndSearch(infoWiki, art, word) {
    if (infoWiki[-1] == undefined) {
        inputLimpio(infoWiki)
        if (desambiguacionTest(clean_text, art)) {
            findWord(clean_text, word.value, art.value)
            id.push(Object.keys(infoWiki))
        }
        else {
            desambiguada = true
            return desambiguada
        }
    }
    else if (!not_found && !desambiguada) {
        notFound(art)
        not_found = true

    }
}

document.addEventListener('DOMContentLoaded', () => {
    flag = false
    formInput()
    limpiar()
    particlesJS('particles-js', particulas, function () {
        console.log('callback - particles.js config loaded');
    });
    progressBar.style.width = '0%'

    document.getElementById('boton').addEventListener('click', () => {
        flag = true
        reseteo()
        progressBar.style.width = '25%'

        if (tomarDatos()) {
            allinonce().then(() => {
                testAndSearch(infoWiki_1, busqueda_1, busqueda_2)
                testAndSearch(infoWiki_2, busqueda_2, busqueda_1)

                if (!desambiguada && !not_found) {
                    mostrarDatos(seccion, frases, error);
                }

            })
        }

    })

})

function notFound(art) {
    let err = 'El articulo ' + art.value + ' no se ha encontrado.'
    document.getElementById('boton_1').style.display = 'none'
    document.getElementById('boton_2').style.display = 'none'
    document.getElementById('datos_err').innerHTML = boots_err + `${err} </div>`
    progressBar.style.width = '0%'
    return true
    
}

function limpiar() {
    document.getElementById('limpieza').addEventListener('click', () => {

        flag = false
        busqueda_1.value = ''
        busqueda_2.value = ''

        id = []

        document.getElementById('datos_1').innerHTML = ''
        document.getElementById('datos_2').innerHTML = ''

        document.getElementById('title_1').innerHTML = 'Articulo 1'
        document.getElementById('title_2').innerHTML = 'Articulo 2'

        document.getElementById('boton_1').style.display = 'none'
        document.getElementById('boton_2').style.display = 'none'

        progressBar.style.width = '0%'

    })
}

function formInput() {

    document.getElementById('form').addEventListener('input', () => {
        if (!flag) {
            document.getElementById('datos_1').innerHTML = 'Aquí se buscará el articulo ' + showInput1() + ' en el articulo ' + showInput2()
            document.getElementById('title_1').innerHTML = busqueda_1.value != '' ? busqueda_1.value : 'Articulo 1'
        }
    })

    document.getElementById('form').addEventListener('input', () => {
        if (!flag) {
            document.getElementById('datos_2').innerHTML = 'Aquí se buscará el articulo ' + showInput2() + ' en el articulo ' + showInput1()
            document.getElementById('title_2').innerHTML = busqueda_2.value != '' ? busqueda_2.value : 'Articulo 2'

        }
    })

}

function reseteo() {
    document.getElementById('datos_err').innerHTML = ''
    seccion = []
    error = []
    frases = []
    clean_text = []
    id = []
    not_found = false
    desambiguada = false

}


function regeX(word, str) {

    return RegExp('\\b' + word.toLowerCase() + '\\b').test(str.toLowerCase())
}

function desambiguacionTest(text, art) {
    let evaluate = regeX('refer to', text[0])
    let artMayus = art.value.charAt(0).toUpperCase() + art.value.slice(1)
    console.log(evaluate)
    if (evaluate && !desambiguada && !not_found) {
        disambiguation = 'La pagina ' + artMayus + ' tiene desambiguaciones.'
        let error = boots_err + `${disambiguation}</div>`
        document.getElementById('datos_err').innerHTML = error
        progressBar.style.width = '0%'
        return false
    }

    else if(evaluate){
        return false
    }
    return true
}

function inputLimpio(input) {
    const regex = new RegExp('(===)(.*?)(===)|(==)(.*?)(==)')
    let extracto = ''
    for (const key in input) {
        if (Object.hasOwnProperty.call(input, key)) {
            const element = input[key];
            extracto = element.extract
        }
    }

    const str = extracto

    const finalReg = str.replace(/[\n\r]/g, ' ')
    let sections = finalReg.split(regex)
    sections = sections.filter(function (element) {
        return element !== undefined;
    });
    clean_text = sections
    return clean_text
}

function findWord(text, busqueda, art) {
    const regex = new RegExp('(?<!\\w\\.\\w.)(?<![A-Z][a-z]\\.)(?<=\\.|\\?)\\s', 'gm')

    let seccion_text = ''
    let index_frase = 0

    let finding = false
    let find_word = false

    let result = []


    for (const [index, sentence] of text.entries()) {
        let evaluate = regeX(busqueda, sentence)
        if (evaluate) {
            seccion_text = sentence
            index_frase = index
            finding = true
            break
        }

        else if (text.at(-1) === sentence) {
            frases.push(false)
            seccion.push(art)
            let busqMayus = busqueda.charAt(0).toUpperCase() + busqueda.slice(1)
            error.push('No se menciona ' + busqMayus + ' en este artículo.')
            return
        }
    }
    if (text[index_frase - 2] && finding) {
        seccion.push(text[index_frase - 2])
    }

    else if (finding) {
        seccion.push('Summary')
    }

    result = seccion_text.split(regex);
    for (const sentence of result) {
        let evaluate_2 = regeX(busqueda, sentence)
        if (evaluate_2) {
            find_word = true
            frases.push(sentence)
            console.log(sentence)
            error.push(false)
            break

        }
    }
    if (!(find_word)) {
        console.log(frases)
        frases.push(false)
    }
    return
};


function showInput1() {
    if (busqueda_2.value != '') {
        return busqueda_2.value
    } else {
        return '2'
    }

}

function showInput2() {
    if (busqueda_1.value != '') {
        return busqueda_1.value
    } else {
        return '1'
    }

}

function mostrarDatos(sect, frase, error) {

    let section = sect

    for (const [index, err] of error.entries()) {
        console.log(err)
        if (err != false) {
            console.log(index)
            document.getElementById(`datos_${index + 1}`).innerHTML = err
            document.getElementById(`title_${index + 1}`).innerHTML = section[index] != undefined ? section[index] : ''
            document.getElementById(`boton_${index + 1}`).style.display = 'block'
            document.getElementById(`boton_${index + 1}`).href = url_link + id[index]
        }
    }

    frase.forEach((phrase, index) => {
        if (phrase != false) {
            console.log(index)
            document.getElementById(`datos_${index + 1}`).innerHTML = phrase
            document.getElementById(`title_${index + 1}`).innerHTML = section[index]
            document.getElementById(`boton_${index + 1}`).style.display = 'block'
            document.getElementById(`boton_${index + 1}`).href = url_link + id[index]


        }
    })
    progressBar.style.width = '100%'
}


function tomarDatos() {

    let busqueda_1 = document.getElementById('busqueda_1').value.toLowerCase()
    let busqueda_2 = document.getElementById('busqueda_2').value.toLowerCase()

    if (busqueda_1 == '' || busqueda_2 == '') {
        let frase_error = 'Ingrese ambos articulos.'
        let err_vacio = boots_err + `${frase_error}</div>`
        document.getElementById('datos_err').innerHTML = err_vacio
        progressBar.style.width = '0%'
    }
    else if (busqueda_1 == busqueda_2) {
        let frase_error = 'Ingrese articulos diferentes.'
        let err_vacio = boots_err + `${frase_error}</div>`
        document.getElementById('datos_err').innerHTML = err_vacio
        progressBar.style.width = '0%'
    }

    else {

        url_wiki_1 = url_base + busqueda_1 + '&&redirects=yes'
        url_wiki_2 = url_base + busqueda_2 + '&&redirects=yes'

        return true
    }


}

let getJSONWiki = function (request) {

    let result = {}
    return fetch(request)
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Something went wrong on API server!');
            }
        })
        .then((response) => {
            result.status = 200;
            result.data = response
            console.log(result.data)
            return result


        }).catch((error) => {
            console.error(error);
        })
}

let allinonce = () => Promise.all([getJSONWiki(url_wiki_1), getJSONWiki(url_wiki_2)]).then((resultObj) => {
    console.log(resultObj)
    if (resultObj[0].status === 200 && resultObj[1].status === 200) {
        infoWiki_1 = resultObj[0].data.query.pages
        infoWiki_2 = resultObj[1].data.query.pages
    }
})


