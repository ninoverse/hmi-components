[**@ninoverse/hmi-components**](../README.md)

***

[@ninoverse/hmi-components](../README.md) / configs/fonts

# configs/fonts

## Type Aliases

### FontToken

> **FontToken** = keyof *typeof* [`fonts`](#fonts)

Defined in: configs/fonts.ts:17

Union of font names (the keys of [fonts](#fonts)).

## Variables

### fonts

> `const` **fonts**: `object`

Defined in: configs/fonts.ts:8

Map of font name → CSS custom property holding its font stack. Reference in
styles with `var(fonts.quicksand)` or read imperatively via getComputedStyle.

#### Type Declaration

##### oxanium

> `readonly` **oxanium**: `"--font-oxanium"` = `'--font-oxanium'`

##### pixelifySans

> `readonly` **pixelifySans**: `"--font-pixelify-sans"` = `'--font-pixelify-sans'`

##### pressStart2p

> `readonly` **pressStart2p**: `"--font-press-start-2p"` = `'--font-press-start-2p'`

##### quicksand

> `readonly` **quicksand**: `"--font-quicksand"` = `'--font-quicksand'`

##### rubikGlitch

> `readonly` **rubikGlitch**: `"--font-rubik-glitch"` = `'--font-rubik-glitch'`

***

### googleFontsHref

> `const` **googleFontsHref**: `"https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&family=Oxanium:wght@200..800&family=Rubik+Glitch&family=Press+Start+2P&family=Pixelify+Sans:wght@400..700&display=swap"` = `'https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&family=Oxanium:wght@200..800&family=Rubik+Glitch&family=Press+Start+2P&family=Pixelify+Sans:wght@400..700&display=swap'`

Defined in: configs/fonts.ts:20

Ready-made Google Fonts stylesheet URL loading every family the library uses.
