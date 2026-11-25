# Changelog

All notable changes to this package are listed here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the versions
follow [Semantic Versioning](https://semver.org/).

## [2.0.0] - Unreleased

### Breaking changes

- **Ink 8 and React 19.3 are required** (peer dependencies). Version 1.x
  worked with Ink 5 and React 18.
- **Node 22 or later is required**, as Ink 8 asks.
- **`Select` skips disabled options.** The arrows, `j`/`k` and the page keys
  no longer stop on them, and the cursor starts on the first enabled option.
- **`Select` and `ScrollableList`: an arrow pressed with `shift`, `ctrl` or
  `meta` no longer moves the cursor.**
- A component with a `backgroundColor` on a `Box` now shows that background:
  Ink 5 ignored it, Ink 8 paints it. This affects `DataTable`, `Markdown`,
  `Badge`, `ScrollableList` and `Overlay`.

### Added

- `Select`: `typeahead` prop. When on, typing letters jumps to the option
  that starts with them (accents and case ignored). `j` and `k` are then
  letters like any other.
- `Select` and `ScrollableList`: Home, End, Page Up and Page Down.
- `caret-tui add` prints the `npm install` line for the packages the copied
  components need and the project does not list, like `ink-behaviors`.

### Changed

- The keyboard navigation of `Select` and `ScrollableList` comes from the
  [`ink-behaviors`](https://www.npmjs.com/package/ink-behaviors) package,
  a new dependency.
- `caret-tui init` creates projects for Ink 8, React 19.3 and Node 22.
- Test files are no longer published in the package.

### Fixed

- `Pane` and `Card`: with Ink 8 the title background erased the whole top
  border. The title only covers its own text again.
- The sources of the CLI (`init` and `add`) are back in the repository. They
  had never been committed, so the project could not be built from a clone.

## [1.1.0] - 2026-04-08

Last version for Ink 5 and React 18.
