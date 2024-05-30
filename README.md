# ConfluxScan

This is a great update, a brand new Conflux Scan.

### Develop

To develop all apps and packages, run the following command:

```
pnpm install
```

```
pnpm dev
```

Before the migration is completed, you need to establish a soft connection for local development.

```
ln -s ../../../sirius-next/packages/common ../sirius/node_modules/@cfxjs/sirius-next-common
ln -s ../../../sirius-next/packages/i18n ../sirius/node_modules/@cfxjs/sirius-next-i18n
ln -s ../../../sirius-next/packages/common ../sirius-eth/node_modules/@cfxjs/sirius-next-common
ln -s ../../../sirius-next/packages/i18n ../sirius-eth/node_modules/@cfxjs/sirius-next-i18n
```

### Build

To build all apps and packages, run the following command:

```
pnpm build
```

## 🗂 Directory Structure

| Folder      | Contents                                                              |
| ----------- | --------------------------------------------------------------------- |
| `apps/`     | These are applications of different spaces with shared functionality. |
| `packages/` | These are some public modules.                                        |

## License

[MIT](http://opensource.org/licenses/MIT)
