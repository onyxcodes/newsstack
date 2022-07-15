import axios from "axios";

// TODO: change defaults to const imports

export default ( query, count = 20, locale = "uk_UA" ) => {
    return new Promise ( (resolve, reject) => {
        if ( query ) {
            axios({
                "method": "GET",
                "url": "/search/feeds",
                "headers": {
                    "crossorigin":true,
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Headers": "*"
                }, "params": {
                    "query": encodeURI(query),
                    "count": count,
                    "locale": encodeURI(locale)
                }
            })
            .then(({data}) => {
                if (data && data?.results?.length) resolve(data.results)
            })
            .catch((error) => {
                console.log(error)
            })
        } else resolve([])
        
    });
}