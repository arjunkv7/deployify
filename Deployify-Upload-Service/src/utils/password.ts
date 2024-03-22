import bcrypt from "bcrypt";

class Passowrd {
    constructor() {}

    async hash(password: string): Promise<string>{
        return await bcrypt.hash(password, 10);
    }

    async compare(text: string, hash: string): Promise<Boolean> {
        return await bcrypt.compare(text, hash)
    }
}

export default new Passowrd();