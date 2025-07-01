# Guía de Despliegue en Netlify - Refugio de Animales

## 🚀 Pasos para Desplegar en Netlify

### Opción 1: Despliegue desde GitHub (Recomendado)

#### 1. Preparar el Repositorio
```bash
# Asegúrate de que tu código esté en GitHub
git add .
git commit -m "Preparando para despliegue en Netlify"
git push origin main
```

#### 2. Conectar con Netlify
1. Ve a [netlify.com](https://netlify.com) y crea una cuenta
2. Haz clic en "New site from Git"
3. Selecciona tu proveedor de Git (GitHub)
4. Selecciona tu repositorio `refugio-frontend`
5. Configura las opciones de build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/refugio-frontend`
6. Haz clic en "Deploy site"

#### 3. Configurar Variables de Entorno
En el dashboard de Netlify:
1. Ve a **Site settings** > **Environment variables**
2. Agrega las siguientes variables:
   ```
   NODE_VERSION=18
   API_URL=https://tu-backend-url.com/api
   ```

### Opción 2: Despliegue Manual (Drag & Drop)

#### 1. Construir la Aplicación
```bash
# En tu terminal local
npm run build
```

#### 2. Subir a Netlify
1. Ve a [netlify.com](https://netlify.com)
2. Arrastra la carpeta `dist/refugio-frontend` al área de drop
3. Netlify subirá y desplegará automáticamente

### Opción 3: Usando Netlify CLI

#### 1. Instalar Netlify CLI
```bash
npm install -g netlify-cli
```

#### 2. Iniciar Sesión
```bash
netlify login
```

#### 3. Desplegar
```bash
# Construir la aplicación
npm run build

# Desplegar
netlify deploy --prod --dir=dist/refugio-frontend
```

## ⚙️ Configuración del Backend

### 1. Configurar CORS en el Backend
Asegúrate de que tu backend permita peticiones desde tu dominio de Netlify:

```java
// En tu WebConfig.java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("https://tu-app.netlify.app")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### 2. Actualizar Variables de Entorno
En `src/environment/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-backend-url.com/api', // URL de tu backend desplegado
};
```

## 🔧 Configuraciones Adicionales

### 1. Dominio Personalizado
1. En Netlify: **Site settings** > **Domain management**
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones de Netlify

### 2. HTTPS
- Netlify proporciona HTTPS automáticamente
- Para dominios personalizados, configura el certificado SSL

### 3. Redirecciones
El archivo `netlify.toml` ya incluye redirecciones para SPA:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 📊 Monitoreo y Analytics

### 1. Netlify Analytics
- Activa Netlify Analytics en **Site settings** > **Analytics**
- Monitorea el rendimiento y uso de tu aplicación

### 2. Logs de Build
- Revisa los logs de build en el dashboard de Netlify
- Configura notificaciones por email para fallos de build

## 🚨 Solución de Problemas Comunes

### Error: Build Failed
```bash
# Verifica que todas las dependencias estén en package.json
npm install
npm run build
```

### Error: API Not Found
- Verifica que la URL del backend esté correcta
- Asegúrate de que CORS esté configurado correctamente
- Revisa que el backend esté desplegado y funcionando

### Error: Routing Issues
- Verifica que el archivo `netlify.toml` tenga las redirecciones correctas
- Asegúrate de que Angular Router esté configurado correctamente

## 🔄 Despliegues Automáticos

### Configurar Auto-Deploy
1. En Netlify: **Site settings** > **Build & deploy**
2. Configura "Auto-publish" para que se despliegue automáticamente en cada push

### Branch Deploys
- Configura deploys para diferentes branches
- Usa branch deploys para testing antes de producción

## 📱 Optimización para Producción

### 1. Performance
- La aplicación ya está optimizada con lazy loading
- Los assets tienen cache configurado en `netlify.toml`

### 2. SEO
- Asegúrate de que los meta tags estén configurados en `index.html`
- Configura Open Graph tags para redes sociales

### 3. PWA (Progressive Web App)
- Considera agregar un service worker para funcionalidad offline
- Configura el manifest.json para instalación en dispositivos móviles

## 🎉 ¡Listo!

Una vez completados estos pasos, tu aplicación estará desplegada en Netlify y accesible desde internet. El dominio será algo como: `https://tu-app-name.netlify.app`

### URLs Útiles
- **Dashboard de Netlify**: https://app.netlify.com
- **Documentación**: https://docs.netlify.com
- **Soporte**: https://www.netlify.com/support/ 