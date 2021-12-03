import { expect } from '@storybook/jest';
import { within, userEvent } from '@storybook/testing-library';
import { wait } from '../.storybook/utils.js';

export default {
  title: 'Accordion',
};

export const Accordion = {
  parameters: {
    server: {
      id: 'Accordion',
      params: {
        items: [
          {
            title: 'Dede',
            content: `
              Pellentesque et ridiculus vel fringilla gravida etiam libero duis,
              cubilia lobortis potenti erat sollicitudin nibh aliquet purus,
              sodales litora orci urna non feugiat porttitor. Erat justo nisi
              euismod senectus ornare dapibus vivamus odio quam parturient
              sociosqu pellentesque lectus, tristique hac sem cubilia mus tempor
              class et ac rhoncus curae. Scelerisque id habitant vivamus vel dis
              suspendisse amet hac venenatis, natoque erat pharetra dui suscipit
              laoreet himenaeos porttitor nec elementum, phasellus faucibus
              aptent facilisi libero consequat iaculis cubilia.
            `,
          },
          {
            title: 'Dada',
            content: `
              Actus ornare dapibus vivamus odio quam parturient sociosqu pellen
              tesque lectus, tristique hac sem cubilia mus tempor class et ac
              rhoncus curae. Scelerisque id habitant vivamus vel dis suspendisse
              amet hac venenatis, natoque erat pharetra dui suscipit laoreet
              himenaeos porttitor nec elementum, phasellus faucibus aptent
              facilisi libero consequat iaculis cubilia.
            `,
          },
        ],
      },
    },
  },
  async play({ canvasElement }) {
    await wait();
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');
    const contents = buttons.map((button) =>
      canvasElement.querySelector(`#${button.getAttribute('aria-controls')}`)
    );

    await userEvent.click(buttons[0]);
    await expect(contents[0].getAttribute('aria-hidden')).toBe('false');
    await expect(contents[1].getAttribute('aria-hidden')).toBe('true');
    await userEvent.click(buttons[1]);
    await expect(contents[0].getAttribute('aria-hidden')).toBe('false');
    await expect(contents[1].getAttribute('aria-hidden')).toBe('false');
    await userEvent.click(buttons[0]);
    await wait();
    await expect(contents[0].getAttribute('aria-hidden')).toBe('true');
    await expect(contents[1].getAttribute('aria-hidden')).toBe('false');
  },
};
