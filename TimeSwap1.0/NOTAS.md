# Notas de la Aplicación TimeSwap

## Estructura de Componentes

### 1. SwipeCard.tsx
Este componente es responsable de mostrar la tarjeta individual de cada usuario con su información. Incluye:
- Foto de perfil del usuario
- Nombre y edad
- Sistema de calificación (estrellas)
- Descripción personal
- Lista de habilidades con sus niveles
- Diseño visual de la tarjeta con estilos

Características principales:
- Usa ScrollView para manejar contenido extenso
- Limita el número de líneas en la descripción
- Muestra las habilidades en badges visuales
- Maneja imágenes de alta calidad
- Diseño responsive que se adapta a diferentes tamaños de pantalla

### 2. SwipeScreen.tsx
Este es el componente principal que maneja la funcionalidad tipo Tinder. Sus responsabilidades son:
- Gestionar el stack de tarjetas de usuarios
- Manejar la animación de deslizamiento (swipe)
- Controlar la lógica de match/no match
- Administrar la transición entre tarjetas

Funcionalidades principales:
- Sistema de gestos para deslizar tarjetas
- Animaciones suaves de rotación y movimiento
- Manejo del estado de las tarjetas
- Lógica para mostrar la siguiente tarjeta
- Sistema de placeholder para tarjetas en espera
- Mensaje cuando no hay más perfiles disponibles

### 3. UserProfile.tsx
Este componente maneja el perfil del usuario actual y permite su edición. Incluye:
- Visualización del perfil personal
- Funcionalidad de edición de datos
- Gestión de habilidades (agregar/eliminar)
- Sistema de calificación personal

Características principales:
- Modo de visualización y edición
- Gestión de foto de perfil
- Editor de información personal
- Sistema para agregar y eliminar habilidades
- Interfaz intuitiva para edición
- Validación de datos ingresados

## Flujo de Datos
1. `SwipeScreen` mantiene el estado principal de los perfiles disponibles
2. Pasa los datos de un perfil individual a `SwipeCard` para su visualización
3. `UserProfile` maneja su propio estado para la edición del perfil

## Interacción entre Componentes
- `SwipeScreen` → `SwipeCard`: Datos del perfil a mostrar
- `SwipeCard` → `SwipeScreen`: Eventos de interacción (swipe)
- `UserProfile`: Funciona de manera independiente para la gestión del perfil propio

## Mejoras Potenciales
1. Implementar sistema de persistencia de datos
2. Agregar animaciones más fluidas
3. Implementar sistema de match real
4. Agregar chat entre usuarios que hicieron match
5. Mejorar el sistema de calificaciones
6. Agregar filtros de búsqueda por habilidades

## Notas Técnicas
- Las imágenes se obtienen de RandomUser.me API
- Se usa React Navigation para la navegación entre pantallas
- Implementación de TypeScript para type safety
- Uso de componentes nativos de React Native
- Diseño modular para fácil mantenimiento
- Estilos consistentes en toda la aplicación 