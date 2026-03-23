# Herramientas de Análisis Estático de Código

Como parte de asegurar la integridad del código fuente, este documento expone las herramientas de análisis estático (Linters y Formateadores Automáticos) adoptadas por "La Lico" para vigilar de forma automatizada las bases de Frontend y Backend.

## 1. Backend (Python/Django): **Ruff**

El analizador escogido como bloque central es **[Ruff](https://docs.astral.sh/ruff/)**. 
* **Justificación de Elección:** Tradicionalmente se usaban suites compuestas (`pylint` + `flake8` + `black`). No obstante, Ruff (escrito en Rust) es la vanguardia de la industria, reemplazando a docenas de paquetes en uno solo mientras ejecuta evaluaciones de forma *ultra-rápida*.
* **Configuración de Dominio:** Modificada globalmente en `ruff.toml`.
  - Habilita las reglas de errores críticos (`E`).
  - Implementa el _Linter_ (`F`) nativo.
  - Implementa auto-ordenamiento de _Imports_ (`isort`).
  - Detecta malas prácticas en entornos web de Django (`DJ`).
* **Enforced Naming (PEP-8):** Activado bajo la regla (`N`), obliga la revisión automática de componentes para que mantengan su _CamelCase_ o _snake_case_ requerido.
* **Auto-corrección Automática:** Soporta plenamente la resolución automática de desajustes estéticos mediante el comando format. 
  * Comando: `python -m ruff format .` (Alinea comillas dobles, tabs y largos de línea a 100 caracteres).
  * Comando: `python -m ruff check --fix .` (Elimina variables no utilizadas y arregla imports).

---

## 2. Frontend (React/JS): **ESLint & Prettier**

Para la rama cliente, el eCommerce mantiene la combinación recomendada por excelencia comunitaria de **[ESLint](https://eslint.org/)** fusionado con **[Prettier](https://prettier.io/)**.
* **Justificación de Elección:** Es el ecosistema con mayor madurez y compatibilidad sobre archivos `.jsx` acoplado al inicializador de *Vite*.
* **Configuración de Dominio:** 
  - Reglas de Linter (ESLint): Se extienden desde `eslint:recommended` y se especializan para el marco React. Las variables, exportaciones y *Hooks* se resguardan de mal uso.
  - Reglas de Formateo (Prettier): Configuradas en `.prettierrc`. Obliga un límite de línea inteligente a 100, la eliminación de uso de Tabuladores (Prioridad TABS de 4 Espacios), el requisito de *Punto y Coma* al finalizar declaraciones y estandarización a Comillas Simples en objetos nativos Javascript para uniformidad.
* **Enforced Naming & Clean-up:** ESLint alerta y previene declaración de variables innecesarias rompiendo el _Build_ de pre-producción `rules: 'no-unused-vars'`.
* **Auto-corrección Automática:** Plenamente soportado.
  * *Comando Fixer:* `npx prettier --write .` (Aplica los estándares visuales de todo el árbol de archivos sin intervención humana).
  * *Comando Linter:* `npm run lint` (Arrojará análisis profundos de mal uso del ciclo de react-hooks).
