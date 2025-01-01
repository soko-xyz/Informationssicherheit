package cc.sokolowski.informationssicherheit.rsa

import java.math.BigInteger
import java.security.SecureRandom
import org.springframework.stereotype.Service

@Service
class RsaService {

    fun generateTwoDifferentPrimesWithExplanation(random: SecureRandom): Triple<BigInteger, BigInteger, String> {
        var p: BigInteger
        var q: BigInteger
        val explanation = StringBuilder("Generierung zufälliger Primzahlen:\n")

        do {
            p = generateTwoDigitPrime(random)
            q = generateTwoDigitPrime(random)
        } while (p == q || !hasValidE(phiWithExplanation(p, q).first))

        explanation.append("p = $p\nq = $q")

        return Triple(p, q, explanation.toString())
    }

    private fun generateTwoDigitPrime(random: SecureRandom): BigInteger {
        var prime: BigInteger
        do {
            prime = BigInteger.valueOf(10 + random.nextInt(90).toLong()) // Bereich 10-99
        } while (!prime.isProbablePrime(100))
        return prime
    }

    private fun hasValidE(phi: BigInteger): Boolean {
        for (e in 3..5) {
            if (phi.gcd(BigInteger.valueOf(e.toLong())) == BigInteger.ONE) {
                return true
            }
        }
        return false
    }

    fun phiWithExplanation(p: BigInteger, q: BigInteger): Pair<BigInteger, String> {
        val phi = (p - BigInteger.ONE) * (q - BigInteger.ONE)
        val explanation = "phi(n) = (p - 1) * (q - 1) = ($p - 1) * ($q - 1) = ${p - BigInteger.ONE} * ${q - BigInteger.ONE} = $phi"
        return Pair(phi, explanation)
    }

    fun selectE(phi: BigInteger): Pair<BigInteger, String> {
        val steps = StringBuilder("Schritte zur Auswahl von e:\n")

        val quersumme = phi.toString().map { it.toString().toInt() }.sum()
        if (quersumme % 3 != 0) {
            steps.append("e = 3 ist gültig, da die Quersumme von $phi = $quersumme nicht durch 3 teilbar ist.\n")
            return Pair(BigInteger.valueOf(3), steps.toString())
        } else {
            steps.append("e = 3 ist nicht gültig, da die Quersumme von $phi = $quersumme durch 3 teilbar ist.\n")
        }

        val lastTwoDigits = phi.mod(BigInteger.valueOf(100))
        if (lastTwoDigits % BigInteger.valueOf(4) != BigInteger.ZERO) {
            steps.append("e = 4 ist gültig, da $lastTwoDigits nicht durch 4 teilbar ist.\n")
            return Pair(BigInteger.valueOf(4), steps.toString())
        } else {
            steps.append("e = 4 ist nicht gültig, da $lastTwoDigits durch 4 teilbar ist.\n")
        }

        val lastDigit = phi.mod(BigInteger.TEN)
        if (lastDigit != BigInteger.valueOf(5) && lastDigit != BigInteger.ZERO) {
            steps.append("e = 5 ist gültig, da die letzte Stelle von $phi = $lastDigit nicht 5 oder 0 ist.\n")
            return Pair(BigInteger.valueOf(5), steps.toString())
        } else {
            steps.append("e = 5 ist nicht gültig, da die letzte Stelle von $phi = $lastDigit 5 oder 0 ist.\n")
        }

        return Pair(BigInteger.ZERO, steps.append("Kein gültiges e gefunden!\n").toString())
    }

    fun encryptWithExplanation(m: BigInteger, e: BigInteger, n: BigInteger): Pair<BigInteger, String> {
        val c = m.modPow(e, n)
        val explanation = "Verschlüsselung: c = m^e mod n = $m^$e mod $n = $c"
        return Pair(c, explanation)
    }

    fun decryptWithExplanation(c: BigInteger, d: BigInteger, n: BigInteger): Pair<BigInteger, String> {
        val m = c.modPow(d, n)
        val explanation = "Entschlüsselung: m = c^d mod n = $c^$d mod $n = $m"
        return Pair(m, explanation)
    }
}
