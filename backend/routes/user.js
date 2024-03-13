
const express = require("express")
const router = express.Router()
const zod = require("zod")
const { User } = require("../db")
const jwt = require("jsonwebtoken")
const JWT_SECRET = require("../config")
const  { authMiddleware } = require("../middleware");

const signupSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})

router.post("/signup", async (res, req) => {
    const body = req.body
    const {success} = signupSchema.safeParse(req.body)
    if (!success) {
        return res.json({
            message: "Email already taken / Invalid Inputs"
        })
    }

    const user = User.findOne({
        username: body.username
    })
    
    if (user._id){
        return res.json({
            message: "Email already taken / Invalid Inputs"
        })
    }

    const dbUser = await User.create(body)
    const jwt = jwt.sign({
        userId: dbUser._id
    }, JWT_SECRET)

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    res.json({
        message: "User created successfully",
        token: token
    })
})


router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
})


router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
})


router.get("/search", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;