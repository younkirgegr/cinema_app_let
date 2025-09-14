const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const authMiddleware = require("../middleware/auth")

router.get("/me",authMiddleware, async (req,res)=>{
    const result = await sequelize.query(`
        SELECT last_name,first_name,role_id 
        FROM users
        WHERE user_id = ?
        `,{replacements: [req.user.userId]})
    
    if (!result) return res.status(404).json({error: "Такого пользователя не существует!"})
    
    const user = result[0][0]    
    
    return res.status(200).send({
        name: `${user.first_name} ${user.last_name}`,
        role_id: user.role_id
    })
})

module.exports = router;