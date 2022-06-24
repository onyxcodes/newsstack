import PouchDB from 'pouchdb-browser'
import Find from 'pouchdb-find'
import * as replicationStream from "pouchdb-replication-stream"
import logger from "../logger"
// import * as load from 'pouchdb-load';
import MemoryStream from "memorystream"
// PouchDB.plugin({
//     loadIt: load.load
// });
PouchDB.plugin(Find)
PouchDB.plugin(replicationStream.plugin)

PouchDB.adapter('writableStream', replicationStream.adapters.writableStream);
import Schema from "./Schema";

class DbManager {
    /**
     * 
     * @param {String} dbName 
     */
    constructor(dbName) {
        /**
         * @property {PouchDB.Database<{}>} db
         */
        if ( dbName ) this.db = new PouchDB(dbName)
        else throw new Error("Invalid database name", dbName)
        
    }

    /**
     * TODO: consider chaing name to "clear"
     * @description cleardb - that's what it does
     * @param {PouchDB.Database<{}>} db
     * @returns {Promise<boolean>}
     */
    async cleardb (db) {
        try {
            let res = await db.destroy();
            if ( res.ok ) return true;
            else throw new Error(res)
        } catch (e) {
            logger.error({"error": e}, "cleardb")
        }
        
    }

    // // /**
    //  * @type PouchDB.Database<{}>
    //  */
    // get db() {
    //     return this.db;
    // }

    /**
     * 
     * @param {Schema} schema 
     * @returns 
     */
    async addSchema( schema ) {
        let
            schemaName = schema.getName(),
            schemaType = schema.getType(),
            schemaModel = schema.getModel()
        ;
        // check if schema is already present
        let exists = await this.hasSchema( schemaName );

        if ( !exists ) {
            let res = await this.createNewDoc(schemaName, schemaType, schemaModel);
            console.log("Schema.addSchema - ", res);

        } else throw Error("Schema with name "+schemaName+" already exists within db");
    }

    // TODO: Check return type
    /**
     * 
     * @param {String} name 
     * @returns 
     */
    async getSchema( name ) {
        let db = this.db;
        try {
            /* Query the db to find the doc of class `class` and the
             * id of the class specified, and get its schema object
            **/
            let indexRes = await db.createIndex({
                index: {
                    fields: ['class', '_id']
                }
            })
            logger.debug({ "response": indexRes }, 'getSchema - Fetched search index');
            let findRes = await db.find({
                selector: { class: 'class', _id: name },
                fields: ['_id', 'schema'],
            })
            let schema = findRes.docs?.[0]?.schema
            logger.info({"schema": schema}, "getSchema - Returning schema obj")
            return schema
        } catch (e) {
            logger.error({"error": e }, "Got error while retrieving schema")
        }
    }

    /**
     * 
     * @param {String} name 
     * @returns {Promise<Boolean>}
     */
    async hasSchema( name ) {
        let schema = await this.getSchema(name);
        return !!schema;
    }

    /**
     * 
     * @param {String} schemaName 
     * @param {JSON} params 
     * @param {JSON} attrs 
     * @returns 
     */
    async createNewDoc(schemaName, params, attrs) {
        let res = await this.createDoc(null, schemaName, params, attrs);
        return res;
    }

    /**
     * @description prepareDoc
     * @param {String} _id 
     * @param {String} schemaName 
     * @param {JSON} params
     * @param {JSON} attrs
     * @returns {JSON}
     */
    prepareDoc (_id, className, params, attrs) {
        let doc = {};
        doc = Object.assign(doc, params);
        var defaults = { class: className, beginDate: new Date().toISOString() };
        if ( _id != null ) defaults = Object.assign(defaults, { _id: _id});
        doc = Object.assign(doc, defaults);
        attrs ? doc = Object.assign(doc, attrs) : null;
        logger.info({"doc": doc}, "prepareDoc - after elaborations");
        return doc;
    }

    async createDoc(docId, className, params, attrs) {
        let db = this.db;
        try {
            let doc = this.prepareDoc(docId, className, params, attrs);
            let response = await db.put(doc);
            logger.info({"response": response}, "createDoc - Response after put");
            if (response.ok) return response.id
            else throw new Error(response)
        } catch (e) {
            logger.error({"error": e}, "createDoc - Problem while putting doc")
        }
        // return new Promise((resolve, reject) => {
            // if (docId == null) {
            //     let doc = this.prepareDoc(null, className, params, attrs);
            //     // console.log("createDoc - newDoc:", newDoc)
            //     db.post(doc).then((response) => {
            //         (response.ok) ? resolve(response.id) : null// console.log("error")
            //     }).catch((err) => {
            //         // console.log(err)
            //         reject(err)
            //     })
            // } else {
            //     let doc = this.prepareDoc(docId, className, params, attrs);
            //     // console.log("createDoc - newDoc after additional params:", newDoc)
            //     db.put(doc).then((response) => {
            //         // console.log("createDoc - dbput response", response)
            //         response.ok ? resolve(response.id) : null// console.log("error")
            //     }).catch((err) => {
            //         // console.log(err)
            //         reject(err)
            //     })
            // }
        // })
    }

    
    ////////////////////////////////////////////////////

