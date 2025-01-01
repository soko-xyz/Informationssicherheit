package cc.sokolowski.informationssicherheit.rsa

import org.springframework.web.bind.annotation.*
import java.math.BigInteger
import java.security.SecureRandom

@RestController
@RequestMapping("/rsa")
class RsaController(
    private val rsaService: RsaService,
    private val extendedEuclideanService: ExtendedEuclideanService
) {
    private val random = SecureRandom()

    @GetMapping("/generate-primes")
    fun generatePrimes(): Map<String, String> {
        val (p, q, explanation) = rsaService.generateTwoDifferentPrimesWithExplanation(random)
        return mapOf("p" to p.toString(), "q" to q.toString(), "explanation" to explanation)
    }

    @PostMapping("/phi")
    fun calculatePhi(@RequestParam p: BigInteger, @RequestParam q: BigInteger): Map<String, String> {
        val (phi, explanation) = rsaService.phiWithExplanation(p, q)
        return mapOf("phi" to phi.toString(), "explanation" to explanation)
    }

    @PostMapping("/n")
    fun calculateN(@RequestParam p: BigInteger, @RequestParam q: BigInteger): Map<String, String> {
        val n = p * q
        val explanation = "n = p * q = $p * $q = $n"
        return mapOf("n" to n.toString(), "explanation" to explanation)
    }

    @PostMapping("/select-e")
    fun selectE(@RequestParam phi: BigInteger): Map<String, String> {
        val (e, steps) = rsaService.selectE(phi)
        return mapOf("e" to e.toString(), "steps" to steps)
    }

    @PostMapping("/select-d")
    fun calculateModInverse(@RequestParam e: BigInteger, @RequestParam phi: BigInteger): Map<String, String> {
        val (d, explanation) = extendedEuclideanService.calculateModularInverseWithSteps(e, phi)
        return mapOf("d" to d.toString(), "explanation" to explanation)
    }

    @PostMapping("/encrypt")
    fun encrypt(@RequestParam m: BigInteger, @RequestParam e: BigInteger, @RequestParam n: BigInteger): Map<String, String> {
        val (c, explanation) = rsaService.encryptWithExplanation(m, e, n)
        return mapOf("c" to c.toString(), "explanation" to explanation)
    }

    @PostMapping("/decrypt")
    fun decrypt(@RequestParam c: BigInteger, @RequestParam d: BigInteger, @RequestParam n: BigInteger): Map<String, String> {
        val (m, explanation) = rsaService.decryptWithExplanation(c, d, n)
        return mapOf("m" to m.toString(), "explanation" to explanation)
    }
}
