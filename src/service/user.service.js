const bcrypt = require("bcrypt");
const userRepository = require("../repository/user.repository")

const SALT_ROUNDS = 10;

class UserService {
  async createUser({ name, email, password }) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    }

    return userRepository.create({
      name,
      email,
      password: hashedPassword,
    });
  }
}

module.exports = new UserService();
