# Proyecto 1 — Cliente
### Sistemas y Tecnologías Web
### José Manuel Sanchez Hernández

---
Frontend del Series Tracker. Consume la API REST del backend mediante fetch().

Repositorio del backend: https://github.com/josesan28/proyecto-1-backend-web

Aplicación en producción: https://josesan28.github.io/proyecto-1-cliente-web

---

## Tech Stack

- HTML5
- CSS3
- JavaScript vanilla
- Deploy: GitHub Pages

---

## Requisitos para correr localmente

- El backend corriendo en http://localhost:8080
- Un servidor HTTP local para servir los archivos. No funciona abriendo el HTML directamente con doble clic porque fetch() falla con el protocolo file://

---

## Instrucciones

**1. Clonar el repositorio**

```bash
git clone https://github.com/josesan28/proyecto-1-cliente-web
cd proyecto-1-cliente-web
```

**2. Levantar un servidor local**

Con Python:
```bash
python3 -m http.server 5500
```

Abrir http://localhost:5500

Con Node:
```bash
npx serve .
```

Abrir el localhost que indique la terminal.

O usando la extensión Live Server de VS Code. Se debería abrir automáticamente en el navegador.

En todos los casos asegurarse de que el backend este corriendo antes de abrir el cliente.

---

## CORS

CORS (Cross-Origin Resource Sharing) es una política de seguridad del navegador que bloquea peticiones HTTP entre orígenes distintos. Como el cliente y el servidor corren en orígenes diferentes, distintos puertos en local, distintos dominios en producción, el navegador rechaza las peticiones a menos que el servidor lo permita explícitamente. Se configuró el header Access-Control-Allow-Origin: * para permitir cualquier origen y evitar problemas con esto.

---

## Funcionalidades

- Listar series con imagen, año, episodios y géneros
- Buscar series por nombre
- Ordenar por título, año, episodios o fecha de creación
- Controlar cuantas series se muestran por página
- Paginación navegable con rango de páginas
- Crear, editar y eliminar series desde la interfaz
- Subir imagen de portada con preview antes de guardar
- Crear géneros nuevos desde el mismo formulario de serie
- Ver detalle completo de una serie
- Agregar, editar y eliminar ratings con review
- Exportar la lista de series a CSV

---

## Challenges implementados

- Calidad visual del cliente
- Calidad del historial de Git - commits descriptivos progresión lógica, no un solo commit con todo
- Organización del código en archivos con responsabilidades claras
- Códigos HTTP correctos consumidos y manejados desde el cliente
- Paginación con control de límite por página
- Búsqueda por nombre con ?q
- Ordenamiento con ?sort y ?order
- Exportar lista de series a CSV
- Sistema de ratings visible en el cliente con CRUD completo
- Subida de imágenes con preview

---

## Screenshot de la aplicación funcionando

![alt text](/images/image.png)

---

## Reflexión

Para el frontend usé HTML, CSS y JavaScript vanilla sin ningun framework. Lo que se me hizo más interesante fue el módulo de api.js, tener todas las llamadas fetch() en un solo lugar con una funcion request() que hace que el resto del código no sepa nada de HTTP. Si después cambia la URL del backend o la forma de autenticarse, solo hay que tocar un archivo.

Lo que más costaría repetir en un proyecto grande es el manejo de estado. Sin tener una tecnología que ofrezca reactividad, cada vez que cambia algo hay que acordarse de actualizar manualmente todos los elementos del DOM que dependen de ese dato, entonces tal vez no haría algo así otra vez. Para un proyecto de esta escala sentí que es manejable, pero en algo más grande se volvería difícil de mantener. En ese caso usaría un framework, pero para entender cómo funcionan por dentro, sentí que me sirvió bastante.