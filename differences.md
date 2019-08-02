Known differences between the original game and this remake
===========================================================

Listed here are all differences between the two versions that I know of. The differences were included either deliberately to improve usability or due to the limitations of JavaScript or the browser. If you find other differences or think that the behaviour is wrong, please feel free to contact me, preferably via [Github issues](https://github.com/Frunit/qpop.js/issues) or via [frunit.de/qpop/kontakt.php](https://frunit.de/qpop/kontakt.php).


#### Loader before the game starts

The load screen was included for two reasons.

1. The game resources, especially music, are several megabytes in size and might take a while to load on slow connections.
2. Modern browsers disallow the playback of any sound before a user interacts with the page, for example, with a click. That's why you have to click to start and the game does not start automatically when all resources were loaded.


#### Different menu bar and options

I changed the menu bar to allow for more options and to remove the two useless options to quit to desktop and to disable animations. Modern and even not-so-modern computers are strong enough to handle the animations in the game.


#### Multiple languages

Obviously, you can change the language in the menu. I would be happy for any contributions, be it new translations or corrections of existing ones.


#### Different font

The font in the game is whatever the browser consideres the best *sans serif* font. This is to support possible translations to languages with non-latin letters. It was also easier to program than to include the old font of the original game.


#### Right click to circle player types backwards

When choosing the player type, you can right click to circle backwards instead of forwards. This was a simple usability change.


#### Click and hold to place multiple individuals on the world map

In the original game, you had to click for each individual to be placed. Now, you can click and hold to place multiple individuals by moving the mouse.


#### World map properties on the mutation screen

The mutation screen now shows the distribution of own individuals among the plants of the world map to make it easier to choose the appropriate traits to improve.


#### Survival map creation

I spent many hours extracting survival maps from RAM and running statistics on them. I hope that I managed to resemble the survival maps as closely as possible, but there will probably be differences.


#### Electro flower and other behaviour

The electro flower and other rare events may work differently than in the original game. Since they are so rare, I don't have much data on them.