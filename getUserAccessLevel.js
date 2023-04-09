/*
The code below is designed specifically to check for user access in bulk and then output Excel friendly results.
This code needs to be ran within developer console while in the context of a Dynamics 365 environment.
*/

// Paste CSV between the quotes ("") below
// make sure there are no line breaks in the CSV or you will get an error about unexpected input
let input = "";

async function getUserAccessLevel(dnStr) {
    if (dnStr === "") {
        console.log("No input provided.");
        return;
    }
    let dnArr = dnStr.split(","); // split CSV into array of alias
    let table = "systemuser"; // entity to run the query on
    let output = `Alias\tBU\tRoles\tTeams\n`; // string for output table header
    let aliasFound = 0; // count how many alias are found

    // loop to query for and process each alias
    for (let i = 0; i < dnArr.length; i++) {
        let query = `?$filter=domainname eq '${dnArr[i]}' and isdisabled eq false&$select=domainname,fullname&$expand=businessunitid($select=name),systemuserroles_association($select=name),teammembership_association($select=name)`; // query options for the Web API
        await Xrm.WebApi.retrieveMultipleRecords(table,query).then(
            function success(result) { // success callback
                if (result.entities.length > 0) { // at least 1 record is found
                    aliasFound++;
                    let u = result.entities[0];
                    output = output.concat(`${dnArr[i]}\t${u.businessunitid.name}\t`);
                    let roles = u.systemuserroles_association;
                    for (let i = 0; i < roles.length; i++) {
                        if (i != roles.length - 1) {
                            output = output.concat(`${roles[i].name},`);
                        }
                        else {
                            output = output.concat(`${roles[i].name}`);
                        }
                    }
                    output = output.concat(`\t`);
                    let teams = u.teammembership_association;
                    for (let i = 0; i < teams.length; i++) {
                        if (i != teams.length - 1) {
                            output = output.concat(`${teams[i].name},`);
                        }
                        else {
                            output = output.concat(`${teams[i].name}`);
                        }
                    }
                    output = output.concat(`\n`);
                }
                else {
                    output = output.concat(`${dnArr[i]}\tAlias not found\t\t\n`);
                }
            },
            function (error) { // error callback
                output = output.concat(`${dnArr[i]}\tError\t\t\n`);
                console.log(error);
            }
        );
    }
    console.log(`${dnArr.length} alias provided. ${aliasFound} alias found.`);
    return output;
}

getUserAccessLevel(input).then(
    result => console.log(result) // print Excel friendly result
)