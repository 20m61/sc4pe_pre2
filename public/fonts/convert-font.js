const opentype = require('opentype.js');
const fs = require('fs');

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
    console.log('Usage: node convert-font.js <input-path> <output-path>');
    process.exit(1);
}

opentype.load(inputPath, (err, font) => {
    if (err) {
        console.error('Could not load font:', err);
        return;
    }

    // glyphsを適切に処理するためにforEachを使用
    const glyphs = [];
    font.glyphs.forEach(glyph => {
        glyphs.push({
            name: glyph.name,
            unicode: glyph.unicode,
            path: glyph.getPath().toPathData(),
            advanceWidth: glyph.advanceWidth,
        });
    });

    const fontJson = {
        glyphs,
        familyName: font.names.fontFamily.en,
        styleName: font.names.fontSubfamily.en,
        unitsPerEm: font.unitsPerEm,
        ascender: font.ascender,
        descender: font.descender,
    };

    fs.writeFileSync(outputPath, JSON.stringify(fontJson, null, 2));
    console.log(`Font converted and saved to ${outputPath}`);
});
