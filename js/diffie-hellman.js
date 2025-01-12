document.addEventListener("DOMContentLoaded", () => {
    const explanationBox = document.getElementById("explanation");
    let p, subgroups, generator, privateKeyAlice, privateKeyBob, publicKeyAlice, publicKeyBob, sharedKeyAlice, sharedKeyBob;

    function appendExplanation(text) {
        explanationBox.value += text + "\n-------------------\n";
        explanationBox.scrollTop = explanationBox.scrollHeight;
    }

    function updateButtonStates() {
        document.getElementById("calculateSubgroups").disabled = !p;
        document.getElementById("selectGenerator").disabled = !subgroups || subgroups.length === 0;
        document.getElementById("exchangeKeys").disabled = !generator;
    }

    document.getElementById("generateP").addEventListener("click", () => {
        explanationBox.value = "";
        p = subgroups = generator = privateKeyAlice = privateKeyBob = publicKeyAlice = publicKeyBob = sharedKeyAlice = sharedKeyBob = null;

        p = generateSmallPrime();
        const explanation = `1. Generiere eine kleine Primzahl p:\n   p = ${p}`;
        appendExplanation(explanation);
        updateButtonStates();
    });

    document.getElementById("calculateSubgroups").addEventListener("click", () => {
        subgroups = calculateSubgroups(p);

        const subgroupDetails = subgroups.map(subgroup => {
            let details = `  Untergruppe erzeugt durch g = ${subgroup.generator}:\n  { ${subgroup.elements.join(", ")} }\n  Berechnung:`;
            subgroup.steps.forEach(step => {
                details += `\n    ${step.base}^${step.exponent} mod ${p} = ${step.result}`;
            });
            return details;
        }).join("\n\n");

        const explanation = `2. Berechne alle Untergruppen für p = ${p}:\n\n${subgroupDetails}`;
        appendExplanation(explanation);
        updateButtonStates();
    });

    document.getElementById("selectGenerator").addEventListener("click", () => {
        const inputGenerator = prompt(`Gib einen Generator ein, um zu überprüfen, ob er gültig ist:`);
        if (!inputGenerator || isNaN(inputGenerator)) {
            appendExplanation("Ungültige Eingabe. Bitte eine Zahl eingeben.");
            return;
        }

        const parsedGenerator = parseInt(inputGenerator, 10);
        const maxSize = Math.max(...subgroups.map(s => s.elements.length));

        const validGenerator = subgroups.some(
            s => s.generator === parsedGenerator && s.elements.length === maxSize
        );

        const explanation = validGenerator
            ? `3. Wähle einen Generator g:\n   g = ${parsedGenerator}\n   Dieser Generator ist gültig und erzeugt die größte Gruppe (${maxSize} Elemente).`
            : `3. Wähle einen Generator g:\n   g = ${parsedGenerator}\n   Dieser Generator wäre gültig, erzeugt aber nicht die größte Gruppe. Es wäre sicherer, die größten zu nehmen.`;

        if (validGenerator) {
            generator = parsedGenerator;
        }

        appendExplanation(explanation);
        updateButtonStates();
    });

    document.getElementById("exchangeKeys").addEventListener("click", () => {
        const x = Math.floor(Math.random() * (p - 2)) + 1; // 1 ≤ a < p
        const y = Math.floor(Math.random() * (p - 2)) + 1; // 1 ≤ b < p

        const a = modExp(generator, x, p); // a = g^x mod p
        const b = modExp(generator, y, p); // b = g^y mod p

        const k_1 = modExp(a, x, p); // k_1 = B^a mod p
        const k_2 = modExp(b, y, p); // k_2 = A^b mod p

        const explanation = `
4. Schlüsselaustausch zwischen Alice und Bob:

   a) Alice und Bob wählen ihre privaten Schlüssel (kleiner als p und Elemente der Neutrale Zahlen):
      Alice (x): ${x}
      Bob (y): ${y}

   b) Alice und Bob berechnen ihre öffentlichen Schlüssel:
      Alice berechnet a = g^x mod p = ${generator}^${x} mod ${p} = ${a}
      Bob berechnet b = g^y mod p = ${generator}^${y} mod ${p} = ${b}

   c) Alice und Bob tauschen ihre öffentlichen Schlüssel aus:
      Alice erhält b = ${b}
      Bob erhält a = ${a}

   d) Beide berechnen den gemeinsamen Schlüssel:
      Alice berechnet k_1 = b^x mod p = ${b}^${x} mod ${p} = ${k_1}
      Bob berechnet k_2 = a^y mod p = ${a}^${y} mod ${p} = ${k_2}

   Ergebnis:
      ${
            k_1 === k_2
                ? `Erfolgreich: Beide erhalten den gleichen gemeinsamen Schlüssel: k = ${k_1}`
                : `Fehler: Die berechneten Schlüssel stimmen nicht überein!`
        }
`;
        appendExplanation(explanation);
    });

    function generateSmallPrime() {
        const smallPrimes = [3, 5, 7, 11, 13, 17, 19];
        return smallPrimes[Math.floor(Math.random() * smallPrimes.length)];
    }

    function calculateSubgroups(p) {
        const group = Array.from({ length: p - 1 }, (_, i) => i + 1);
        const subgroups = [];

        for (let g of group) {
            const elements = new Set();
            let value = 1;
            const steps = [];
            for (let i = 1; i <= p - 1; i++) {
                value = (value * g) % p;
                elements.add(value);
                steps.push({ base: g, exponent: i, result: value });
                if (value === 1) break; // Abbrechen, wenn wir die 1 erreicht haben
            }
            subgroups.push({ generator: g, elements: Array.from(elements), steps });
        }

        return subgroups;
    }

    function modExp(base, exp, mod) {
        let result = 1;
        base = base % mod;
        while (exp > 0) {
            if (exp % 2 === 1) {
                result = (result * base) % mod;
            }
            exp = Math.floor(exp / 2);
            base = (base * base) % mod;
        }
        return result;
    }
});
