const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templatereservaciones = document.getElementById('template-reservaciones').content
const fragment = document.createDocumentFragment()

let reservaciones = {}
document.addEventListener('DOMContentLoaded', () =>{
    fetchData()
    if (localStorage.getItem('reservaciones')){
        reservaciones = JSON.parse(localStorage.getItem('reservaciones'))
        actualizar()


    }

})

cards.addEventListener('click', e =>{
    addreservaciones(e)
})

items.addEventListener('click', e => {
    btnAccion(e)
})

const fetchData = async() => {
try {
    const res = await fetch('api.json')
    const data = await res.json()
   // console.log(data)
    pintarCards(data)
} catch(error) {
    console.log(error)
}
}

const pintarCards = data =>{
    
    data.forEach(servicios => {
        templateCard.querySelector('h5').textContent = servicios.title
        templateCard.querySelector('p').textContent = servicios.precio
        templateCard.querySelector('img').setAttribute("src",servicios.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = servicios.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
        
    })
    cards.appendChild(fragment)
}

const addreservaciones = e => {
    
    if (e.target.classList.contains('btn-dark')){
        setreservaciones(e.target.parentElement)
    }
    e.stopPropagation()
}

const setreservaciones = objeto =>{

 const servicios={
    id: objeto.querySelector('.btn-dark').dataset.id,
    title: objeto.querySelector('h5').textContent,
    precio: objeto.querySelector('p').textContent,
    cantidad: 1
 }
  //para Aumentar cantidad
  if(reservaciones.hasOwnProperty(servicios.id)){
    servicios.cantidad = reservaciones[servicios.id].cantidad + 1
  }
 //copia del servicio
  reservaciones[servicios.id] = {...servicios}
  actualizar()
}

const actualizar = () =>
{
   // console.log(reservaciones)
    items.innerHTML ='0'
    Object.values(reservaciones).forEach(servicios =>{
        templatereservaciones.querySelector('th').textContent = servicios.id
        templatereservaciones.querySelectorAll('td')[0].textContent = servicios.title
        templatereservaciones.querySelectorAll('td')[1].textContent = servicios.cantidad
        templatereservaciones.querySelector('.btn-info').dataset.id = servicios.id
        templatereservaciones.querySelector('.btn-danger').dataset.id = servicios.id
        templatereservaciones.querySelector('span').textContent = servicios.cantidad * servicios.precio
        const clone = templatereservaciones.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    pintarFooter()

    localStorage.setItem('reservaciones', JSON.stringify(reservaciones))
}


const pintarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(reservaciones).length == 0){
        footer.innerHTML = `
        <th scope="row" colspan="5">Seleccione su Servicios a su Gusto</th>
        `
        return
    }

    const nCantidad = Object.values(reservaciones).reduce((acc, {cantidad }) => acc + cantidad,0)
    const nPrecio = Object.values(reservaciones).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0)
    
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-reservaciones')
    btnVaciar.addEventListener('click', () =>{
        reservaciones = {} 
        actualizar()
    })
 
}

const btnAccion  = e => {
    //boton aumentar
    if(e.target.classList.contains('btn-info')) {
        
        const servicios = reservaciones[e.target.dataset.id]
        servicios.cantidad++
        reservaciones[e.target.dataset.id] = { ...servicios}
        actualizar()
    }
    //boton disminuir

    if(e.target.classList.contains('btn-danger')){
        const servicios = reservaciones[e.target.dataset.id]
        servicios.cantidad--
        if (servicios.cantidad == 0){
            delete reservaciones[e.target.dataset.id]
        }
        actualizar()
    }
    e.stopPropagation()

    
}