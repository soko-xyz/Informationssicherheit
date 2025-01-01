const SBox = [
    [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76],
    [0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0],
    [0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15],
    [0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75],
    [0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84],
    [0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf],
    [0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8],
    [0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2],
    [0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73],
    [0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb],
    [0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79],
    [0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08],
    [0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a],
    [0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e],
    [0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf],
    [0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16]
]

const RCON1 = [0x01, 0x00, 0x00, 0x00];

document.addEventListener("DOMContentLoaded", () => {
    const explanationBox = document.getElementById("aesExplanation");

    let roundKey, rotWordResult, subBytesResult, addedRCONResult, words;

    function appendExplanation(text) {
        explanationBox.value += text + "\n-------------------\n";
        explanationBox.scrollTop = explanationBox.scrollHeight;
    }

    function updateButtonStates() {
        document.getElementById("splitKey").disabled = !roundKey;
        document.getElementById("applyRotWord").disabled = !words[3]
        document.getElementById("applySubBytes").disabled = rotWordResult.length !== 4;
        document.getElementById("applyRcon").disabled = !subBytesResult.length;
        document.getElementById("calculateW4-5").disabled = !addedRCONResult.length;
        document.getElementById("nextKey").disabled = !words[7];
    }

    function resetArrays() {
        rotWordResult = [];
        subBytesResult = [];
        addedRCONResult = [];
        words = [];
    }

    function generateRandomRoundKey() {
        const key = [];
        for (let i = 0; i < 4; i++) {
            const word = [];
            for (let j = 0; j < 4; j++) {
                word.push(Math.floor(Math.random() * 256));
            }
            key.push(word);
        }
        return key;
    }

    function rotWord(word) {
        return [...word.slice(1), word[0]];
    }

    function subBytes(word) {
        return word.map(byte => {
            const row = (byte & 0xF0) >> 4;
            const col = byte & 0x0F;
            return SBox[row][col];
        });
    }

    function addRCON(word) {
        return word.map((byte, index) => byte ^ RCON1[index]);
    }

    function printXORWordsHandWrittenStyle(word1, word2, explanation) {
        const xorResult = word1.map((byte, index) => byte ^ word2[index]);

        explanation.push(' ' + word1.map(b => b.toString(2).padStart(8, '0')).join(' '));
        explanation.push('⊕' + word2.map(b => b.toString(2).padStart(8, '0')).join(' '));
        explanation.push("=".repeat(36));
        explanation.push(' ' + xorResult.map(b => b.toString(2).padStart(8, '0')).join(' '));
        explanation.push(' ' + xorResult.map(b => b.toString(16).padStart(2, '0')).join('         '));
        return xorResult;
    }

    document.getElementById("generateKey").addEventListener("click", () => {
        explanationBox.value = "";
        resetArrays();

        roundKey = generateRandomRoundKey();
        appendExplanation(`0. Rundenschlüssel (Matrix):\n${roundKey.map(row => row.map(b => b.toString(16).padStart(2, '0')).join(' ')).join('\n')}`);
        updateButtonStates();
    });

    document.getElementById("splitKey").addEventListener("click", () => {
        words[0] = roundKey.map(word => word[0]);
        words[1] = roundKey.map(word => word[1]);
        words[2] = roundKey.map(word => word[2]);
        words[3] = roundKey.map(word => word[3]);

        appendExplanation(`Wörter des Rundenschlüssels:\nw0=(${words[0].map(b => b.toString(16).padStart(2, '0')).join(' ')})^T\nw1=(${words[1].map(b => b.toString(16).padStart(2, '0')).join(' ')})^T\nw2=(${words[2].map(b => b.toString(16).padStart(2, '0')).join(' ')})^T\nw3=(${words[3].map(b => b.toString(16).padStart(2, '0')).join(' ')})^T`);
        updateButtonStates();
    });

    document.getElementById("applyRotWord").addEventListener("click", () => {
        rotWordResult = rotWord(words[3]);

        appendExplanation(`RotWord(w3)=(${rotWordResult.map(b => b.toString(16).padStart(2, '0')).join(' ')})^T`);
        updateButtonStates();
    });

    document.getElementById("applySubBytes").addEventListener("click", () => {
        subBytesResult = subBytes(rotWordResult);

        appendExplanation(`SubBytes(RotWord(W3))=(${subBytesResult.map(b => b.toString(16).padStart(2, '0')).join(' ')})^T`);
        updateButtonStates();

    });

    document.getElementById("applyRcon").addEventListener("click", () => {
        addedRCONResult = addRCON(subBytesResult);

        appendExplanation(`RCON(SubBytes(RotWord(W3)))=(${addedRCONResult.map(b => b.toString(16).padStart(2, '0')).join(' ')})^T`);
        updateButtonStates();
    });

    document.getElementById("calculateW4-5").addEventListener("click", () => {
        let explanation = []
        words[4] = printXORWordsHandWrittenStyle(words[0], addedRCONResult, explanation)
        explanation.push(`\nW4=(${words[4].map(b => b.toString(16).padStart(2, '0')).join(' ')})^T\n`);
        words[5] = printXORWordsHandWrittenStyle(words[4], words[1], explanation)
        explanation.push(`\nW5=(${words[5].map(b => b.toString(16).padStart(2, '0')).join(' ')})^T\n`);
        words[6] = printXORWordsHandWrittenStyle(words[5], words[2], explanation)
        explanation.push(`\nW6=(${words[6].map(b => b.toString(16).padStart(2, '0')).join(' ')})^T\n`);
        words[7] = printXORWordsHandWrittenStyle(words[6], words[3], explanation)
        explanation.push(`\nW7=(${words[7].map(b => b.toString(16).padStart(2, '0')).join(' ')})^T\n`);

        appendExplanation(explanation.join('\n'));
        updateButtonStates();
    });

    document.getElementById("nextKey").addEventListener("click", () => {
        const newKey = [words[4], words[5], words[6], words[7]];
        const transposedKey = newKey[0].map((_, colIndex) => newKey.map(row => row[colIndex]));
        const formattedKey = transposedKey
            .map(row => row.map(b => b.toString(16).padStart(2, '0')).join(' '))
            .join('\n');

        appendExplanation(`1. Rundenschlüssel (Matrix):\n${formattedKey}`);
    });

});
