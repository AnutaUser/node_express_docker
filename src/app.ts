import express from 'express';

// import {reader, writer} from './file.service';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get('/users', async (req: Request, res: Response, next: NextFunction): Promise<Response<any[]>> => {
//     try {
//         const users = await reader();
//         return res.json(users);
//     } catch (e) {
//         next(e);
//     }
//
// });

// app.get('/users/:userId', async (req: Request, res: Response) => {
//     const {userId} = req.params;
//
//     const users = await reader();
//     const userById = users.find(user => (user.userId === +userId));
//
//     if (!userById) {
//         return res.status(422).json(`User with id: ${userId} not found`);
//     }
//
//     res.json(userById);
// });

// app.post('/users', async (req: Request, res: Response) => {
//     const users = await reader();
//
//     const {name, age, gender} = req.body
//
//     if (!name || name.length < 3) {
//         return res.status(400).json('Wrong name');
//     }
//     if (!age || age < 16 || age > 100) {
//         return res.status(400).json('Wrong age');
//     }
//
//     const newUser = {userId: users.length ? users[users.length - 1].userId + 1 : 1, ...req.body}
//     users.push(newUser);
//
//     await writer(users);
//
//     res.status(201).json('User created successful');
// });

// app.put('/users/:userId', async (req: Request, res: Response) => {
//     const {userId} = req.params;
//     const updateUser = req.body;
//
//     const users = await reader();
//     const userById = users.find(user => user.userId === +userId);
//
//     if (!userById) {
//         return res.status(400).json(`User with ${userId} not exist`);
//     }
//
//     if (updateUser.name) userById.name = updateUser.name;
//     if (updateUser.age) userById.age = updateUser.age;
//     if (updateUser.gender) userById.gender = updateUser.gender;
//     if (updateUser.status) userById.status = updateUser.status;
//
//     await writer(users);
//
//     res.status(200).json({
//         message: 'User update',
//         data: updateUser
//     })
// });

// app.delete('/users/:userId', async (req: Request, res: Response) => {
//     const {userId} = req.params;
//     console.log(userId)
//     const users = await reader();
//     const index = users.findIndex(user => user.userId === +userId);
//     console.log(index)
//     if (index === -1) {
//         return res.status(422).json(`User not found`);
//     }
//
//     users.splice(index, 1);
//
//     await writer(users);
//
//     res.sendStatus(204);
// });

const PORT = 4444;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`work on port: ${PORT} 😎️`);
});
