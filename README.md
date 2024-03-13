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
ln -s ../../sirius-next ../sirius/node_modules/sirius-next
ln -s ../../sirius-next ../sirius-eth/node_modules/sirius-next
```

### Build

To build all apps and packages, run the following command:

```
pnpm build
```

## 🗂 Directory Structure

| Folder      | Contents                                                                       |
| ----------- | ------------------------------------------------------------------------------ |
| `apps/`     | These are applications of different spaces with shared functionality.          |                            
| `packages/` | These are some public modules.                                                 |

## License

[MIT](http://opensource.org/licenses/MIT)