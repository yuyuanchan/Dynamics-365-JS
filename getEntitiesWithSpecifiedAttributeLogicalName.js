// determine which entity contains the specified attribute (field) with Fetch API
var attributeLogicalName = 'emailaddress'; // specify the logical name of the attribute

async function getEntitiesWithSpecifiedAttributeLogicalName(attribute) {
    let request =
    {
		'headers': {
			'accept': 'application/json',
			'accept-language': 'en-US,en;q=0.9',
			'content-type': 'application/json; charset=UTF-8',
			'odata-maxversion': '4.0',
			'odata-version': '4.0',
		},
		'method': 'GET',
		'mode': 'cors',
		'credentials': 'include'
    };
    let results;
    // fetching entity metadata alongside with attribute metadata that matches the condition specified
    console.log(new Date().toLocaleString() + " Checking entity metadata");
    await fetch(Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/EntityDefinitions?$select=LogicalName&$expand=Attributes($select=LogicalName;$filter=LogicalName eq '" + attribute + "')", request)
    .then(response => response.json())
    .then(data => {
    console.log(results = data);
    })
    .catch(error => console.error(error));
    // process the result and find which entity has the specified attribute
    let i = 1;
    console.log(new Date().toLocaleString() + " Listing all entities that have the attribute '" + attribute + "':");
    results["value"].forEach(function (entityMetadata){
        if (entityMetadata.Attributes.length != 0) {
            console.log(i++ + ". Logical Name: " + entityMetadata.LogicalName + ", Metadata Id: " + entityMetadata.MetadataId);
        }
    })
}

getEntitiesWithSpecifiedAttributeLogicalName(attributeLogicalName);
