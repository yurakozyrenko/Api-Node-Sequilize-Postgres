const { User } = require('../models/User');
const fs = require('fs/promises');
const path = require('path');

class UsersService {
    // Получить пользователя
    async getAllUser({ perPage, offset }) {
        const users = await User.findAndCountAll({
            limit: perPage,
            offset,
            order: [['registrationDate', 'DESC']],
        });

        return users;
    }

    // Получить пользователя по email
    async getUserByEmail({ email }) {
        const user = await User.findOne({ where: { email } });
        return user;
    }

    // Получить пользователя по id
    async getUserById(id) {
        const user = await User.findOne({ where: { id } });
        return user;
    }

    // Создать пользователя
    async createUser({ firstName, email, password: hashPassword }) {
        const user = await User.create({
            firstName,
            email,
            password: hashPassword,
        });
        return user;
    }

    async editProfile(
        { candidate },
        { firstName, lastName, email, gender },
        { filename }
    ) {
        // Обновление данных пользователя, только если они предоставлены
        candidate.firstName =
            firstName !== '' ? firstName : candidate.firstName;
        candidate.lastName = lastName !== '' ? lastName : candidate.lastName;
        candidate.email = email !== '' ? email : candidate.email;
        candidate.gender = gender !== '' ? gender : candidate.gender;

        // // Обновление фотографии, если предоставлена новая
        if (filename) {
            // Удаление предыдущей фотографии, если она существует
            if (candidate.photo) {
                const photoFolderPath = path.join(__dirname, '../static');
                const oldPhotoPath = path.join(
                    photoFolderPath,
                    candidate.photo
                );
                await fs.unlink(oldPhotoPath);
            }
            const newPhotoFilename = filename;
            candidate.photo = newPhotoFilename;
        }

        await candidate.save();
        return candidate;
    }
}
module.exports = new UsersService();
