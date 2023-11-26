Q-POP
=====

[Play Q-Pop online for free!](https://frunit.itch.io/q-pop)

The game **Q-POP** was published in 1995 by *von Wendt Konzept GmbH* in Germany. It was only published in German, although an unfinished English version exists. The sparse resources you can find on the net will mostly be in German as for example my fan page [frunit.de/qpop](https://www.frunit.de/qpop) and the [Fandom Wiki](https://qpop.fandom.com/de) (feel free to start an English version!).

As an exercise in Javascript programming and in reverse engineering, I tried to reimplement the game in Javascript to make it accessible to anyone with a modern browser. I used vanilla Javascript without any frameworks or other external dependencies.

Furthermore, I tried to stick to the original game as closely as possible except for some convenience functionality. Known differences to the original game are documented [here](differences.md). A long-term goal is to also include the game **Magnetic Planet** that is basically the same game as Q-Pop but with different graphics and slightly different game mechanics. But please consider this a *very* long-term goal!

I would be happy to see pull requests and other constructive input from you! Any translations would also be very welcome! Please have a look at [i18n.js](i18n.js).

The licensing is a bit complicated. The code is released under the [MIT license](LICENSE_CODE). The images and sounds are taken straight from the game and just reformated to a modern format. I managed to contact two of the three original creators of the game (Karl-L. von Wendt and Lars Hammer) and both allowed me to use any game resources for fair and non-profit use.

I made an own repository for the original graphics here: [github.com/Frunit/qpop-ressourcen](https://github.com/Frunit/qpop-ressourcen)

If you have any comments, suggestions, or bug reports, please open a new [issue](https://github.com/Frunit/qpop.js/issues).

## Install, build and run

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```
