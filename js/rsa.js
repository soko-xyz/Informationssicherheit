document.addEventListener("DOMContentLoaded", () => {
    const explanationBox = document.getElementById("explanation");
    let p, q, n, phi, e, d;

    function appendExplanation(text) {
        explanationBox.value += text + "\n-------------------\n";
        explanationBox.scrollTop = explanationBox.scrollHeight;
    }

    function updateButtonStates() {
        document.getElementById("calculatePhi").disabled = !p || !q;
        document.getElementById("selectE").disabled = !phi;
        document.getElementById("calculateN").disabled = !p || !q;
        document.getElementById("calculateD").disabled = !e || !phi;
        document.getElementById("encrypt").disabled = !e || !n;
        document.getElementById("decrypt").disabled = !d || !n;
    }

    document.getElementById("generatePrimes").addEventListener("click", () => {
        p = q = n = phi = e = d = null;
        explanationBox.value = "";

        const result = generateTwoDifferentPrimesWithExplanation();
        p = BigInt(result.p);
        q = BigInt(result.q);
        appendExplanation(`Primzahlen generiert: p = ${p}, q = ${q}`);
        updateButtonStates();
    });

    document.getElementById("calculatePhi").addEventListener("click", () => {
        const result = phiWithExplanation(p, q);
        phi = BigInt(result.phi);
        appendExplanation(result.explanation);
        updateButtonStates();
    });

    document.getElementById("selectE").addEventListener("click", () => {
        const result = selectEWithExplanation(phi);
        e = BigInt(result.e);
        appendExplanation(`${result.explanation}\n\ne = ${e}`);
        updateButtonStates();
    });

    document.getElementById("calculateN").addEventListener("click", () => {
        n = p * q;
        appendExplanation(`n = p * q = ${p} * ${q} = ${n}`);
        updateButtonStates();
    });

    document.getElementById("calculateD").addEventListener("click", () => {
        const result = calculateModularInverseWithSteps(e, phi);
        d = result.modularInverse;
        appendExplanation(result.explanation);
        updateButtonStates();
    });

    document.getElementById("encrypt").addEventListener("click", () => {
        const message = BigInt(prompt("Geben Sie eine Nachricht als Zahl ein:") || 123);
        const result = encryptWithExplanation(message, e, n);
        appendExplanation(result.explanation);
        updateButtonStates();
    });

    document.getElementById("decrypt").addEventListener("click", () => {
        const ciphertext = BigInt(prompt("Geben Sie die verschlüsselte Nachricht als Zahl ein:")|| 123);
        const result = decryptWithExplanation(ciphertext, d, n);
        appendExplanation(result.explanation);
        updateButtonStates();
    });
});

function generateTwoDifferentPrimesWithExplanation() {
    let p, q;
    do {
        p = generateTwoDigitPrime();
        q = generateTwoDigitPrime();
    } while (p === q || !hasValidE(phiWithExplanation(BigInt(p), BigInt(q)).phi));

    return { p, q };
}

function generateTwoDigitPrime() {
    let prime;
    do {
        prime = Math.floor(Math.random() * (99 - 10 + 1)) + 10;
    } while (!isProbablePrime(prime));
    return prime;
}

function isProbablePrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;

    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

function hasValidE(phi) {
    for (let e = 3n; e <= 5n; e++) {
        if (this.gcd(e, phi) === 1n) {
            return true;
        }
    }
    return false;
}

