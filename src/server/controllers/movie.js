const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const jwtSecret = "mysecret";

const getAllMovies = async (req, res) => {
  const movies = await prisma.movie.findMany();

  res.json({ data: movies });
};

const createMovie = async (req, res) => {
  const { title, description, runtimeMins } = req.body;

  try {
    // Get the token from the authorization header of the request.
    const [bearer, token] = req.headers.authorization.split(" ");
    console.log("Token:", token);
    // Use console logs to inspect the req object to figure out how to find this.
    // Use the jsonwebtoken library to verify that the token is valid.

    let payload = jwt.verify(token, jwtSecret);

    console.log(`token payload = ${JSON.stringify(payload)}`);
    console.log(`About to create movie ${title}`);

    const createdMovie = await prisma.movie.create({
      data: {
        title,
        description,
        runtimeMins,
      },
    });

    res.json({ data: createdMovie });
  } catch (e) {
    return res.status(401).json({ error: "Invalid token provided." });
  }
};

module.exports = {
  getAllMovies,
  createMovie,
};
