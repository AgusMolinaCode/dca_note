# 🧮 DCA-Note 📊

![Captura de pantalla 2024-09-14 173516](https://github.com/user-attachments/assets/91f9afa9-9f78-42f6-ad06-06f51a0b8c8b)


*Una plataforma interactiva para realizar seguimiento de inversiones en criptomonedas con estrategia DCA (Dollar-Cost Averaging).*

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: [Next.js](https://nextjs.org) para una aplicación rápida y escalable.
- **Estilos**: [Tailwind CSS](https://tailwindcss.com) para un diseño moderno y responsive.
- **Backend y Base de Datos**: [PostgreSQL](https://www.postgresql.org) como base de datos para almacenar la información de los activos y usuarios.
- **Despliegue**: [Railway](https://railway.app) para facilitar el despliegue en la nube y manejo de infraestructura.

---

## 📋 Funcionalidades Principales

- **Seguimiento de Criptomonedas**: Visualiza el rendimiento de tus criptomonedas a través de gráficos actualizados en tiempo real.
- **Historial de Inversión**: Agrega y monitorea tus compras de criptos, con cálculo de precios promedios de compra y ganancias/pérdidas realizadas o no realizadas.
- **Soporte para Múltiples Activos**: Añade diversas criptos como ETH, SOL, BCH y más, con un balance general que muestra la rentabilidad total de tu portafolio.
- **Gráficos Interactivos**: Análisis visual de los precios del mercado con la API de [TradingView](https://www.tradingview.com/).

---

## 🚀 Instalación y Uso

1. Clona el repositorio:
    ```bash
    git clone https://github.com/tu-usuario/dca-note.git
    ```
2. Instala las dependencias:
    ```bash
    cd dca-note
    npm install
    ```
3. Configura la base de datos:
    - Crea una base de datos PostgreSQL y añade los detalles de conexión en el archivo `.env`.
    ```bash
    DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/tu_base_de_datos
    ```

4. Inicia el proyecto en modo desarrollo:
    ```bash
    npm run dev
    ```

5. Despliega en Railway (opcional):
    - Sube tu proyecto a Railway conectando tu repositorio y configurando las variables de entorno necesarias.

---

## 🖼️ Vista Previa

![DCA-Note](./path_to_your_image.png)

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si encuentras algún bug o tienes sugerencias para mejorar, no dudes en abrir un *issue* o un *pull request*.

---

## 🔗 Links Importantes

- [Demo](https://dca-note-demo.railway.app)
- [Documentación API](./API_DOCS.md)
- [TradingView API](https://www.tradingview.com/rest-api-spec)
