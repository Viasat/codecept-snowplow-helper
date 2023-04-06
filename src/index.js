const Helper = require('@codeceptjs/helper')
const axios = require('axios')
const assert = require('assert')

class Snowplow extends Helper {
    constructor(config) {
        super(config)
        this.config.good = `${this.config.endpoint}/micro/good`
        this.config.bad = `${this.config.endpoint}/micro/bad`
        this.config.reset = `${this.config.endpoint}/micro/reset`
        this.config.all = `${this.config.endpoint}/micro/all`
    }

    async dontSeeBadEvents() {
        const response = await axios.get(this.config.bad)
        response.data.length === 0
            ? assert.ok(true)
            : assert.fail(`There are ${response.data.length} bad events`)
    }

    async seeGoodEvents(quantity) {
        const response = await axios.get(this.config.good)
        response.data.length === quantity
            ? assert.ok(true)
            : assert.fail(
                `There are ${response.data.length} good events, but ${quantity}`
            )
    }

    async seeTotalNumberOfEvents(quantity) {
        const response = await axios.get(this.config.all)
        response.data.total === quantity
            ? assert.ok(true)
            : assert.fail(`There are ${response.data.total} events, not ${quantity}`)
    }

    async resetAllEvents() {
        await axios.get(this.config.reset)
    }
}

module.exports = Snowplow
