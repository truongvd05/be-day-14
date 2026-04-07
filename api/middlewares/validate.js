const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        const errors = {};
        result.error.errors.forEach((err) => {
            const field = err.path[0];
            if (!errors[field]) errors[field] = [];
            errors[field].push(err.message);
        });
        return res.status(422).json({ errors });
    }

    req.body = result.data;
    next();
};

module.exports = validate;
