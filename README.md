# ConfluxScan

This repository contains the shared next-generation frontend capabilities for
ConfluxScan.

During the current migration phase, Core Space and eSpace continue to maintain
their pages and deployments independently in the scan projects. This repository
focuses on extracting reusable components and logic into `packages/*`; each
scan project then replaces its old implementation with the next package. Once
scan mainly contains page composition and Space-specific logic, the team can
decide whether to migrate the page deployments as a separate phase.

For the three-repository workspace layout, source-repository rules, and the
component migration workflow, see
[docs/CROSS_REPO_CONTEXT.md](docs/CROSS_REPO_CONTEXT.md).

### Develop

To develop all apps and packages, run the following command:

```
pnpm install
```

```
pnpm dev
```

During incremental migration, establish a soft connection so the scan projects
can consume the local packages from this repository.

```
ln -s ../../../sirius-next/packages/common ../sirius/node_modules/@cfxjs/sirius-next-common
ln -s ../../../sirius-next/packages/i18n ../sirius/node_modules/@cfxjs/sirius-next-i18n
ln -s ../../../sirius-next/packages/common ../sirius-eth/node_modules/@cfxjs/sirius-next-common
ln -s ../../../sirius-next/packages/i18n ../sirius-eth/node_modules/@cfxjs/sirius-next-i18n
```

The sibling scan projects must already exist at the paths used above. These
links are part of the current package-integration workflow; they do not imply
that the scan pages are being moved into `apps/core` or `apps/evm` now.

### Build

To build all apps and packages, run the following command:

```
pnpm build
```

### Verify scan consumers

To verify that the packed common package shares the Router and i18n runtime
instances provided by both sibling scan projects, run:

```
pnpm test:consumers
```

The check reads the current `node_modules` of `../sirius` and `../sirius-eth`,
creates temporary packed-package fixtures, and does not modify either scan
repository. Override the paths with `SIRIUS_CORE_PATH` and `SIRIUS_EVM_PATH`
when the sibling projects are located elsewhere.

### Test coverage

To run the common package tests and generate a V8 coverage report, run:

```
pnpm test:coverage
```

The text summary is printed to the terminal. HTML and JSON summary reports are
written to `coverage/common/`.

### Deploy

When publishing a reusable package, run the following command to generate the
changeset files.

```
pnpm changeset add
```

then you need commit the changeset files and push to the remote repository.

The scan projects continue to own their own page build and deployment process
during this incremental migration.

## 🗂 Directory Structure

| Folder      | Contents                                                              |
| ----------- | --------------------------------------------------------------------- |
| `apps/`     | Core/EVM application shells and future integration points.            |
| `packages/` | Reusable public modules consumed by the scan projects and app shells. |

## License

[MIT](http://opensource.org/licenses/MIT)
