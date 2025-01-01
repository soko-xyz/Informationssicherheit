export class ExtendedEuclideanService {
    static calculateSteps(a, b) {
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

    static calculateModularInverseWithSteps(a, b) {
        let steps, result = [];

        try {
            steps = this.calculateSteps(a, b);
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
}
