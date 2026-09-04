import { expect, test } from '@playwright/test'

test('mantiene supply positivo y lo elimina al reducirlo a cero', async ({ page }) => {
  await page.goto('/')

  const targetItem = page.getByRole('combobox', { name: 'Select an item' })
  await targetItem.fill('Accumulator')
  await page.getByRole('option', { name: /Accumulator/ }).click()

  const plannerSettings = page.getByRole('tablist', { name: 'Planner settings' })
  await plannerSettings.getByRole('tab', { name: 'Supply' }).click()
  await page.getByRole('button', { name: 'Add an item' }).click()

  const dialog = page.getByRole('dialog')
  await dialog.getByRole('searchbox').fill('Accumulator')
  await dialog.getByText('Accumulator', { exact: true }).click()
  await expect(dialog).toBeHidden()

  const supplyPanel = page.getByRole('tabpanel', { name: 'Supply' })
  const supplyInput = supplyPanel.getByRole('textbox', { name: 'accumulator supply per minute' })
  await expect(supplyInput).toHaveValue('1')

  await supplyInput.fill('1')
  await supplyPanel.getByRole('button', { name: 'Decrease accumulator supply by 1', exact: true }).click()

  await expect(supplyInput).toBeHidden()
})
