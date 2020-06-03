const Joi = require('joi')

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema)
            if (result.error) {
                return res.status(400).json(result.error)
            }
            if (!req.value) { req.value = {} }
            req.value['body'] = result.value;
            next()
        }
    },
    schemas: {
        authSchema: Joi.object().keys({
            firstname: Joi.string().alphanum().required(),
            lastname: Joi.string().alphanum().required(),
            username: Joi.string().alphanum().min(3).max(15).required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            source: Joi.string().required()
        }),
        signInSchema: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        })
    }
}