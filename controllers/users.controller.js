const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const { generateJwt } = require('../helpers/generateJwt');
const UsersService = require('../services/users.service');

class UserController {
    async register(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { firstName, email, password } = req.body;
            const candidate = await UsersService.getUserByEmail({ email });
            if (candidate) {
                return res
                    .status(404)
                    .json({ message: 'Пользователь с таким email существует' });
            }
            const hashPassword = await bcrypt.hash(password, 5);
            const user = await UsersService.createUser({
                firstName,
                email,
                password: hashPassword,
            });
            const token = generateJwt(user.id, user.email);
            res.json({ token, userId: user.id });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;
            const candidate = await UsersService.getUserByEmail({ email });
            if (!candidate) {
                return res
                    .status(404)
                    .json({ message: 'Пользователь не зарегистрирован' });
            }
            if (!(await bcrypt.compare(password, candidate.password))) {
                return res.status(401).json({ message: 'Invalid password' });
            }
            const token = generateJwt(candidate.id, candidate.email);
            res.json({ token, userId: candidate.id });
        } catch (error) {
            next(error);
        }
    }

    async editProfile(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;

            // Проверка, существует ли пользователь с указанным id
            const candidate = await UsersService.getUserById(id);
            if (!candidate) {
                return res
                    .status(404)
                    .json({ message: 'Пользователь с id не найден' });
            }

            const { firstName, lastName, email, gender } = req.body;

            const filename = req.file ? req.file.filename : req.body.photo;

            // Проверка уникальности нового email, если он был предоставлен
            const emailExists = await UsersService.getUserByEmail({ email });
            if (emailExists) {
                return res
                    .status(404)
                    .json({ message: 'Email already exists' });
            }

            const updateUser = await UsersService.editProfile(
                { candidate },
                {
                    firstName,
                    lastName,
                    email,
                    gender,
                },
                { filename }
            );
            res.json({
                message: 'Profile updated successfully',
                user: updateUser,
            });
        } catch (error) {
            next(error);
        }
    }

    async getUserProfile(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;
            const candidate = await UsersService.getUserById(id);
            if (!candidate) {
                return res
                    .status(404)
                    .json({ message: 'Пользователь с id не найден' });
            }
            return res.json(candidate);
        } catch (error) {
            next(error);
        }
    }

    async getAllUsers(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { page = 1, perPage = 10 } = req.query;
            const offset = (page - 1) * perPage;
            const users = await UsersService.getAllUser({ offset, perPage });

            res.json({
                total: users.count,
                totalPages: Math.ceil(users.count / perPage),
                currentPage: page,
                users: users.rows,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
