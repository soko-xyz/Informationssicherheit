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
];

const MixColumnsMatrix = [
    [0x02, 0x03, 0x01, 0x01],
    [0x01, 0x02, 0x03, 0x01],
    [0x01, 0x01, 0x02, 0x03],
    [0x03, 0x01, 0x01, 0x02]
];

let matrix = [];
let selectedByte = {row: 0, col: 0};
let maskedMatrix = [];
let subedBytes = [];
let shiftedMatrix = [];

function generateRandomMatrix() {
    return Array.from({length: 4}, () => Array.from({length: 4}, () => Math.floor(Math.random() * 256)));
}

function xorMatrices(matrix1, matrix2) {
    return matrix1.map((row, i) => row.map((value, j) => value ^ matrix2[i][j]));
}

function maskMatrix(matrix) {
    const n = matrix.length;
    const masked = [];

    for (let i = 0; i < n; i++) {
        masked[i] = [];
        for (let j = 0; j < n; j++) {
            const targetCol = (i + selectedByte.col) % n;
            if (j === targetCol) {
                masked[i][j] = matrix[i][j];
            } else {
                masked[i][j] = '..';
            }
        }
    }

    return masked;
}

function subBytes(matrix) {
    return matrix.map(row => row.map(byte => {
        if (byte === "..") {
            return "..";
        }
        const row = (byte & 0xF0) >> 4;
        const col = byte & 0x0F;
        return SBox[row][col];
    }));
}

function shiftRows(matrix) {
    return matrix.map((row, i) => row.map((_, j) => matrix[i][(j + i) % 4]));
}

function displayFalkSchema(stateMatrix, mixColumnsMatrix, explanation) {
    explanation.push("Spaltenmatrix * Matrix:");
    explanation.push(
        "            " + stateMatrix.map(row => row.map(val => val.toString(16).padStart(2, "0")).join(" ")).join("\n            ")
    );

    const a = mixColumnsMatrix.map((row) => row.map(val => val.toString(16).padStart(2, "0")).join(" "))

    a[selectedByte.row] += "   ".repeat(selectedByte.col) + " x "

    explanation.push(a.join("\n"));
}


function galoisFieldMultiply(mixColumnsMatrix, stateMatrix1) {
    let result = 0;
    for (let i = 0; i < 8; i++) {
        if ((mixColumnsMatrix & (1 << i)) !== 0) {
            result ^= stateMatrix1 << i;
        }
    }
    return result;
}

function mixColumns(stateMatrix, explanation) {
    displayFalkSchema(stateMatrix, MixColumnsMatrix, explanation);

    explanation.push("");
    const results = [];
    for (let i = 0; i < 4; i++) {
        explanation.push(`${MixColumnsMatrix[selectedByte.row][i].toString(16).padStart(2, "0")} * ${stateMatrix[i][selectedByte.col].toString(16).padStart(2, "0")}`);
        explanation.push(`= ${MixColumnsMatrix[selectedByte.row][i].toString(2).padStart(8, "0")} * ${stateMatrix[i][selectedByte.col].toString(2).padStart(8, "0")}`);
        explanation.push(`= (${MixColumnsMatrix[selectedByte.row][i].toString(2).padStart(8, "0").split("").map((bit, j) => bit === "1" ? `x^${7 - j}` : "").filter(val => val).join(" + ")}) * (${stateMatrix[i][selectedByte.col].toString(2).padStart(8, "0").split("").map((bit, j) => bit === "1" ? `x^${7 - j}` : "").filter(val => val).join(" + ")})`);
        results[i] = galoisFieldMultiply(MixColumnsMatrix[selectedByte.row][i], stateMatrix[i][selectedByte.col]);
        explanation.push(`= ${results[i].toString(2).padStart(9, "0").split("").map((bit, j) => bit === "1" ? `x^${8 - j}` : "").filter(val => val).join(" + ")}`);
        explanation.push(`= ${results[i].toString(2).padStart(9, "0")}`);
        if (results[i] >= 256) {
            explanation.push(`Da x^8 zu groß ist reduzieren durch irreduziblen Polynom: x^8 + x^4 + x^3 + x + 1`);
            explanation.push(`= ${results[i].toString(2).padStart(9, "0")}`);
            const irreducible = 0b100011011;
            explanation.push(`⊕ ${irreducible.toString(2).padStart(9, "0")}`);
            results[i] ^= irreducible;
        }

        explanation.push(`= ${results[i].toString(16).padStart(2, "0")}`);
        explanation.push("");
    }

    let finalResult = 0;
    for (let i = 0; i < 4; i++) {
        finalResult ^= results[i];
    }
    explanation.push("Ergebnis vor AddRoundKey am Ende der ersten Runde:");
    explanation.push(`  ${results.map(val => val.toString(2).padStart(8, "0")).join("\n⊕ ")}`);
    explanation.push("==========");
    explanation.push(` ${finalResult.toString(2).padStart(8, "0")}`);
    explanation.push(`= ${finalResult.toString(16).padStart(2, "0")}`);
}


document.addEventListener("DOMContentLoaded", () => {
    const explanationBox = document.getElementById("calculationSteps");
    function appendToExplanation(text) {
        explanationBox.value += text + "\n-------------------\n";
        explanationBox.scrollTop = explanationBox.scrollHeight;
    }

    function updateButtonStates() {
        document.getElementById("relevantBytes").disabled = matrix.length === 0;
        document.getElementById("subBytes").disabled = maskedMatrix.length === 0;
        document.getElementById("shiftRows").disabled = subedBytes.length === 0;
        document.getElementById("mixColumns").disabled = shiftedMatrix.length === 0;
    }

    document.getElementById("generateMatrix").addEventListener("click", () => {
        const plaintext = generateRandomMatrix();
        const key = generateRandomMatrix();
        matrix = xorMatrices(plaintext, key);
        explanationBox.value = "";
        maskedMatrix = [];
        subedBytes = [];
        shiftedMatrix = [];

        selectedByte = {row: Math.floor(Math.random() * 4), col: Math.floor(Math.random() * 4)};

        appendToExplanation(`Nach XOR (Klartext ⊕ Schlüssel):\n${matrix.map(row => row.map(val => val.toString(16).padStart(2, "0")).join(" ")).join("\n")}\n\nZu berechnendes Byte: Zeile ${selectedByte.row + 1}, Spalte ${selectedByte.col + 1}`);
        updateButtonStates();
    });

    document.getElementById("relevantBytes").addEventListener("click", () => {
        maskedMatrix = maskMatrix(matrix);
        appendToExplanation(`Relevante Bytes (Matrix):\n${maskedMatrix.map(row => row.join(" ")).join("\n")}`);
        updateButtonStates();
    });

    document.getElementById("subBytes").addEventListener("click", () => {
        subedBytes = subBytes(maskedMatrix);
        appendToExplanation(`Nach SubBytes (nur relevante Bytes):\n${subedBytes.map(row => row.map(val => val.toString()).join(" ")).join("\n")}`);
        updateButtonStates();
    });

    document.getElementById("shiftRows").addEventListener("click", () => {
        shiftedMatrix = shiftRows(subedBytes);
        appendToExplanation(`Nach ShiftRows (nur relevante Bytes):\n${shiftedMatrix.map(row => row.map(val => val.toString()).join(" ")).join("\n")}`);
        updateButtonStates();
    });

    document.getElementById("mixColumns").addEventListener("click", () => {
        const explanation = [];

        mixColumns(shiftedMatrix, explanation);
        appendToExplanation(explanation.join("\n"));
    });
});
