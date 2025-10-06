function save() {
    localStorage.setItem("a1a-design", LZString.compressToUTF16(JSON.stringify(gameData, itemReplacer)))
}
