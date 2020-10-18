// determine which roles contains the specified privilge with XRM Client API
var prvName = 'prvWriteQuery'; // specify the name of the privilege here

async function fetchRolesWithSpecifiedPrivilegeName(privilege) {
    let results;
    // fetching privilegeid
    console.log(new Date().toLocaleString() + " Fetching privilegeid for the specified prvName");
    await Xrm.WebApi.retrieveMultipleRecords("privilege", "?$filter=name eq '" + privilege + "'").then(
        function success(result) {
            console.log(results = result);
        },
        function (error) {
            console.log(error.message);
        }
    );
    // fetching roleids
    console.log(new Date().toLocaleString() + " Fetching roleids using the privilegeid from above");
    let prvId = results.entities[0].privilegeid; // directly accessing first element because there is only one entry for each privilege
    await Xrm.WebApi.retrieveMultipleRecords("roleprivileges", "?$filter=privilegeid eq " + prvId).then(
        function success(result) {
            console.log(results = result); // this can return multiple records, will be used later
        },
        function (error) {
            console.log(error.message);
        }
    );
    // fetching the name for each roleid
    console.log(new Date().toLocaleString() + " Fetching the name of the security roles for each of the roleid above");
    console.log("List of security roles that have privilege '" + prvName + "':");
    let i = 1;
    results.entities.forEach(function (role) { // looping through the results
        Xrm.WebApi.retrieveRecord("role", role.roleid).then(
            function success(result) {
                console.log(i++ + ". Name: " + result.name + ", Id: " + role.roleid);
            },
            function (error) {
                console.log(error.message);
            }
        );
    })
}

fetchRolesWithSpecifiedPrivilegeName(prvName);
