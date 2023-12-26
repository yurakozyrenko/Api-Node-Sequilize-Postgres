const registerSchema = {
    firstName: {
        in: ['body'],
        notEmpty: true,
        errorMessage: 'Имя не может быть пустым',
    },
    email: {
        in: ['body'],
        isEmail: true,
        errorMessage: 'Введите корректный email',
    },
    password: {
        in: ['body'],
        isLength: {
            options: { min: 6 },
            errorMessage: 'Пароль должен содержать минимум 6 символов',
        },
    },
};

const loginSchema = {
    email: {
        in: ['body'],
        isEmail: true,
        errorMessage: 'Введите корректный email',
    },
    password: {
        in: ['body'],
        isLength: {
            options: { min: 6 },
            errorMessage: 'Пароль должен содержать минимум 6 символов',
        },
    },
};

const getUserSchema = {
    id: {
        in: ['params'],
        isInt: {
            errorMessage: 'ID должен быть целым числом',
        },
        custom: {
            options: (value) => {
                // Дополнительная проверка, что id является положительным числом
                return parseInt(value) > 0;
            },
            errorMessage: 'ID должен быть положительным числом',
        },
        toInt: true,
    },
};

const editProfileSchema = {
    id: {
        in: ['params'],
        isInt: {
            errorMessage: 'ID должен быть целым числом',
        },
        custom: {
            options: (value) => {
                // Дополнительная проверка, что id является положительным числом
                return parseInt(value) > 0;
            },
            errorMessage: 'ID должен быть положительным числом',
        },
        toInt: true,
    },
    firstName: {
        in: ['body'],
        optional: true,
        notEmpty: true,
        errorMessage: 'Имя не может быть пустым',
    },
    lastName: {
        in: ['body'],
        optional: true,
        notEmpty: true,
        errorMessage: 'Фамилия не может быть пустой',
    },
    email: {
        in: ['body'],
        optional: true,
        isEmail: true,
        errorMessage: 'Введите корректный email',
    },
    gender: {
        in: ['body'],
        optional: true,
        isIn: {
            options: [['male', 'female']],
            errorMessage: 'Некорректное значение для пола',
        },
    },
};

module.exports = {
    registerSchema,
    loginSchema,
    getUserSchema,
    editProfileSchema,
};
