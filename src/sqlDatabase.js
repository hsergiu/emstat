const sql = require("sqlite");

module.exports = class SQLiteDatabase {
    constructor() {
        this.sql = sql;
    }

    async load() {
        await this.sql.open("./data/stats.sqlite");
        await this.sql.migrate();
    }

    async getSetting(settingName) {
        let row = await this.sql.get(`SELECT value FROM Setting WHERE setting ="${settingName}"`);
        if (!row) {
            throw "ERROR: setting " + settingName + " does not exist";
        } else {
            return row.value;
        }
    }
    
    async setSetting(settingName, value) {
        await this.sql.run(`INSERT OR REPLACE INTO Setting (setting, value) VALUES ("${settingName}", "${value}");`);
    }

    async clear() {
        await this.sql.run(`DELETE FROM Score`);
    }

    async getScore() {
        emoji = emoji.trim();
        row = await this.sql.all(`SELECT * FROM Score WHERE emoji = "${emoji}" ORDER BY points DESC`);
        if (!row) {
            throw "ERROR: Missing row for " + emoji;
        } else {
            return row;
        }
    }

    async addToScore() {
        emoji = emoji.trim();
        row = await this.sql.get(`SELECT * FROM Score WHERE emoji = "${emoji}" and userId ="${user.id}"`);

        if (!row) {
            await this.sql.run(
                `INSERT INTO Score (emoji, userId, username, points) VALUES
                ("${emoji}", "${user.id}", "${user.username}", "${addition}")`);
            console.log("Added " + user.username + " (" + user.id + ") to " + emoji + " stats");
        }
        else {
            let newScore = row.points + addition;
            await this.sql.run(`UPDATE Score SET points = ${newScore} WHERE emoji = "${emoji}" and userId ="${user.id}"`);
            console.log(user.username + " (" + user.id + ") just changed " + addition + " " + emoji + " to " + newScore);
        }
    }
}