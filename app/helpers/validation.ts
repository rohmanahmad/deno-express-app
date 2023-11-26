class Validation {
    #required = false
    #errors = []

    constructor() {
        this.#required = false
        this.#errors = []
    }

    validate(): void {
    }

    error(): void {
    }

    isRequired(): void {
        this.#required = true
    }

    isInteger(test: string | number): boolean {
        try {
            return false
        } catch (err) {
            throw err
        }
    }
}

export default Validation
