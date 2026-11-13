# PetCare - API Clínica Veterinaria

Spring Boot 4.1.2 · Java 21 · H2 · Arquitectura **Entity → Repository → Service → Controller**

## Ejecutar
1. En IntelliJ: abrir el `pom.xml` con **Open as Project**.
2. Correr `PetcareApplication.java` (botón verde). La API queda en `http://localhost:8080`.
3. Consola de la base de datos (opcional): `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:file:./data/petcare` · Usuario: `sa` · Contraseña: vacía

**Persistencia:** los datos se guardan en la carpeta `data/` (H2 en archivo), por lo que **no se pierden al detener la API**.
Para borrar todo, detener la API y eliminar la carpeta `data/`.

## Estructura (`src/main/java/com/duoc/petcare`)
| Carpeta | Contenido |
|---|---|
| `entity/` | Campos, validaciones y relaciones (`Dueno`, `Mascota`, `Cita`) |
| `repository/` | Acceso a la base de datos (`JpaRepository`) |
| `service/` | Reglas de negocio y validaciones |
| `controller/` | Direcciones (URLs) REST |
| `exception/` | Formato de los mensajes de error |
| `config/` | CORS para el front en React (`localhost:5173`) |

## Endpoints
| Recurso | Endpoints |
|---|---|
| Dueños | `GET/POST /api/duenos` · `GET/PUT/DELETE /api/duenos/{id}` · `GET /api/duenos/{id}/mascotas` |
| Mascotas | `GET/POST /api/mascotas` · `GET/PUT/DELETE /api/mascotas/{id}` · `GET /api/mascotas/{id}/citas` |
| Citas | `GET/POST /api/citas` · `GET/PUT/DELETE /api/citas/{id}` |

## Pruebas en Postman
Opción rápida: importar `PetCare.postman_collection.json` (Import → seleccionar el archivo) y ejecutar las peticiones en orden.
En POST y PUT manuales: **Body → raw → JSON**.

1. `POST /api/duenos`
```json
{ "rut": "12.345.678-5", "nombre": "Ana Pérez", "telefono": "+56912345678", "email": "ana@correo.cl" }
```
2. `POST /api/mascotas` (usa el id del dueño)
```json
{ "nombre": "Firulais", "especie": "Perro", "raza": "Labrador", "fechaNacimiento": "2020-05-10", "dueno": { "id": 1 } }
```
3. `POST /api/citas` (usa el id de la mascota; la fecha lleva hora)
```json
{ "fecha": "2026-11-20T10:30:00", "motivo": "Vacuna anual", "diagnostico": "Sin observaciones", "costo": 25000, "mascota": { "id": 1 } }
```
4. `GET /api/duenos/1/mascotas` y `GET /api/mascotas/1/citas`
5. `PUT` y `DELETE` de cada recurso.

### Casos de error (para las capturas de validación)
| Prueba | Resultado |
|---|---|
| `POST /api/citas` con `"mascota": { "id": 999 }` | 404 mascota inexistente |
| `POST /api/citas` sin `mascota` | 400 |
| `POST /api/duenos` con rut repetido | 409 |
| `POST /api/duenos` con email inválido o nombre vacío | 400 con detalle por campo |
| `POST /api/citas` con costo negativo | 400 |
| `DELETE /api/duenos/1` teniendo mascotas | 409 |
| `DELETE /api/mascotas/1` teniendo citas | 409 |
| `GET /api/duenos/999` | 404 |

Para eliminar en orden: primero las citas, luego las mascotas y por último el dueño.

## Logrado y pendiente
- Logrado: backend completo en capas, relaciones, validaciones, CRUD y endpoints de relación, base H2 persistente.
- Pendiente: frontend React (opcional).
