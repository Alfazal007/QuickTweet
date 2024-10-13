import bcrypt from "bcryptjs";

const hashPassword = async(plainPassword: string) => {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    return hashedPassword;
}

const isPasswordCorrect = async(plainPassword: string, hashedPassword: string): Promise<boolean> => {
    const isVerified = await bcrypt.compare(plainPassword, hashedPassword);
    return isVerified;
}


export { hashPassword, isPasswordCorrect }
