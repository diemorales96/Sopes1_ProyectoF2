# Manual Técnico
---
## Arquitectura Implementada
---
<p align="center"> 
  <img align="center" width="700px" src="imgs/arq.png" />
</p>

---

## Bases de datos
---
>> tidb: <p align="center"> 
  <img align="center" width="200px" height = "200px" src="imgs/LOG.png" />
</p>

>>Mongodb:<p align="center"> 
  <img align="center" width="200px" height = "200px"  src="imgs/Resultado.png" />
</p>

---

## Preguntas de Reflexión:
>>¿Qué sistema de mensajería es más rápido?: 

Tras extensas pruebas de envio de datos masivos mediante locust, se llego a la conclusión que kafka es el mas eficiente enviando datos, pues permite procesar un mayor volumen de mensajes consumiendo menos recursos.

>>¿Cuáles son las ventajas y desventajas de cada sistema?: 
- Ventajas de kafka:
    - Tiene una buena escalabilidad
    - Tolerancia a los fallos
    - Capacidad para procesar en tiempo real
    - Enfocado a proyectos de Big Data

- Desventajas de kafka:
    - Dependencia con apache zookeeper
    - Enrrutamiento de mensajes
    - Carece de componentes de monitorizacion

- Ventajas de RabbitMQ:
    - Adecuado para muchos protocolos de mensajería
    - Interfaz moderna e intuitiva
    - Flexibilidad y plugins disponibles
    - Herramientas de desarrollo

- Desventajas de RabbitMQ:
    - No es transaccional por defecto

>>¿Cuál es el mejor sistema?:

Depende de los recursos del equipo a utiliza y de la necesidad del usuario, ya que si se mandan datos por millones es mas eficiente kafka aunque no tiene un sistema de monitoreo.

>>¿Cuál de las dos bases de datos (Redis y TIDB) se
desempeña mejor y por qué?:

tidb se desempeña mejor ya que es sencillo de implementar y utilizar ya que tiene sintaxis SQL.

## Descripcion de Herramientas:

