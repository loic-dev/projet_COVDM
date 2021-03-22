/*[
    {
        "name":"",
        "adress":"",
        "pays":"",
        "region":"",
        "departement":"",
        "phone":"",
        "email":"",
        "prestation":"",
        "patient":[{
            "id":""
        }],
        "vaccinDispo":""    
    }
]*/
import faker from 'faker';







const generateData = (req,res) => {
    const { number } = req.body;
    const test = rrag.random();
    console.log(test)
    let center = {
        name:faker.name.firstName()+" "+faker.name.lastName(),
        adress:rrag.fr(),
        pays:"france"
        
    }
    
    
    console.log(center)

}

export default generateData;


