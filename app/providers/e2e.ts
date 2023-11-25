// this code using tweetnacl repo
// reference https://github.com/dchest/tweetnacl-js/wiki/Examples

import nacl from 'tweetnacl/nacl-fast'
import naclUtil from 'tweetnacl-util'

type Config = {
    mode: string
}

const { secretbox, box, randomBytes } = nacl

const {
    decodeUTF8,
    encodeUTF8,
    encodeBase64,
    decodeBase64,
} = naclUtil

class E2E {
    #config: Config

    constructor(config: Config) {
        this.#config = config
    }

    async boot(): Promise<typeof this> {
        return this
    }

    async close() {
        // nothing to close
    }

    getNewNonce() {
        return randomBytes(secretbox.nonceLength)
    }

    generateKeyPair(mode: string): string {
        if (mode) this.#config.mode = mode.trim()
        if (this.#config.mode === 'symmetric') {
            return encodeBase64(randomBytes(secretbox.keyLength))
        } else {
            return box.keyPair()
        }
    }

    encrypt(
        sharedKey: string,
        data: string,
        key: string,
        customMode: string,
    ): string {
        if (customMode) this.#config.mode = customMode
        if (this.#config.mode === 'symmetric') {
            return this.symmetricEncrypt(key, data)
        } else {
            return this.asymmetricEncrypt(sharedKey, data, key)
        }
    }
    decrypt(
        sharedKey: string,
        strMessage: string,
        key: string,
        customMode: string,
    ): string {
        if (customMode) this.#config.mode = customMode
        if (this.#config.mode === 'symmetric') {
            return this.symmetricDecrypt(key, strMessage)
        } else {
            return this.asymmetricDecrypt(sharedKey, strMessage, key)
        }
    }

    // SYMMETRIC
    symmetricEncrypt(key: string, data: string): string {
        try {
            const keyUint8Array = decodeBase64(key)
            const nonce = this.getNewNonce()
            const messageUint8 = decodeUTF8(JSON.stringify(data))
            const mybox = secretbox(messageUint8, nonce, keyUint8Array)

            const fullMessage = new Uint8Array(nonce.length + mybox.length)
            fullMessage.set(nonce)
            fullMessage.set(mybox, nonce.length)

            const base64FullMessage = encodeBase64(fullMessage)
            return base64FullMessage
        } catch (err) {
            throw err
        }
    }
    symmetricDecrypt(key: string, messageWithNonce: string): string {
        try {
            const keyUint8Array = decodeBase64(key)
            const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce)
            const nonce = messageWithNonceAsUint8Array.slice(
                0,
                secretbox.nonceLength,
            )
            const message = messageWithNonceAsUint8Array.slice(
                secretbox.nonceLength,
                messageWithNonce.length,
            )

            const decrypted = secretbox.open(message, nonce, keyUint8Array)

            if (!decrypted) throw new Error('Could not decrypt message')

            const base64DecryptedMessage = encodeUTF8(decrypted)
            return JSON.parse(base64DecryptedMessage)
        } catch (err) {
            throw err
        }
    }

    // ASYMMETRIC
    asymmetricEncrypt(sharedKey: string, data: string, key: string): string {
        try {
            const nonce = this.getNewNonce()
            const messageUint8 = decodeUTF8(JSON.stringify(data))
            const encrypted = key
                ? box(messageUint8, nonce, key, sharedKey)
                : box.after(messageUint8, nonce, sharedKey)
            const fullMessage = new Uint8Array(nonce.length + encrypted.length)
            fullMessage.set(nonce)
            fullMessage.set(encrypted, nonce.length)

            const base64FullMessage = encodeBase64(fullMessage)
            return base64FullMessage
        } catch (err) {
            throw err
        }
    }
    asymmetricDecrypt(
        sharedKey: string,
        strMessage: string,
        key: string,
    ): string { // strMessage is String
        try {
            const messageWithNonceAsUint8Array = decodeBase64(strMessage)
            const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength)
            const message = messageWithNonceAsUint8Array.slice(
                box.nonceLength,
                strMessage.length,
            )
            const decrypted = key
                ? box.open(message, nonce, key, sharedKey)
                : box.open.after(message, nonce, sharedKey)
            if (!decrypted) throw new Error('Could not Decrypt message')
            const base64DecryptedMessage = encodeUTF8(decrypted)
            return JSON.parse(base64DecryptedMessage)
        } catch (err) {
            throw err
        }
    }
}

export default E2E
