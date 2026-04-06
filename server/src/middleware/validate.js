import { ApiError } from "../utils/apiError.js";

export const validate = (schema, property = "body") => (req, _res, next) => {
  const { error, value } = schema.validate(req[property], {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return next(
      new ApiError(
        400,
        "Validation failed",
        error.details.map((item) => item.message),
      ),
    );
  }

  req[property] = value;
  next();
};
