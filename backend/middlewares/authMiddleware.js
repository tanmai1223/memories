import jwt from "jsonwebtoken";

// Middleware to authenticate user
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.Authorization || req.headers.authorization;

  if (!authHeader || !authHeader.startsWith(`Bearer `)) {
    return res
      .status(401)
      .json({ message: "No Token Provided", success: false });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("JWT Verification Error: ", error.message);
    return res.status(401).json({ message: "Invalid Token", success: false });
  }
};

// Middleware to authorize admin users only
export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  //console.log(req.user.role)
  next();
};
