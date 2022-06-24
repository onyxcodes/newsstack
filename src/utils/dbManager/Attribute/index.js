
const ATTRIBUTE_TYPES = ["string", "number", "integer"];

class Attribute {
    constructor(schema, name, type, config) {
        // [TODO] Should check if attribute with this name
        // already exist whithin its context
        this.name = name;
        this.model = {}
        this.setModel({
            name: this.name
        });
        this.setType(type, config)
        // TODO: check if this is just a reference and it doesnt cause
        // performance problems
        this.schema = schema;
    }

    getModel() {
        return this.model || {};
    }

    setModel( model ) {
        let currentModel = this.getModel();
        debugger;
        model = Object.assign(currentModel, model);
        this.model = model;
    }
    
    setType( type, config ) {
        if ( this.checkTypeValidity(type) ) {
            let model = {};
            model.valid = this.getTypeRegex(type, config);
            model.type = type;
            this.setModel(model);
        } else throw Error("Invalid attribute type: "+type)
        // return this?
    }

    // getType()

    getName() {
        return this.name;
    }

    checkTypeValidity(type) {
        let validity = false;
        if ( ATTRIBUTE_TYPES.includes(type) ) {
            validity = true;
        }
        return validity;
    }

    // TODO: change to imported const default configs for types
    getTypeRegex( type, config ) {
        config = Object.assign({ charLength: 50, isArray: false }, config );
        switch( type ) {
            // TOOD: add missing cases and change values to imported const 
            case "string":
            default:
                return "^[a-zA-Z0-9_\\s]".concat("{0,"+config.charLength+"}$");
        }
    }
}

export default Attribute;