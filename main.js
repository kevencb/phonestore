const API_URL = "https://my-json-server.typicode.com/fedegaray/telefonos/db/"
const containerPhoneInfo = document.getElementById('container-phone-info')
const phoneInfo = document.getElementById('phone-info')

// Cargar documentos
async function getData() {
    try {
        const response = await fetch(API_URL,
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
        const response = await fetch(`https://my-json-server.typicode.com/fedegaray/telefonos/dispositivos/${id}`)
        // console.log(response)

        if (!response.ok) {
            throw new Error(`Problemas al cargar la información ${response.statusText}`)
        }

        const infoId = await response.json()
        console.table(infoId)
        return infoId;

    } catch (error) {
        console.log("El ID ingresado no esta registrado: ", error)
    }
}
searchID(1)

document.addEventListener('DOMContentLoaded', getData)