import { render } from '@react-email/render'
import { createElement, type ComponentType } from 'react'

export type RenderedEmail = {
  html: string
  text: string
}

export async function renderEmail<P extends object>(
  Template: ComponentType<P>,
  props: P,
): Promise<RenderedEmail> {
  const element = createElement(Template, props)
  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ])

  return { html, text }
}