    // async checkdb(db) {
    //     return new Promise((resolve, reject) => {
    //         db.info().then((res) => {
    //             // console.log("checkdb - info", res)
    //             db.get("init").then(res => {
    //                 // console.log("checkdb - initialized", res)
    //                 res.init ? resolve(true) : resolve(false)
    //             }).catch((err) => {
    //                 resolve(false)
    //             })
    //         }).catch((err) => {
    //             reject(new Error("checkdb - something went wrong", err))
    //         })
    //     })
    // }

    // async initdb (db) {
    //     try {
    //         const res = await dbManage.checkdb(db)
    //         // console.log("initdb - res", res)
    //         if (!res) {
    //             // console.log("initdb - initializing db")
    //             let params_nb = {
    //                 description: "Notebook",
    //                 schema: [
    //                     {
    //                         type: "string",
    //                         valid: "^[a-zA-Z0-9_\\s]{0,50}$",
    //                         name: "name"
    //                     },
    //                     {
    //                         type: "array",
    //                         valid: "^[a-zA-Z0-9_\\s]{0,50}$",
    //                         name: "tags"
    //                     }
    //                 ]
    //             }
    //             dbManage.createDoc(db, "notebook", "class", params_nb)
    //             let params_note = {
    //                 description: "Note",
    //                 schema: [
    //                     {
    //                         type: "string",
    //                         valid: "^[a-zA-Z0-9_\\s]{0,50}$",
    //                         name: "name"
    //                     }
    //                 ]
    //             }
    //             dbManage.createDoc(db, configDatabase.NOTE_CLASS, "class", params_note)

    //             let domain_cardinality = new Array(2)
    //             domain_cardinality = ["1", "N"]
    //             let params_domain = {
    //                 description: "Notebook_Note",
    //                 cardinality: domain_cardinality,
    //                 schema: [
    //                     {
    //                         type: "class",
    //                         valid: "^[a-zA-Z0-9_\\s]{0,50}$",
    //                         name: "class1"
    //                     },
    //                     {
    //                         type: "docid",
    //                         valid: "([[:alnum:]]+|-)",
    //                         name: "doc1"
    //                     },
    //                     {
    //                         type: "class",
    //                         valid: "^[a-zA-Z0-9_\\s]{0,50}$",
    //                         name: "class2"
    //                     },
    //                     {
    //                         type: "docid",
    //                         valid: "([[:alnum:]]+|-)",
    //                         name: "doc2"
    //                     }
    //                 ]
    //             }
    //             let domain = dbManage.createDoc(db, configDatabase.NOTEBOOK_NOTE_CLASS,
    //                 "class",
    //                 params_domain
    //             )
    //             // Create domain and add reference to note schema
    //             domain.then((res_1) => {
    //                 // in res there should be the id of the domain
    //                 params_note.schema = params_note.schema.concat(
    //                     {
    //                         type: "docid",
    //                         valid: "([[:alnum:]]+|-)",
    //                         name: "notebook"
    //                     }
    //                 )
    //                 dbManage.updateDoc(db, configDatabase.NOTE_CLASS, "class", params_note).then(
    //                     (response) => {// console.log("dbinit - updated note schema", response)
    //                     }
    //                 ).catch(err => {// console.log("dbinit - couldn't update note schema", err))
    //                 })
    //             })
    //             db.put({
    //                 _id: "init",
    //                 init: true
    //             }).then(res_2 => {
    //                 resolve(res_2)
    //             }).catch(err_1 => {
    //                 reject(err_1)
    //             })
    //         } else {
    //             // console.log("initdb - db already initialized, consider purge")
    //         }
    //     } catch (err_2) {
    //         reject(new Error("initdb -  something went wrong", err_2))
    //     }
    // }

    // /**
    //  * @description dump - return a string representing the dump of a db
    //  * @param {PouchDB.Database<{}>} db database to dump
    //  * @param {JSON} opt options
    //  * @type {Promise}
    //  * [TODO] COnsider removing db parm and use instead class defined
    //  */
    // async dumpdb (db, opt) {
    //     var out = '';
    //     var stream = new MemoryStream();
    //     stream.on('data', chunk => {
    //         out += chunk.toString();
    //     });
    //     let dump;
    //     opt ? dump = db.dump(stream, opt) : dump = db.dump(stream)
    //     return dump.then(res => {
    //         if (res.ok) {
    //             // console.log('dbDump - dump file', out);
    //             return out;
    //         } else {
    //             return new Error("Error: " + res);
    //         }
    //     });
    // }
}

export default DbManager