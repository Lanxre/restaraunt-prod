function Enum(obj)
{
    const newObj = {};
    for( const prop in obj )
    {
        if (obj.hasOwnProperty(prop)) {
            newObj[prop] = obj[prop];
        }
    }
    return Object.freeze(newObj);
}

const Role = Enum({ Admin: 1, Manager:2, Customer:3, SalePerson:4 });

export {
    Role
}