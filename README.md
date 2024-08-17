[![🧪Pipeline Regression in QA](https://github.com/upex-galaxy/upex-cypress-demo/actions/workflows/regression.yml/badge.svg)](https://github.com/upex-galaxy/upex-cypress-demo/actions/workflows/regression.yml)

[![vscode-logo]][vscode-site] [![wdio-logo]][wdio-site] [![typescript-logo]][typescript-site]

# 🧪 Testing Automation - WebdriverIO 👨🏻‍🚀 CI/CD

### 🤖 Framework de WebdriverIO con TypeScript

#### ✅ Integrado con Allure Report, Grabación de Video y JUnit (Importar a Jira XRay)

#### ✅ Pruebas en CI utilizando: Smoke, Sanity y Regression

#### ✅ Reportes de Allure desplegados automáticamente en el GitHub Pages del repo

Este repositorio contiene un completo marco de automatización de WebdriverIO construido usando **TypeScript**. El marco está diseñado para simplificar las pruebas de extremo a extremo de aplicaciones web e incluye integración con GitHub Actions para pipelines de CI/CD sin problemas, así como reportes de prueba con Allure para una presentación clara y perspicaz de los resultados de las pruebas.

## Prerequisitos

Antes de comenzar, asegúrate de tener instaladas las siguientes dependencias:

-   **Node.js**: [Instalar Node.js v20 LTS](https://nodejs.org/)
-   **pnpm** (Gestor de paquetes): [Instalar pnpm](https://pnpm.io/installation)
    -   **Para Windows, usando npm**: `npm install -g pnpm`
    -   **Nota: Por qué usar pnpm**:
        -   Rápido: pnpm es hasta 2 veces más rápido que npm
        -   Eficiente: Los archivos dentro de node_modules se clonan o enlazan desde un único almacenamiento de contenido direccionable
        -   Soporta monorepos: pnpm tiene soporte incorporado para múltiples paquetes en un repositorio
        -   Estricto: pnpm crea un node_modules no plano de forma predeterminada, por lo que el código no tiene acceso a paquetes arbitrarios.
-   **WebdriverIO CLI**: Instala globalmente usando `npm install -g @wdio/cli`

## Getting Started

Sigue estos pasos para configurar y ejecutar las pruebas localmente:

1. Clona este repositorio:
    ```bash
    git clone {{REPO_URL}}
    ```
2. Navega hasta el directorio del proyecto:
    ```bash
    cd {{REPO_FOLDER}}
    ```
3. Instala las dependencias del proyecto con pnpm! [ver acerca de pnpm](https://pnpm.io/pnpm-cli):
    - `pnpm install`
4. Crea tu archivo `.env` en la directorio root del proyecto y configura las variables (revisa el `wdio.config.ts` para ver qué necesitas):

    ```powershell
    # Opciones de Ejecución de Pruebas:
    HEADLESS=false #? establece a true o false según lo desees. Esto siempre será true para CI/CD
    DEBUG=true #? establece a true solo para depurar con vscode. Esto siempre será false para CI/CD
    ```

5. Verifica todos los scripts en package.json para saber cómo ejecutar las pruebas:
    - Para ejecutar una prueba: `pnpm run spec {{nombre_archivo_prueba}}`
    - Para ejecutar una suite: `pnpm run suite {{carpeta_suite}}`
    - Para ejecutar una regresión: `pnpm run regression`
    - _Para más scripts, por favor revisa el archivo package.json._

# **📝 Resumen del Plan de Repositorio de QA Automation**

## 🧪 Estrategia para Continuous Integration (CI/CD): GitHub Actions

Este repositorio está configurado para ejecutar pruebas automatizadas mediante diferentes estrategias de ejecución de pruebas:

-   Ejecutar cualquier directorio de pruebas o una suite de pruebas específica con el pipeline `sanity.yml` (puedes importar los resultados de las pruebas a XRay con este).
-   Ejecutar las pruebas de `Smoke` y `Regression` con el pipeline `regression.yml`.

**> PIPELINES:**

-   **SanityTest** (Activación manual):

    -   Esta es una estrategia de ejecución de pruebas para verificar una suite de pruebas específica. Por ejemplo, si solo quieres validar que el conjunto de pruebas para un Módulo de la App funcione como se espera.
    -   **Ejecutar**: cualquier tipo de prueba o suite para verificar módulos específicos de la aplicación.
    -   **Cuándo**:
        -   Se puede activar manualmente desde la interfaz "Run Workflow" de GitHub Actions.

-   **SmokeTest** (Activación manual o verificación de Pull-Request):

    -   Esta es una estrategia de ejecución de pruebas para verificar los módulos principales de la aplicación. Por ejemplo, antes de ejecutar las pruebas de regresión, queremos asegurarnos de que los módulos principales funcionen como se espera (las principales características de la aplicación deberían funcionar).
    -   **Ejecutar**: Pruebas de API o pruebas E2E para verificar los módulos principales de la aplicación.
    -   **Cuándo**:
        -   Se puede activar manualmente desde la interfaz "Run Workflow" de GitHub Actions.
        -   Se puede configurar para que se active automáticamente cuando se abra un Pull-Request para verificar los nuevos cambios antes del merge.
        -   Se puede configurar para que se active automáticamente después de que se hiciera merge los nuevos cambios en la rama principal.

-   **RegressionTesting** (Activación manual o recomendado después de Smoke):

    -   Esta es una estrategia de ejecución de pruebas para verificar todos los módulos de la aplicación. Por ejemplo, después de ejecutar las pruebas de Smoke (los módulos principales funcionan), queremos validar que el resto de las módulos y funcionalidades funcionen como se espera (todos los componentes deberían funcionar).
    -   **Ejecutar**: Todas las pruebas candidatas para verificar la mayoría de las características de la aplicación.
    -   **Cuándo**:
        -   Se puede activar manualmente desde la interfaz "Run Workflow" de GitHub Actions.
        -   Se puede configurar para que se active automáticamente después de que se complete y tenga éxito la prueba de Smoke.
        -   Se puede configurar para que se ejecute programadamente todos los días a la medianoche.

**> Manual Trigger de los PIPELINES**:

-   Directamente en GitHub Actions, puedes activar manualmente el pipeline de Sanity especificando estos valores en la interfaz "Run Workflow":
-   **Run Workflow Config**:

          ```yml
          inputs:
              os:
                  description: 🚀Select the OS
                  required: true
                  default: 'ubuntu-latest'
                  type: choice
                  options:
                      - ubuntu-latest
                      - ubuntu-22.04
                      - macos-latest
                      - windows-latest
              environment:
                  description: 🚀Select the Test Environment
                  required: true
                  default: 'QA'
                  type: choice
                  options: #? Orden de Deployments...
                      - dev #? donde los developers work
                      - sandbox #? donde los QA realizan smoke y exploratory testing.
                      - QA #? donde los QA realizan smoke, sanity y regression testing.
                      - staging #? donde los QA realizan smoke, sanity o regression testing.
                      - uat #? donde los beta testers realizan acceptance testing.
                      - prod #? donde los usuarios finales usan la App.
              test_run:
                  description: 🚀Select the Test Suite to Run
                  required: true
                  default: 'test/specs/another.e2e.ts' #! Example.
                  type: string
              xray_tx:
                  description: 🚀Enter the Test Execution ID
                  required: true
                  default: 'GX3-1526' #! Example.
                  type: string
              xray_project:
                  description: 🚀Select the Project Key
                  required: true
                  default: 'GX3' #! Example.
                  type: choice
                  options:
                      - GX1
                      - GX2
                      - GX3
                      - GX4
          ```

    > **RECUERDA**: No necesitas cambiar el archivo yml en el repositorio, simplemente utiliza la interfaz "Run Workflow" de GitHub Actions para seleccionar la Suite de Pruebas y el ID de Ejecución de Pruebas de XRay para importarlo a Jira.

**> Acciones Extras de los PIPELINES:**

-   **Guardar capturas de pantalla** de las pruebas fallidas y subirlas como artefacto de CI
-   **Guardar cada archivo de log** en una carpeta y subirlo como artefacto de CI
-   **Importar automáticamente los resultados** de las pruebas a XRay con los argumentos dados.
-   **Desplegar el Report de Allure** en la rama de GitHubPages (para que puedas ver los resultados en vivo).
-   **Enviar una notificación de Slack** (de UPEX) para mostrar un resumen general en el canal de GitHub.

## 🧪 Estrategia para Test Reporting: "Allure History"

La generación de reportes de Allure está integrada en este marco para obtener reportes completos de pruebas. **Después de ejecutar tus pruebas localmente o como parte de un pipeline de CI/CD, generará y desplegará automáticamente el Reporte de Allure en el sitio web de GitHubPages del Repo para analizar los resultados de las pruebas directamente desde la web**.

#### > Dónde ver el Reporte de Allure en GitHub Pages:

-   **Para ver el Reporte de Regresión**: Debes ir a la URL de GitHub Pages, en la url principal, disponible cuando termine el Pipeline de RegressionTesting y se ejecute el Deploy.
-   **Para ver el Reporte de SanityTest de tu XRay Test Execution (TX)**: Debes ir al endpoint `sanity/{{xray_tx_id}}` de la URL de GitHub Pages, disponible cuando termine el Pipeline de SanityTest y se ejecute el Deploy.

#### > Cómo ver el Reporte de Allure localmente:

1. Asegúrate de tener instalada la CLI de Allure (se necesita JAVA_HOME): [Instalar CLI de Allure](https://docs.qameta.io/allure/#_installing_a_commandline)
2. Ejecuta las pruebas que prefieras
3. Genera y abre el informe de Allure simplemente ejecutando: `pnpm run allure:report`

## 🧪 Estrategia para Test Directory (Nomenclaturas)

-   **Nomenclatura: Page Object Model (Patrón de Diseño):**

    -   Carpeta: `test/pageobjects`
    -   Carpeta de Interfaces Typescript: `test/pageobjects/types`
    -   Nomenclatura: **PascalCase** con sufijo`.Page.ts` (ejemplo: `ShoppingCart.Page.ts`)

-   **Nomenclatura: API Modules (Patrón de Diseño):**

    -   Carpeta: `test/api`
    -   Carpeta de Interfaces Typescript: `test/api/types`
    -   Nomenclatura: **PascalCase** con sufijo `.Api.ts` (ejemplo: `Subscriptions.Api.ts`)

-   **Nomenclatura: E2E Testing y Integration Testing:**

    -   Path: `test/specs/<component-name>/*.ts` (ejemplo: `test/specs/account/login.test.ts`)
    -   Sufijos de Prueba:  - `.test.ts` para pruebas generales - `.e2e.test.ts` para pruebas de E2E - `.api.test.ts` para pruebas de Integration

-   **Nomenclatura: Archivos de Test Config (usados para Estrategias de Pruebas):**
    -   `test/TestBase.ts` _usado como contenedor de todos los PageObjects_
    -   `test/TestPlan.ts` _usado como organizador de cada Test Run Strategy por suites._
-   **Nomenclatura: Estructura del Test File (test.ts)**

    -   La nomenclatura del Suite de Prueba (describe) es igual a:
        -   `Jira Story ID` + `Story title`
    -   La nomenclatura del Caso de Prueba (it) es igual a:
        -   `Jira Story ID` + `TC#` + `TC Title`
    -   Estructura Matriz de Prueba Automatizada con el modelo (Arrange - Act - Assert):
        -   **Arrange**: Declaración de Datos y Variables
        -   **Act**: Acciones del Caso de Prueba
        -   **Assert**: Validaciones y Comprobaciones con los Expect
    -   ```typescript
        describe('GX3-123: {{Story_title}}', () => {
        	beforeEach(() => {
        		// acciones de precondición de prueba
        	});
        	it('GX3-123 TC1: {{TC_Title}}', () => {
        		// Arrange: Declaración de datos y variables
        		// Act: Acciones del caso de prueba
        		// Assert: Validaciones y comprobaciones con los expect
        	});
        });
        ```

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[vscode-logo]: https://img.shields.io/badge/vscode-black?logo=vscode&style=for-the-badge
[vscode-site]: https://code.visualstudio.com/
[wdio-logo]: https://img.shields.io/badge/webdriverio-black?logo=webdriverio&style=for-the-badge
[wdio-site]: https://webdriver.io/
[typescript-logo]: https://img.shields.io/badge/TypeScript-black?logo=typescript&style=for-the-badge
[typescript-site]: https://www.typescriptlang.org/
