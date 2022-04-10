import axios from "axios";

export default ( query ) => {
    return new Promise ( (resolve, reject) => {
        axios({
            "method": "GET",
            "url": "https://feedsearch.dev/api/v1/search",
            "headers": {
                "crossorigin":true,
                "Content-Type": "application/json",
                "Access-Control-Allow-Headers": "*"
            }, "params": {
                "query": encodeURI(query)
            }
        })
        .then(({data}) => {
            if (data && data.length) resolve(data)
        })
        .catch((error) => {
            console.log(error)
        })
    });
}