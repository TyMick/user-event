import userEvent from '#src'
import {setup} from '#testHelpers/utils'

test('copy selected value', () => {
  const {element, getEvents} = setup<HTMLInputElement>(
    `<input value="foo bar baz"/>`,
  )
  element.focus()
  element.setSelectionRange(4, 7)

  const dt = userEvent.copy()

  expect(dt.getData('text')).toBe('bar')
  expect(getEvents('copy')).toHaveLength(1)
})

test('copy selected text outside of editable', () => {
  const {element, getEvents} = setup(`<div tabindex="-1">foo bar baz</div>`)
  element.focus()
  document
    .getSelection()
    ?.setBaseAndExtent(
      element.firstChild as Text,
      1,
      element.firstChild as Text,
      5,
    )

  const dt = userEvent.copy()

  expect(dt.getData('text')).toBe('oo b')
  expect(getEvents('copy')).toHaveLength(1)
})

test('copy selected text in contenteditable', () => {
  const {element, getEvents} = setup(`<div contenteditable>foo bar baz</div>`)
  element.focus()
  document
    .getSelection()
    ?.setBaseAndExtent(
      element.firstChild as Text,
      1,
      element.firstChild as Text,
      5,
    )

  const dt = userEvent.copy()

  expect(dt.getData('text')).toBe('oo b')
  expect(getEvents('copy')).toHaveLength(1)
})

describe('write to clipboard', () => {
  test('without Clipboard API', async () => {
    const {element} = setup<HTMLInputElement>(`<input value="foo bar baz"/>`)
    element.focus()
    element.setSelectionRange(4, 7)

    await expect(
      userEvent.copy({writeToClipboard: true}),
    ).rejects.toMatchInlineSnapshot(
      `[Error: The Clipboard API is unavailable.]`,
    )
  })

  test('copy selected value', async () => {
    const {element, getEvents} = setup<HTMLInputElement>(
      `<input value="foo bar baz"/>`,
    )
    element.focus()
    element.setSelectionRange(4, 7)

    const dt = userEvent.setup().copy({writeToClipboard: true})

    await expect(dt).resolves.toBeTruthy()
    expect((await dt).getData('text')).toBe('bar')

    await expect(window.navigator.clipboard.readText()).resolves.toBe('bar')

    expect(getEvents('copy')).toHaveLength(1)
  })

  test('copy selected text outside of editable', async () => {
    const {element, getEvents} = setup(`<div tabindex="-1">foo bar baz</div>`)
    element.focus()
    document
      .getSelection()
      ?.setBaseAndExtent(
        element.firstChild as Text,
        1,
        element.firstChild as Text,
        5,
      )

    const dt = userEvent.setup().copy({writeToClipboard: true})

    await expect(dt).resolves.toBeTruthy()
    expect((await dt).getData('text')).toBe('oo b')

    await expect(window.navigator.clipboard.readText()).resolves.toBe('oo b')

    expect(getEvents('copy')).toHaveLength(1)
  })

  test('copy selected text in contenteditable', async () => {
    const {element, getEvents} = setup(`<div contenteditable>foo bar baz</div>`)
    element.focus()
    document
      .getSelection()
      ?.setBaseAndExtent(
        element.firstChild as Text,
        1,
        element.firstChild as Text,
        5,
      )

    const dt = userEvent.setup().copy({writeToClipboard: true})

    await expect(dt).resolves.toBeTruthy()
    expect((await dt).getData('text')).toBe('oo b')

    await expect(window.navigator.clipboard.readText()).resolves.toBe('oo b')

    expect(getEvents('copy')).toHaveLength(1)
  })
})
