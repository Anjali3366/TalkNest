export const signup = async (req, res) => {
  res.status(201).json({ data: "You are hitting signup endpoint" });
};

export const login = async (req, res) => {
  res.status(201).json({ data: "You are hitting login endpoint" });
};

export const logout = async (req, res) => {
  res.status(201).json({ data: "You are hitting logout endpoint" });
};
