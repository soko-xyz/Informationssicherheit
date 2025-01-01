export class RsaService {
    static generateTwoDifferentPrimesWithExplanation() {
        let p, q;
        do {
            p = this.generateTwoDigitPrime();
            q = this.generateTwoDigitPrime();
        } while (p === q || !this.hasValidE(this.phiWithExplanation(BigInt(p), BigInt(q)).phi));

        return { p, q };
    }

    static generateTwoDigitPrime() {
        let prime;
        do {
            prime = Math.floor(Math.random() * (99 - 10 + 1)) + 10;
        } while (!this.isProbablePrime(prime));
        return prime;
    }

    static isProbablePrime(num) {
        if (num <= 1) return false;
        if (num <= 3) return true;
        if (num % 2 === 0 || num % 3 === 0) return false;

        for (let i = 5; i * i <= num; i += 6) {
            if (num % i === 0 || num % (i + 2) === 0) return false;
        }
        return true;
    }

    static phiWithExplanation(p, q) {
        const phi = (p - 1n) * (q - 1n);
        const explanation = `phi(n) = (p - 1) * (q - 1) = (${p} - 1) * (${q} - 1) = ${phi}`;
        return { phi, explanation };
    }

    static hasValidE(phi) {
        for (let e = 3n; e <= 5n; e++) {
            if (this.gcd(e, phi) === 1n) {
                return true;
            }
        }
        return false;
    }

    static selectEWithExplanation(phi) {
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

    static gcd(a, b) {
        while (b !== 0n) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    static encryptWithExplanation(m, e, n) {
        const c = this.modPow(m, e, n);
        const explanation = `Verschlüsselung: c = m^e mod n = ${m}^${e} mod ${n} = ${c}`;
        return { c, explanation };
    }

    static decryptWithExplanation(c, d, n) {
        const m = this.modPow(c, d, n);
        const explanation = `Entschlüsselung: m = c^d mod n = ${c}^${d} mod ${n} = ${m}`;
        return { m, explanation };
    }

    static modPow(base, exp, mod) {
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
}
