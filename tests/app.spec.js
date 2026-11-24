import { test as base, expect } from '@playwright/test'

// Fixture automática: cualquier error de consola o excepción hace fallar la
// prueba. Así detectamos problemas específicos de cada navegador.
const test = base.extend({
  page: async ({ page }, use) => {
    const errores = []
    // Las fuentes de Google no son parte de la app: si no hay internet no deben romper la prueba.
    await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }))
    page.on('pageerror', (e) => errores.push(e.message))
    page.on('console', (m) => {
      // El 404 de /api/destinos/:id inexistente es intencional (se prueba abajo).
      if (m.type() === 'error' && !/status of 404/.test(m.text())) errores.push(m.text())
    })
    await use(page)
    expect(errores, 'errores de consola').toEqual([])
  },
})

const abrirMenuSiEsMovil = async (page) => {
  await page.getByRole('link', { name: /Mi viaje/ }).waitFor()
  const boton = page.getByRole('button', { name: 'Abrir menú' })
  if (await boton.isVisible()) await boton.click()
}

test('REST: el inicio lista destinos destacados', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('TERRASEN')
  await expect(page.getByTestId('lista-destinos').locator('article')).toHaveCount(6)
})

test('REST: buscar y filtrar destinos por continente', async ({ page }) => {
  await page.goto('./#/destinos')
  await expect(page.getByTestId('lista-destinos').locator('article')).toHaveCount(10)

  await page.getByRole('button', { name: 'Europa' }).click()
  await expect(page.getByTestId('lista-destinos').locator('article')).toHaveCount(2)
  await expect(page).toHaveURL(/continente=Europa/)

  await page.getByRole('button', { name: 'Todos' }).click()
  await page.getByRole('searchbox', { name: 'Buscar destino' }).fill('cenotes')
  await expect(page.getByTestId('lista-destinos').locator('article')).toHaveCount(1)
  await expect(page.getByRole('heading', { name: 'Cancún' })).toBeVisible()

  await page.getByRole('searchbox', { name: 'Buscar destino' }).fill('zzzz')
  await expect(page.getByText('No encontramos destinos')).toBeVisible()
})

test('GraphQL: ver vuelos y hoteles de un destino y filtrarlos', async ({ page }) => {
  await page.goto('./#/destinos')
  await page.getByRole('link', { name: 'Cusco' }).click()
  await expect(page).toHaveURL(/#\/destinos\/cusco$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Cusco' })).toBeVisible()
  await expect(page.getByText('Machu Picchu').first()).toBeVisible()

  await expect(page.getByTestId('vuelo')).toHaveCount(6)
  await page.getByLabel('Solo con disponibilidad').check()
  await expect(page.getByTestId('vuelo')).toHaveCount(5)

  await page.getByRole('tab', { name: /Hoteles/ }).click()
  await expect(page.getByTestId('hotel')).toHaveCount(4)
  await page.getByRole('combobox', { name: 'Estrellas' }).selectOption('3')
  await expect(page.getByTestId('hotel')).not.toHaveCount(4)
  const estrellas = page.getByTestId('hotel').getByRole('img', { name: /de 5 estrellas/ })
  for (const e of await estrellas.all()) await expect(e).toHaveAttribute('aria-label', /^[345] de 5/)
})

test('Planificación: elegir vuelo + hotel y ver el total en Mi viaje', async ({ page }) => {
  await page.goto('./#/destinos/madrid')
  await page.getByLabel('Solo con disponibilidad').check()
  await page.getByRole('button', { name: 'Elegir vuelo' }).first().click()
  await page.getByRole('tab', { name: /Hoteles/ }).click()
  await page.getByRole('button', { name: 'Elegir hotel' }).first().click()
  await expect(page.getByTestId('contador-viaje')).toHaveText('2')

  await page.getByRole('link', { name: 'Ver mi plan de viaje' }).click()
  await expect(page).toHaveURL(/#\/mi-viaje$/)
  const total1 = await page.getByTestId('total-viaje').textContent()
  await page.getByRole('button', { name: 'Agregar pasajero' }).click()
  await expect(page.getByTestId('pasajeros')).toHaveText('2')
  await expect(page.getByTestId('total-viaje')).not.toHaveText(total1)

  // El plan persiste al recargar (useEffect + localStorage)
  await page.reload()
  await expect(page.getByTestId('pasajeros')).toHaveText('2')

  await page.getByRole('button', { name: 'Solicitar cotización' }).click()
  await expect(page.getByRole('heading', { name: '¡Cotización generada!' })).toBeVisible()
})

test('Router: navegación por el menú, deep link y 404', async ({ page }) => {
  await page.goto('./')
  await abrirMenuSiEsMovil(page)
  await page.getByRole('link', { name: 'Acerca', exact: true }).filter({ visible: true }).first().click()
  await expect(page.getByRole('heading', { name: 'Cómo funciona' })).toBeVisible()

  await page.getByRole('button', { name: 'Ejecutar GraphQL' }).click()
  await expect(page.getByTestId('respuesta-api')).toContainText('"vuelos"')

  await page.goBack()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('TERRASEN')

  await page.goto('./#/destinos/tokio')
  await expect(page.getByRole('heading', { level: 1, name: 'Tokio' })).toBeVisible()

  await page.goto('./#/no-existe')
  await expect(page.getByText('Te saliste del mapa')).toBeVisible()

  await page.goto('./#/destinos/atlantida')
  await expect(page.getByText('No encontramos el destino "atlantida".')).toBeVisible()
})

test('Compatibilidad: funciona aunque el navegador bloquee Service Workers', async ({ browser }) => {
  const ctx = await browser.newContext({ serviceWorkers: 'block' })
  const page = await ctx.newPage()
  await page.goto('./#/destinos/roma')
  await expect(page.getByTestId('vuelo').first()).toBeVisible()
  await ctx.close()
})

test('Responsive: sin scroll horizontal', async ({ page }) => {
  for (const ruta of ['./', './#/destinos', './#/destinos/cancun', './#/acerca']) {
    await page.goto(ruta)
    await page.waitForLoadState('networkidle')
    const desborde = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(desborde, `scroll horizontal en ${ruta}`).toBeLessThanOrEqual(0)
  }
})
