import bcrypt from "bcryptjs";

const hashPassword = async(plainPassword: string) => {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    return hashedPassword;
}

export { hashPassword }
