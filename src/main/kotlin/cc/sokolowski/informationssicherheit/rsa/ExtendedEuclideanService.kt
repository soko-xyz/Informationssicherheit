package cc.sokolowski.informationssicherheit.rsa

import java.math.BigInteger
import org.springframework.stereotype.Service

@Service
class ExtendedEuclideanService {

    data class EuklidischerAlgorithmus(
        val a: BigInteger,
        val b: BigInteger,
        val quotient: BigInteger,
        val remainder: BigInteger
    ) {
        override fun toString(): String {
            return "$a : $b = $quotient Rest $remainder\tUmgestellt zu: $remainder = $a - $quotient * $b"
        }
    }

    fun calculateModularInverseWithSteps(a: BigInteger, b: BigInteger): Pair<BigInteger, String> {
        val result = StringBuilder()
        result.append("\nEuklidischer Algorithms:\n")
        val steps = calculateSteps(a, b)

        steps.forEach { result.append(it).append("\n") }

        result.append("\nErweiterter Euklidischer Algorithms (Rückwärts einsetzen):\n")

        // Starte mit der Gleichung, bei der der Rest = 1 ist
        val startIndex = steps.size - 2 // Die vorletzte Gleichung hat Rest 1
        var x = BigInteger.ZERO // Initialwert für x
        var y = BigInteger.ONE  // Initialwert für y

        for (i in startIndex downTo 0) {
            val step = steps[i]

            // Aktuelle Gleichung darstellen
            result.append("\n1 = $x * ${step.a} + $y * ${step.b}\n")

            // Rückwärts einsetzen
            val newX = y
            val newY = x - step.quotient * y

            // Umformung ausgeben
            result.append(" => Setze ${step.b} = ${step.a} - ${step.quotient} * ${step.b}\n")

            // Werte aktualisieren
            x = newX
            y = newY
        }

        result.append("\nEndgültige Linearkombination:\n")
        result.append("1 = $x * ${steps.first().a} + $y * ${steps.first().b}\n")

        // Berechne das modulare Inverse
        val modularInverse = if (x < BigInteger.ZERO) {
            result.append("\nDa $x < 0, addiere  $b\n")
            result.append("$x + $b = ${x + b}, ist das modulare Inverse\n")
            x + b
        } else {
            result.append("\nDa $x >= 0, ist $x das modulare Inverse\n")
            x
        }

        result.append("\nModulares Inverses: $modularInverse\n")

        return Pair(modularInverse, result.toString())
    }

    private fun calculateSteps(a: BigInteger, b: BigInteger): List<EuklidischerAlgorithmus> {
        val steps = mutableListOf<EuklidischerAlgorithmus>()
        var currentA = a
        var currentB = b

        while (currentB != BigInteger.ZERO) {
            val quotient = currentA.divide(currentB)
            val remainder = currentA.mod(currentB)
            steps.add(EuklidischerAlgorithmus(currentA, currentB, quotient, remainder))
            currentA = currentB
            currentB = remainder
        }

        return steps
    }
}
