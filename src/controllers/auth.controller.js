import { registerValidation, loginValidation } from "../validations/user.validation.js";
import { registerService, loginService } from "../services/auth.service.js";
import { MSG } from "../constants/messages.js";

export const registerUser = async (req, res) => {
  try {
    const { email, isEmailVerified } = req.body;

    if (!isEmailVerified)
      return res.status(400).json({ message: "Please verify your email first" });

    const { error } = registerValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const result = await registerService(req.body);
    res.status(result.success ? 201 : 400).json(result);

  } catch (err) {
    res.status(500).json({ message: MSG.ERROR.SERVER_ERROR });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { error } = loginValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { email, password } = req.body;

    const result = await loginService(email, password);
    res.status(result.success ? 200 : 400).json(result);

  } catch (err) {
    res.status(500).json({ message: MSG.ERROR.SERVER_ERROR });
  }
};
