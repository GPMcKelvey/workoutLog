const Express = require('express');
const router = Express.Router();
const validateJWT = require("../middleware/validate-jwt");

const { LogModel } = require("../models");
const { UserModel } = require("../models");


/*
    ===========
    Create Log
    ===========
*/

router.post('/create', validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const { id } = req.user;
    const logEntry = {
        description,
        definition,
        result,
        owner: id
    }
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({ error: err });
    }
    // LogModel.create(logEntry);

});

/*
    =======================
    Get All Logs for a User
    =======================
*/
router.get('/view', validateJWT, async (req, res) => {
    let { id } = req.user;
    try {
        const userLogs = await LogModel.findAll({
            where: {
                owner: id
            }
        });
        res.status(200).json(userLogs);
    } catch (err) {
        res.status(500).json({ error: console.log("There is an error here") });
    }
});

/*
    =================
    Get Log by Log ID
    =================
*/

router.get("/getlogs/:id", validateJWT, async (req, res) => {
    const { id } = req.params;
    try {
        const logResult = await LogModel.findOne({
            where: { id: id }
        });
        res.status(200).json(logResult);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
    ==================
    Update log by User
    ==================
*/

router.put("/updated/:id", validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const logId = req.params.id;
    const userId = req.user.id;

    const query = {
        where: {
            id: logId,
            owner: userId
        }
    };

    const updatedLog = {
        description: description,
        definition: definition,
        result: result
    };

    try {
        const update = await LogModel.update(updatedLog, query);
        res.status(200).json({ message: "Log Updated"});
        
        } catch (err) {
        res.status(500).json({ error: err });
    }
    
});

/*
    ===========
    Delete Log
    ===========
*/

router.delete("/delete/:id", validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const logId = req.params.id;

    try {
        const query = {
            where: {
                id: logId,
                owner: ownerId
            }
        };

        await LogModel.destroy(query);
        res.status(200).json({ message: "Log DESTROYED!" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});


module.exports = router;