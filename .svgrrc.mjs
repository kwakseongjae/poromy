export default {
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
          },
        },
      },
    ],
  },
  typescript: true,
  ref: true,
  memo: true,
  titleProp: true,
  replaceAttrValues: {
    '#000': 'currentColor',
    '#000000': 'currentColor',
    black: 'currentColor',
  },
  prettier: false, // Prettier 플러그인 비활성화
}
