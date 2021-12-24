const fs = require('fs');
module.exports = {
    //---------------------------------------------------------------------
    // Action Name
    //
    // This is the name of the action displayed in the editor.
    //---------------------------------------------------------------------

    name: "Create Warn Database",

    //---------------------------------------------------------------------
    // Action Section
    //
    // This is the section the action will fall into.
    //---------------------------------------------------------------------

    section: "Warn Management",

    //---------------------------------------------------------------------
    // Action Subtitle
    //
    // This function generates the subtitle displayed next to the name.
    //---------------------------------------------------------------------

    subtitle(data, presets) {
        return data?.dbName ? `${data.dbName}` : 'Set a warn database name!';
    },

    //---------------------------------------------------------------------
    // Action Storage Function
    //
    // Stores the relevant variable info for the editor.
    //---------------------------------------------------------------------

    variableStorage(data, varType) {
        return [data.varName, 'Warn Database'];
    },

    //---------------------------------------------------------------------
    // Action Meta Data
    //
    // Helps check for updates and provides info if a custom mod.
    // If this is a third-party mod, please set "author" and "authorUrl".
    //
    // It's highly recommended "preciseCheck" is set to false for third-party mods.
    // This will make it so the patch version (0.0.X) is not checked.
    //---------------------------------------------------------------------

    meta: { version: "2.0.9", preciseCheck: true, author: null, authorUrl: null, downloadUrl: null },

    //---------------------------------------------------------------------
    // Action Fields
    //
    // These are the fields for the action. These fields are customized
    // by creating elements with corresponding IDs in the HTML. These
    // are also the names of the fields stored in the action's JSON data.
    //---------------------------------------------------------------------

    fields: ["storage", "varName", "dbName"],

    //---------------------------------------------------------------------
    // Command HTML
    //
    // This function returns a string containing the HTML used for
    // editing actions.
    //
    // The "isEvent" parameter will be true if this action is being used
    // for an event. Due to their nature, events lack certain information,
    // so edit the HTML to reflect this.
    //---------------------------------------------------------------------

    html(isEvent, data) {
        return `
<div style="padding-top: 8px;">
    <p>DBM warn system made by Finbar#0001<br> 
    <a href="#" onclick="require('child_process').execSync('start https://github.com/OneAndonlyFinbar/DBM-Warn-System')">Github</a><br>
    <a href="#" onclick="require('child_process').execSync('start https://ko-fi.com/thefinbar')">Support me</a></p>
    <span>File Name</span>
	<input id="dbName" class="round" type="text" placeholder="Some guild id?">
</div>
<br>
<store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName"></store-in-variable>`;
    },

    //---------------------------------------------------------------------
    // Action Editor Init Code
    //
    // When the HTML is first applied to the action editor, this code
    // is also run. This helps add modifications or setup reactionary
    // functions for the DOM elements.
    //---------------------------------------------------------------------

    init() {},

    //---------------------------------------------------------------------
    // Action Bot Function
    //
    // This is the function for the action within the Bot's Action class.
    // Keep in mind event calls won't have access to the "msg" parameter,
    // so be sure to provide checks for variable existence.
    //---------------------------------------------------------------------

    async action(cache) {
        const data = cache.actions[cache.index];
        const memberStorage = parseInt(data.member, 10);
        const varName = this.evalMessage(data.varName, cache);
        const info = parseInt(data.info, 10);

        const databaseName = this.evalMessage(data.dbName, cache);

        try{
            require('json-simplified');
        }catch{
            console.log('WarnManagerError: Required packages not installed, run npm i json-simplified');
            return this.callNextAction(cache);
        }

        if(!data.dbName) {
            console.error('WarnManagerError: No database name specified');
            return this.callNextAction(cache);
        }

        const { Database } = require('json-simplified');
        const fs = require('fs');

        if(!fs.existsSync('./warns')) fs.mkdirSync('./warns');

        const db = new Database(databaseName, {registry: './warns'});

        if (db) {
            const storage = parseInt(data.storage, 10);
            this.storeValue(db.name, storage, varName, cache);
        }
        this.callNextAction(cache);
    },

    //---------------------------------------------------------------------
    // Action Bot Mod
    //
    // Upon initialization of the bot, this code is run. Using the bot's
    // DBM namespace, one can add/modify existing functions if necessary.
    // In order to reduce conflicts between mods, be sure to alias
    // functions you wish to overwrite.
    //---------------------------------------------------------------------

    mod() {},
};