function gcd(a, b) {
    while (b !== 0n) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function phiWithExplanation(p, q) {
    const phi = (p - 1n) * (q - 1n);
    const explanation = `phi(n) = (p - 1) * (q - 1)\nphi(n) = (${p} - 1) * (${q} - 1) = ${p-1n} * ${q-1n} = ${phi}`;
    return { phi, explanation };
}

function selectEWithExplanation(phi) {
    const explanation = [];

    const quersumme = phi.toString().split('').reduce((acc, digit) => acc + BigInt(digit), 0n);
    if (quersumme % 3n !== 0n) {
        explanation.push(`e = 3 ist gültig, da die Quersumme von ${phi} = ${quersumme} nicht durch 3 teilbar ist.`);
        return { e: 3n, explanation: explanation.join("\n") };
    } else {
        explanation.push(`e = 3 ist nicht gültig, da die Quersumme von ${phi} = ${quersumme} durch 3 teilbar ist.`);
    }

    const lastTwoDigits = phi % 100n;
    if (lastTwoDigits % 4n !== 0n) {
        explanation.push(`e = 4 ist gültig, da die letzten beiden Ziffern=${lastTwoDigits} nicht durch 4 teilbar ist.`);
        return { e: 4n, explanation: explanation.join("\n") };
    } else {
        explanation.push(`e = 4 ist nicht gültig, da die letzten beiden Ziffern=${lastTwoDigits} durch 4 teilbar ist.`);
    }

    const lastDigit = phi % 10n;
    if (lastDigit !== 5n && lastDigit !== 0n) {
        explanation.push(`e = 5 ist gültig, da die letzte Stelle von ${phi} = ${lastDigit} nicht 5 oder 0 ist.`);
        return { e: 5n, explanation: explanation.join("\n") };
    } else {
        explanation.push(`e = 5 ist nicht gültig, da die letzte Stelle von ${phi} = ${lastDigit} 5 oder 0 ist.`);
    }

    explanation.push("Kein gültiges e gefunden!");
    return { e: null, explanation: explanation.join("\n") };
}

function calculateModularInverseWithSteps(a, b) {
    let steps, result = [];

    try {
        steps = calculateModularInverseSteps(a, b);
    } catch (error) {
        console.error("Error in calculateModularInverseWithSteps: Cannot calculate steps:", error);
        throw new Error("Invalid inputs provided to calculateSteps.");
    }

    result.push("Euklidischer Algorithmus:\n");
    steps.forEach(step => {
        result.push(`${step.a} : ${step.b} = ${step.quotient} Rest ${step.remainder}\tUmgestellt zu: ${step.remainder} = ${step.a} - ${step.quotient} * ${step.b}`);
    });

    result.push("\nErweiterter Euklidischer Algorithmus (Rückwärts einsetzen):\n");

    let x = 0n;
    let y = 1n;
    const startIndex = steps.length - 2;

    for (let i = startIndex; i >= 0; i--) {
        const step = steps[i];

        result.push(`\n1 = ${x} * ${step.a} + ${y} * ${step.b}\n`);

        const newX = y;
        const newY = x - step.quotient * y;

        result.push(` => Setze ${step.b} = ${step.a} - ${step.quotient} * ${step.b}\n`);

        x = newX;
        y = newY;
    }

    result.push("\nEndgültige Linearkombination:\n");
    result.push(`1 = ${x} * ${steps[0].a} + ${y} * ${steps[0].b}\n`);

    let modularInverse;
    try {
        modularInverse = x < 0n ? x + b : x;
    } catch (error) {
        console.error("Error calculating modular inverse:", error);
        throw new Error("Error in calculating modular inverse.");
    }

    if (x < 0n) {
        result.push(`\nDa ${x} < 0, addiere ${b}\n`);
        result.push(`${x} + ${b} = ${modularInverse}, ist das modulare Inverse\n`);
    } else {
        result.push(`\nDa ${x} >= 0, ist ${x} das modulare Inverse\n`);
    }

    result.push(`\nModulares Inverses: ${modularInverse}\n`);

    return {modularInverse, explanation: result.join("\n")};
}

function calculateModularInverseSteps(a, b) {
    const steps = [];
    let currentA = a;
    let currentB = b;

    while (currentB !== 0n) {
        const quotient = currentA / currentB;
        const remainder = currentA % currentB;
        steps.push({
            a: currentA,
            b: currentB,
            quotient,
            remainder
        });
        currentA = currentB;
        currentB = remainder;
    }


    return steps;
}

function encryptWithExplanation(m, e, n) {
    const c = this.modPow(m, e, n);
    const explanation = `Verschlüsselung: c = m^e mod n = ${m}^${e} mod ${n} = ${c}`;
    return { c, explanation };
}

function decryptWithExplanation(c, d, n) {
    const m = this.modPow(c, d, n);
    const explanation = `Entschlüsselung: m = c^d mod n = ${c}^${d} mod ${n} = ${m}`;
    return { m, explanation };
}

function modPow(base, exp, mod) {
    let result = 1n;
    base = base % mod;

    while (exp > 0n) {
        if (exp % 2n === 1n) {
            result = (result * base) % mod;
        }
        exp = exp / 2n;
        base = (base * base) % mod;
    }

    return result;
}