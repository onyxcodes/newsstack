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
import Class from "./Class";
const CLASS_TYPE = "class";
const SUPERCLASS_TYPE = "superclass";
const CLASS_TYPES = [CLASS_TYPE, SUPERCLASS_TYPE];

class DbManager {
    /**
     * 
     * @param {String} dbName 
     */
    constructor(dbName, db = null) {
        /**
         * @property {PouchDB.Database<{}>} db
         */
        if ( dbName && !db ) this.db = new PouchDB(dbName)
        else if ( dbName == null ) throw new Error("Invalid database name", dbName);
        // TODo: improve db name check
        else if ( db ) this.db = db;

        this.lastDocId = 0;
    }

    static async build( dbManagerObj ) {
        debugger;
        dbManagerObj = await dbManagerObj.initdb();
        // dbManagerObj = await dbManagerObj.incrementLastDocId();
        return dbManagerObj;
    }

    async getLastDocId() {
        let lastDocId = 0;
        try {
            // let res = await this.db.info();
            // logger.info({"response": res}, "checkdb - Info");
            debugger;
            let doc = await this.db.get("lastDocId");
            lastDocId = doc.value;
            // lastDocId = await this.db.get("lastDocId")?.value;
        } catch (e) {
            logger.error({"error": e}, "checkdb - something went wrong");
        }
        // return ""+(lastDocId|| 0)
        return ""+lastDocId
    }

    async initdb () {
        try {
            let lastDocId = await this.getLastDocId();
            debugger;
            lastDocId = Number(lastDocId);
            // console.log("initdb - res", res)
            if (!lastDocId) {
                // console.log("initdb - initializing db")
                let response = await this.db.put({
                    _id: "lastDocId",
                    value: ++lastDocId
                });
                if (response.ok) this.lastDocId = lastDocId;
                else throw new Error("Got problem while putting doc", response);
            } else {
                console.log("initdb - db already initialized, consider purge")
            }
            return this;
        } catch (e) {
            throw new Error("initdb -  something went wrong", e);
        }
    }

    async incrementLastDocId() {
        let docId = "lastDocId",
            _rev = await this.getDocRevision(docId);
        await this.db.put({
            _id: "lastDocId",
            _rev: _rev,
            value: ++this.lastDocId
        }).value;
        return this;
    }

    /**
     * @description cleardb - that's what it does
     * @param {PouchDB.Database<{}>} db
     * @returns {Promise<boolean>}
     */
    async clear () {
        try {
            let res = await this.db.destroy();
            if ( res.ok ) {
                logger.info("clear - Destroyed db");
                return true;
            }
            else throw new Error(res)
        } catch (e) {
            logger.error({"error": e}, "clear - Error while destroying db")
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
        let exists = await this.hasSchema( schemaType, schemaName );

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
    async getClassModel( name ) {
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
            logger.debug({ "response": indexRes }, 'getClassSchema - Fetched search index');
            let findRes = await db.find({
                selector: { class: 'class', _id: name },
                fields: ['_id', 'schema'],
            })
            let schema = findRes.docs?.[0]?.schema
            logger.info({"schema": schema}, "getClassSchema - Returning schema obj")
            return schema
        } catch (e) {
            logger.error({"error": e }, "getClassSchema - Got error while retrieving schema")
        }
    }

    /**
     * 
     * @param {String} name 
     * @returns {Promise<Boolean>}
     */
    async hasClass( name ) {
        let classModel = await this.getClassModel(name);
        return !!classModel;
    }

    // TODO: Check return type
    /**
     * 
     * @param {String} name 
     * @returns 
     */
     async getDomainModel( name ) {
        let db = this.db;
        try {
            /* Query the db to find the doc of class `class` and the
             * id of the class specified, and get its schema object
            **/
            let indexRes = await db.createIndex({
                index: {
                    fields: ['domain', '_id']
                }
            })
            logger.debug({ "response": indexRes }, 'getDomainModel - Fetched search index');
            let findRes = await db.find({
                selector: { domain: 'domain', _id: name },
                fields: ['_id', 'schema'],
            })
            let schema = findRes.docs?.[0]?.schema
            logger.info({"schema": schema}, "getDomainModel - Returning schema obj")
            return schema
        } catch (e) {
            logger.error({"error": e }, "getDomainModel - Got error while retrieving schema")
        }
    }

    /**
     * 
     * @param {String} name 
     * @returns {Promise<Boolean>}
     */
    async hasDomain( name ) {
        let domainModel = await this.getDomainModel(name);
        return !!domainModel;
    }

    async getModel( type, name ) {
        let model;
        switch (type) {
            case CLASS_TYPE:
            case SUPERCLASS_TYPE:
                model = await this.getClassModel(name);
                break;
            case DOMAIN_TYPE:
                model = await this.getDomainModel(name);
                break;
            default:
                throw new Error("Unexpected value for schema type: "+type);
        }
        return model;
    }

    /**
     * 
     * @param {String} name 
     * @returns {Promise<Boolean>}
     */
     async hasSchema( type, name ) {
        let model = await this.getModel(type, name);
        return !!model;
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
    prepareDoc (_id, type, params) {
        logger.info({_id: _id, type: type, params: params}, "prepaerDoc - given args");
        let doc = {};
        doc = Object.assign(doc, params);
        // TODO: consider managin defaults in another way, pouchdb plugin for triggers
        var defaults = { type: type, timestamp: new Date().toISOString() };
        if ( _id != null ) defaults = Object.assign(defaults, { _id: _id});
        doc = Object.assign(doc, defaults);
        logger.info({"doc": doc}, "prepareDoc - after elaborations");
        return doc;
    }

    async getDocRevision(docId) {
        let rev; 
        try {
            let doc = await this.db.get(docId);
            rev = doc?._rev;
        } catch (e) {
            throw new Error(e);
        }
        return rev;
    }

    async createDoc(docId, type, params) {
        let db = this.db,
            doc = {};
        try {
            doc = this.prepareDoc(docId, type, params);
            if ( docId ) {
                doc._rev = await this.getDocRevision(docId);
                if ( doc._rev == null ) throw new Error("Doc with given id `"+docId+"` was not found")
                // means that the given docId was not found
                // therefore throw error
            } else  {
                //generate controlled docId
                debugger;
                docId = ""+this.lastDocId+1;
            }
            doc = Object.assign({_id: docId}, doc);
            let response = await db.put(doc);
            logger.info({"response": response}, "createDoc - Response after put");
            if (response.ok) {
                this.incrementLastDocId();
                // let uploadedDoc = await db.get(response.id);
                // logger.info({"doc": uploadedDoc}, "createDoc - Uploaded doc")
                return response.id;
            }
            else throw new Error(response)
        } catch (e) {
            logger.error({
                "error": e,
                "document": doc
            }, "createDoc - Problem while putting doc")
            // throw new Error(e); // TODO understand if needed
        }
    }

    async addClass( classObj ) {
        // let doc = this.db.prepareDoc(null, classObj.getType(), classObj);
        let result = await this.createDoc(null, classObj.getType(), classObj.getModel());
        return result;
    }

    async updateClass( classObj ) {
        let result = await this.createDoc(classObj.getId(), classObj.getType(), classObj.getModel());
        return result;
    }
    ////////////////////////////////////////////////////

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