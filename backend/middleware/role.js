const sequelize = require('../config/database');

// const checkRole = (roles) => {
//   return async (req, res, next) => {
//     try {
//       const [userRoles] = await sequelize.query(`
//         SELECT r.role_name FROM user_roles ur
//         JOIN roles r ON ur.role_id = r.role_id
//         WHERE ur.user_id = ?
//       `, { replacements: [Number(req.user.userId)] });

//       const roleNames = userRoles.map(r => r.role_name);
//       console.log("Текущая роль:",roleNames, "при текущем id")
//       const hasRole = roles.some(role => roleNames.includes(role));

//       if (!hasRole) {
//         return res.status(403).json({ 
//           error: `Доступ запрещён. Требуется роль: ${roles.join(', ')}` 
//         });
//       }

//       next();
//     } catch (err) {
//       console.error('Ошибка проверки роли:', err);
//       res.status(500).json({ error: 'Ошибка сервера при проверке роли' });
//     }
//   };
// };

const checkRole = (roles)=>{
  return async (req,res,next)=>{
    next()
  }
}

module.exports = checkRole;