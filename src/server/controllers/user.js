const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const jwtSecret = "mysecret";

const register = async (req, res) => {
  const { username, password } = req.body;

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const createdUser = await prisma.user.create({
      data: {
        username,
        password: passwordHash,
      },
    });

    res.json({ data: createdUser });
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const foundUser = await prisma.user.findFirst({
    where: { username },
  });

  if (!foundUser) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const passwordsMatch = await bcrypt.compare(password, foundUser.password);

  if (!passwordsMatch) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const token = jwt.sign({ username }, jwtSecret);

  res.json({ token });
};

module.exports = {
  register,
  login,
};
