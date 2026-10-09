# Nöbet: the look, and the rules behind it

*Nöbet* is the watch: the night a pharmacy stays open so that the others can close. I wanted the site to look like the thing it is about, which is a dark street and one shop with its light on. So nearly everything on a page is night, and whatever is lit is what you came for.

## The night, and the one colour

The ground and the colour are measured from the film on the front page, after it was graded: the darkest part of its sky, the light of its street lamps, and its brightest window.

| Token | Value | Use |
| --- | --- | --- |
| `--night` | `oklch(13.8% 0.053 270)` | The page |
| `--night-2`, `--night-3` | one and two steps up | A field, a dialog, the back of a picture before it loads |
| `--amber` | `oklch(64.2% 0.141 64)` | A fill: the lit lamp, the primary button, the chosen one of a few, the watch on the band |
| `--amber-pale` | `oklch(81.5% 0.1 81)` | Amber as lettering: a price, "open until", a count that wants attention |
| `--ink` | `oklch(97.2% 0.016 95)` | Lettering |
| `--ink-2`, `--ink-3` | two greys, towards the blue | Secondary lettering, and a pharmacy that is closed |
| `--line`, `--edge` | hairline, and 3 to 1 against the night | The few rules there are, and the edge of a control |
| `--wrong` | a warm red | Something that went wrong, and only that |

There is one rule for amber: **it means lit.** A pharmacy that is open, the choice that is on, the button to press, a price. Nothing is amber for decoration, and colour is never the only sign: an open pharmacy also says "Open until 19:00" in words, and a closed one says when it opens.

Every colour is OKLCH and is named once, at the top of `app/globals.css`. There is no light theme. A site about the night that turned white at noon would be a different site.

## The lamp

The one mark the site has. A small circle beside a pharmacy's name: filled and glowing when it is open at this minute, an empty ring when it is not. The same lamp marks an order still on its way, and each step an order has reached. The icon in the browser's tab is that lamp.

## Type

Two families.

- **Jost**, 300, 400 and 500, for everything that is read. It is a geometric face in the line of the lettering on old shop fronts and medicine labels. Headings are the light weight, large and set tight, like a title card. Nothing is bold.
- **DM Mono** for figures only: a time, a distance, a price, an order's reference (`.fig`). A figure in the mono face is something you can act on.

Neither family draws the lira sign, and the stand-in the browser borrowed came out a third too large beside the figures. `@font-face { font-family: 'Lira'; unicode-range: U+20BA }` at the top of `globals.css` names a face for that one character, at its own size.

Small capitals with letterspacing are kept for the name of a fact beside the fact (`.label`: WHERE, HOURS). They are not put over headings.

## Shape and space

- A control is a capsule. A surface (a picture, a dialog) has a corner of 6px. Those are the only two radii.
- There are no cards. A list is rows parted by hairlines; a page is parts separated by dark, and `--air` is how much.
- Nothing has a shadow except what lies over the page: a dialog, and a message at the foot of the screen. The only glow is the lamp's.
- Every target a finger has to hit is at least 44px.

## Pictures

- **The film is real.** The street on the cover and the rain on the window were filmed by two people and are credited on `/credits/`. Both are cut to a loop, graded towards the same blue and amber, and silent.
- **The pictures are generated**, and say so beside themselves. Every medicine is a plain pack on wet slate under one amber light, with nothing printed on it, so that none can be taken for a brand. Every example pharmacy has one detail of a shop in the same light: a bell on a counter, a night hatch, a pair of reading glasses under a lamp. I threw out any picture that came back with lettering in it, because invented lettering is the first thing that gives such a picture away.
- A pharmacist's own photograph, of a medicine or of the shop, replaces the generated one and is shown as it is.

## The front page

1. **The cover.** The street at night, filling the window, with "One light stays on." in the left of the frame, where the film is darkest. Under the film is a photograph of its first frame, so the page is whole before the film arrives. The district chooser is on the cover, because where you are is the first thing the site needs. A phone gets an upright cut.
2. **Open now.** The six nearest pharmacies as large names, each with its lamp. An open one is in full ink; a closed one stands back in grey.
3. **Start from what you need.** A search, the shelves by name, and a rail of six medicines.
4. **How the watch works**, over the rainy window. Under the sentence is a band: a day from nine to nine as one line, grey for the hours every pharmacy keeps and amber for the watch, with a mark where now is.
5. **Behind the counter**: the way in for a pharmacist.

## The pages inside

- **A pharmacy**: its lamp and its line, its name, its picture, four facts under their names, then its shelf with a small picture, a price and a button for each thing, then what people said.
- **A medicine**: its picture and what to be careful of, then who has it, open and near ones first.
- **The basket** goes to one pharmacy. **An order** has its state as the heading, and its steps as a row of lamps joined by a line that turns amber as they are reached.
- **The counter** (a pharmacist) and **the desk** (the administrator) are the same language with more on the page: figures in the mono face under their names, tabs that are links, orders as tickets, and plain tables for the lists only the desk reads.

## Motion

Slow, and little of it.

- **The cover.** Each line of the headline comes up into its slot, then the sentence and the controls. As the page moves on, the street falls behind.
- **Arriving.** Things come up 24px and fade in over a second, once.
- **A pharmacy's picture** opens from the middle outwards as its page arrives, once.
- **The rain** only falls while it is on the screen.
- **Between pages**, the old page fades as the new one arrives. It takes under 400ms, because the new page cannot be pressed until it has.
- **The wheel.** A mouse wheel is given some weight. Touch scrolling is left alone.
- Controls answer in 160 to 200ms. Buttons press to 98%.

With reduced motion nothing arrives, neither film starts (the cover can still be played), and the wheel is the browser's own. Two curves: `--ease-out` for a control answering a hand, `--ease-slow` for something arriving.

## What I ruled out

The green cross, white and mint, a pill for a logo, stock photographs of smiling people in white coats, cards with shadows, three boxes in a row, a gradient on anything, a small capital label over every heading, and a second colour.
