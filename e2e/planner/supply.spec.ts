import { expect, test } from '@playwright/test'

test('mantiene supply positivo y lo elimina al reducirlo a cero', async ({ page }) => {
  await page.goto('/')

  const targetItem = page.getByRole('combobox', { name: 'Select production target' })
  await targetItem.fill('Accumulator')
  await page.getByRole('option', { name: /Accumulator/ }).click()

  const targetRate = page.getByRole('textbox', { name: 'Target production per minute' })
  await targetRate.fill('60')
  await expect(targetRate).toHaveValue('60')

  const plannerSettings = page.getByRole('tablist', { name: 'Planner settings' })
  await plannerSettings.getByRole('tab', { name: 'Supply' }).click()

  const addSupplyButton = page.getByRole('button', { name: 'Add supply item' })
  await addSupplyButton.click()

  const dialog = page.getByRole('dialog')
  const searchSupply = dialog.getByRole('searchbox', { name: 'Search supply items' })
  await searchSupply.fill('Accumulator')

  const accumulatorOption = dialog.getByRole('button', { name: 'Add Accumulator as supply' })
  await accumulatorOption.focus()
  await accumulatorOption.press('Enter')
  await expect(dialog).toBeHidden()
  await expect(addSupplyButton).toBeFocused()

  const supplyPanel = page.getByRole('tabpanel', { name: 'Supply' })
  const supplyInput = supplyPanel.getByRole('textbox', { name: 'Accumulator supply per minute' })
  await expect(supplyInput).toHaveValue('1')

  await page.reload()

  await expect(targetItem).toHaveValue('Accumulator')
  await expect(targetRate).toHaveValue('60')
  await plannerSettings.getByRole('tab', { name: 'Supply' }).click()
  await expect(supplyInput).toHaveValue('1')

  const decreaseSupply = supplyPanel.getByRole('button', { name: 'Decrease Accumulator supply by 1', exact: true })
  await decreaseSupply.focus()
  await decreaseSupply.press('Enter')

  await expect(supplyInput).toBeHidden()
})

test('restablece la búsqueda al volver a abrir el selector de supply', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('combobox', { name: 'Select production target' }).fill('Accumulator')
  await page.getByRole('option', { name: /Accumulator/ }).click()
  await page.getByRole('tablist', { name: 'Planner settings' }).getByRole('tab', { name: 'Supply' }).click()

  const addSupplyButton = page.getByRole('button', { name: 'Add supply item' })
  await addSupplyButton.click()

  const dialog = page.getByRole('dialog')
  const searchSupply = dialog.getByRole('searchbox', { name: 'Search supply items' })
  await searchSupply.fill('__missing__')
  await expect(dialog.getByText('No supply items found')).toBeVisible()

  await dialog.getByRole('button', { name: 'Clear search' }).click()
  await expect(searchSupply).toHaveValue('')
  await expect(dialog.getByRole('button', { name: 'Add Accumulator as supply' })).toBeVisible()
  await searchSupply.fill('__missing__')

  await searchSupply.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(addSupplyButton).toBeFocused()

  await addSupplyButton.click()
  await expect(searchSupply).toHaveValue('')
  await expect(dialog.getByRole('button', { name: 'Add Accumulator as supply' })).toBeVisible()
})
