import Attribute from '../Attribute'

const CLASS_TYPE = "class";
const DOMAIN_TYPE = "domain";
const SCHEMA_TYPES = [CLASS_TYPE, DOMAIN_TYPE];


class Schema {
    constructor(name, type = CLASS_TYPE, description = name) {
        this.name = name;
        this.description = description;
        this.setType(type);
        this.attributes = [];
        // this.model = {}; // model is calculated only
        // or could be stored only after calling getModel() ?
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    getType() {
        return this.type;
    }

    getModel() {
        let model = {};
        model["name"] = this.getName();
        model["description"] = this.getDescription();
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
        } else throw Error("Schema - Invalid type: "+type)
        // return this?
    }

    checkTypeValidity( type ) {
        let validity = false;
        if ( SCHEMA_TYPES.includes(type) ) {
            validity = true;
        }
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
        let attributes = this.getAttributes(names);
        if ( attributes.length == names.length) {
            return true;
        } else return false
    }

    // hasAnyAttributes()
    // interface of hasAllAttributes
    hasAttribute( name ) {
        return this.hasAllAttributes( name )
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
            } else throw Error("Attribute with name "+name+" already exists within this Schema")
            // TODO: improve error above
        } catch (e) {
            // TODO:
            console.log("Schema - got error while adding attribute",e);
        }
    }

    addNewAttribute( name, type ) {
        try {
            if ( !this.hasAttribute(name) ) {
                let attribute = new Attribute(this, name, type);
                this.attributes.push(attribute);
            } else throw Error("Attribute with name "+name+" already exists within this Schema")
            // TODO: improve error above
        } catch (e) {
            // TODO:
            console.log("Schema - got error while adding attribute",e);
        }
    }
}


export default Schema;