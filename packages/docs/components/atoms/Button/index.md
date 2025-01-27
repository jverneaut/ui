# Button <Badges :texts="badges" />

<script setup>
  import pkg from '@studiometa/ui/atoms/Button/package.json';
  import AppPrimaryTwigRaw from './app-primary.twig?raw';
  import AppSecondaryTwigRaw from './app-secondary.twig?raw';

  const badges = [`v${pkg.version}`, 'Twig'];

  const stories = [
    {
      src: './story-primary.html',
      name: 'Primary',
      files: [
        {
          label: 'app.twig',
          lang: 'twig',
          content: AppPrimaryTwigRaw,
        },
      ],
    },
    {
      src: './story-secondary.html',
      name: 'Secondary',
      files: [
        {
          label: 'app.twig',
          lang: 'twig',
          content: AppSecondaryTwigRaw,
        },
      ],
    },
  ];
</script>

<Stories :stories="stories" />

## Parameters

### `label`

- Type: `string`

The button's label.

### `tag`

- Type: `string`

The button's tag. The default value is inferred from the other parameters. The `<a>` tag is used when the [`href` parameter](#href) is defined or when the [`attr` parameter](#attr) is defined with an `href` property, otherwise the `<button>` tag is used.

### `href`

- Type: `string`

The link of the button. Using this parameter will set the default value for the [`tag` parameter](#tag) to `a`.

### `attr`

- Type: `array`

Custom attributes for the root element. Using this parameter with an `href` property will set the default value for the [`tag` parameter](#tag) to `a`.

### `icon`

- Type: `string`

Name of an icon to use in the button.

### `icon_classes`

- Type: `string`

Customize classes for the icon element. Defaults to `mr-3` when the [`icon_position` parameter](#icon_position) is set to `start` and to `ml-3` when set to `end`.

### `icon_position`

- Type: `'start' | 'end'`
- Defaults: `'start'`

### `icon_only`

- Type: `boolean`
- Defaults: `false`

## Blocks

### `content`

Customize the content of the root element. Using this block will override the other blocks as they are nested in this one.

### `label`

Customize the label content, defaults to the [`label` parameter](#label).

### `icon`

Customize the icon content, defaults to the [`Icon` atom](/components/atoms/Icon/) with the [`icon` parameter](#icon) as its name.
