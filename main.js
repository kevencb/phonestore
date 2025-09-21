const API_URL = "https://my-json-server.typicode.com/fedegaray/telefonos"

let originalData = null;

const containerPhoneInfo = document.getElementById('container-phone-info')
const phoneInfo = document.getElementById('phone-info')


const inputSearchId = document.getElementById('input-search-id');
const buttonSearchId = document.getElementById('button-search-id')
const buttonUpdate = document.getElementById('button-update')
const buttonDelete = document.getElementById('button-delete')
const buttonAdd = document.getElementById('button-add')

// FORM SEARCH
const formSearch = document.querySelector('.search-form')
const inputMarcaSearch = document.getElementById('input-marca-search')
const inputModeloSearch = document.getElementById('input-search-modelo')
const inputColorSearch = document.getElementById('input-search-color')
const inputAlmacenamientoSearch = document.getElementById('input-search-almacenamiento')
const inputProcesadorSearch = document.getElementById('input-search-procesador')

// FORM ADD ITEM
const formAddItem = document.querySelector('.add-article-form')
const inputAddMarca = document.getElementById('input-add-marca')
const inputAddModelo = document.getElementById('input-add-modelo')
const inputAddColor = document.getElementById('input-add-color')
const inputAddAlmacenamiento = document.getElementById('input-add-almacenamiento')
const inputAddProcesador = document.getElementById('input-add-procesador')


// Cargar documentos
async function getData() {
    try {
        const response = await fetch(`${API_URL}/db/`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

        if (!response.ok) {
            throw new Error(`Problemas al cargar la información ${response.statusText}`)
        }

        const data = await response.json()

        containerPhoneInfo.innerHTML = ""

        for (const element of data.dispositivos) {

            const clone = phoneInfo.content.cloneNode(true)

            clone.querySelector(".id").textContent = element.id
            clone.querySelector(".marca").textContent = element.marca
            clone.querySelector(".modelo").textContent = element.modelo
            clone.querySelector(".color").textContent = element.color
            clone.querySelector(".almacenamiento").textContent = element.almacenamiento
            clone.querySelector(".procesador").textContent = element.procesador

            containerPhoneInfo.appendChild(clone)
        }

    } catch (error) {
        console.error("Problemas al cargar la información", error)
    }
}

// Leer documento por ID
async function searchID(id) {
    try {
        const response = await fetch(`${API_URL}/dispositivos/${id}`)

        if (!response.ok) {
            throw new Error(`Problemas al cargar la información ${response.statusText}`)
        }

        const infoId = await response.json()

        inputMarcaSearch.value = infoId.marca
        inputModeloSearch.value = infoId.modelo
        inputColorSearch.value = infoId.color
        inputAlmacenamientoSearch.value = infoId.almacenamiento
        inputProcesadorSearch.value = infoId.procesador

        originalData = { ...infoId }
        return infoId;

    } catch (error) {
        alert("El ID ingresado no esta registrado.")
    }
}

// Actualizar documento
async function updateItem(id) {
    try {
        let valueMarca = inputMarcaSearch.value
        let valueModelo = inputModeloSearch.value
        let valueColor = inputColorSearch.value
        let valueAlmacenamiento = inputAlmacenamientoSearch.value
        let valueProcesador = inputProcesadorSearch.value

        if (!originalData) {
            alert("Debes buscar un ID antes de modificar")
            return
        }

        let changes = {}
        if (valueMarca !== originalData.marca) changes['Marca'] = valueMarca;
        if (valueModelo !== originalData.modelo) changes['Modelo'] = valueModelo;
        if (valueColor !== originalData.color) changes['Color'] = valueColor;
        if (valueAlmacenamiento !== originalData.almacenamiento) changes['Almacenamiento'] = valueAlmacenamiento;
        if (valueProcesador !== originalData.procesador) changes['Procesador'] = valueProcesador;

        if (Object.keys(changes).length === 0) {
            alert("No se modificó ningún dato.")
            return
        }

        const response = await fetch(`${API_URL}/dispositivos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                marca: valueMarca,
                modelo: valueModelo,
                color: valueColor,
                almacenamiento: valueAlmacenamiento,
                procesador: valueProcesador
            })
        })
        if (!response.ok) {
            throw new Error(`Error al intentar obtener la información ${response.statusText}`)
        }
        inputSearchId.value = ""
        formSearch.reset()
        alert(`Campos modificados: ${Object.keys(changes).join(", ")}`);
        getData()
    } catch (error) {
        console.error("Error al intentar obtener la información: ", error)
    }
}

// Agregar nuevo documento
async function addNewArticle() {
    const newMarca = inputAddMarca.value.trim()
    const newModelo = inputAddModelo.value.trim()
    const newColor = inputAddColor.value.trim()
    const newAlmacenamiento = inputAddAlmacenamiento.value.trim()
    const newProcesador = inputAddProcesador.value.trim()

    if (!newMarca || !newModelo || !newColor || !newAlmacenamiento || !newProcesador) {
        alert("Verifica que todos los campos esten diligenciados.")
        return
    }

    try {
        const newId = Date.now();
        const response = await fetch(`${API_URL}/dispositivos/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: newId,
                marca: newMarca,
                modelo: newModelo,
                color: newColor,
                almacenamiento: newAlmacenamiento,
                procesador: newProcesador
            })
        })


        if (!response.ok) {
            throw new Error(`Error desde agregar nuevo documento ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        getData()
        formAddItem.reset()
        alert("Artículo agregado exitosamente.")
    } catch (error) {
        console.error("Error al crear el nuevo documento ", error)
    }
}

// Eliminar documento
async function deleteItem(id) {
    try {
        const response = await fetch(`${API_URL}/dispositivos/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        })

        if (response.status === 200 || response.status === 204) {
            alert(`Item eliminado exitosamente: ${response.status} ${response.statusText}`)
            inputSearchId.value = ""
            getData()
            formSearch.reset()
        } else {
            throw new Error(`Error al eliminar el documento ${response.status} ${response.statusText}`)
        }

    } catch (error) {
        console.error("Error al eliminar item ", error)
    }
}

// Enviar ID 
function valueID() {
    const valueSearchId = inputSearchId.value.trim();
    if (!valueSearchId) {
        alert("Debes ingresar un ID.")
        return
    }
    if (isNaN(valueSearchId)) {
        alert("El ID debe ser un número.")
        return
    }
    return valueSearchId
}

buttonAdd.addEventListener('click', (e) => {
    e.preventDefault()
    addNewArticle()
})

buttonSearchId.addEventListener('click', () => {
    searchID(valueID())
})

buttonUpdate.addEventListener('click', (e) => {
    e.preventDefault()
    updateItem(valueID())
})

buttonDelete.addEventListener('click', (e) => {
    e.preventDefault()
    deleteItem(valueID())
})

document.addEventListener('DOMContentLoaded', getData)