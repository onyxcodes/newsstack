import Attribute from '../Attribute'
import DbManager from '..';

const CLASS_TYPE = "class";
const SUPERCLASS_TYPE = "superclass";
const CLASS_TYPES = [CLASS_TYPE, SUPERCLASS_TYPE];

class Class {
    constructor(dbName, name, type = CLASS_TYPE, title = name, parentClassName = null) {
        this.name = name;
        this.title = title;
        this.setType(type);
        this.attributes = [];
        this.setParentClass(parentClassName);
        if ( dbName ) this.dbName = dbName;
        // this.model = {}; // model is calculated only
        // or could be stored only after calling getModel() ?
    }

    getName() {
        return this.name;
    }

    getDbName() {
        return this.dbName;
    }

    getDbManager() {
        let dbName = this.getDbName();
        let db = new DbManager(dbName);
        return db;
    }

    getTitle() {
        return this.title;
    }

    getType() {
        return this.type;
    }

    getModel() {
        let model = {};
        model["name"] = this.getName();
        model["description"] = this.getTitle();
        model["schema"] = [];
        // iterate over attributes and append their model
        for ( let attribute of this.getAttributes() ) {
            let attributeModel = attribute.getModel();
            model["schema"].push( attributeModel );
        }
        return model;
    }

    setType( type ) {
        if ( this.checkTypeValidity(type) ) {
            this.type = type;
            // if ( this.type === SUPERCLASS_TYPE ) this.isSuperclass = true;
        } else throw Error("Class - Invalid type: "+type)
        // return this?
    }

    async getSuperClassIfExists( superClassName ) {
        let db = this.getDbManager();
        let schema = await db.getClassModel(SUPERCLASS_TYPE, superClassName);

    }

    setParentClass( superClassName ) {
        let parentClass = this.getSuperClassIfExists(superClassName);
        if ( parentClass ) {
            // ereditate all attributes
            parentClass.getAttributes()
            this.parentClass = parentClass;
        }
    }

    checkTypeValidity( type ) {
        let validity = false;
        if ( CLASS_TYPES.includes(type) ) {
            validity = true;
        }
        validity = type == CLASS_TYPE;
        return validity;
    }

    getAttributes( ...names ) {
        let attributes = [ ];
        for ( let attribute of this.attributes ) {
            if ( names.length > 0 ) {
                // filter with given names
                for ( let name of names ) {
                    // match?
                    if ( name != null && attribute.getName() == name ) {
                        return [ attribute ];
                    } 
                }
            } else attributes.push(attribute); // no filter, add all
        }
        return attributes
    }

    hasAllAttributes( ...names ) {
        let result = false;
        let attributes = this.getAttributes(names);
        for ( let attribute of attributes ) {
            result = names.includes(attribute.getName())
            if ( result ) break;
        }
        return result;
    }

    hasAnyAttributes( ...names ) {
        let result = false;
        let attributes = this.getAttributes(names);
        for ( let attribute of attributes ) {
            result = names.includes(attribute.getName())
            if ( !result ) break;
        }
        return result;
    }

    // interface of hasAllAttributes
    hasAttribute( name ) {
        return this.hasAnyAttributes( name )
    }

    /**
     * 
     * @param {Attribute} attribute 
     */
    addAttribute( attribute ) {
        try {
            let name = attribute.getName();
            if ( !this.hasAttribute(name) ) {
                this.attributes.push(attribute);
                // Check if this class has subclasses

            } else throw Error("Attribute with name "+name+" already exists within this Class")
            // TODO: improve error above
        } catch (e) {
            // TODO:
            console.log("Class - got error while adding attribute",e);
        }
    }

    addNewAttribute( name, type ) {
        try {
            if ( !this.hasAttribute(name) ) {
                let attribute = new Attribute(this, name, type);
                this.attributes.push(attribute);
            } else throw Error("Attribute with name "+name+" already exists within this Class")
            // TODO: improve error above
        } catch (e) {
            // TODO:
            console.log("Class - got error while adding attribute",e);
        }
    }
}


export default Class;