const Type = require("../models/Types")

exports.TypeController = {
    async create(req, res)
    {
        const type = await Type.create({
            title: req?.body?.title,
            description: req?.body?.description
        })

        res.send({
            msg: 'Type added.',
            result: type
        })
    },

    async update(req, res)
    {

        const body = objectCleaner(req.body)

        const team = await Team.update(body, {where: {
            id: req.params.id
        }})

        res.send({message: "Team info updated successfully"})
    },


    async delete(req, res)
    {
        const team = await Team.destroy({
            where: {
                id: req.params.id
            }
        })

        res.send({message: "Team deleted successfully"})
    },

    async getTeam(req, res)
    {
        const team = Team.findByPk(req.params.id)
        res.send(team)
    }
}