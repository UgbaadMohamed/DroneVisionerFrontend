// Use fetch to get the header content and insert it into the placeholder


async function submitForm() {
    console.log("should work now")

    captureDeviceId = document.getElementById('captureDeviceId').value

    window.location.href = `../test.html?captureDeviceId=${captureDeviceId}`;

}


   /* const brand = document.getElementById('brand').value;
    const version = document.getElementById('version').value;
    const visualMediaType = document.getElementById('visualMediaType').value;


    // Check if the visual media type already exists in the backend
    const existingVisualMediaTypeResponse = await fetch(`http://localhost:8085/visualMediaType?type_Name=${visualMediaType}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    let visualMediaTypeID;


    if (existingVisualMediaTypeResponse.ok) {
        const existingVisualMediaTypeData = await existingVisualMediaTypeResponse.json();


        if (existingVisualMediaTypeData.length > 0) {
            // Use the existing visual media type ID based on the type
            switch (visualMediaType.toLowerCase()) {
                case "drone":
                    visualMediaTypeID = existingVisualMediaTypeData.find(type => type.type_Name.toLowerCase() === "drone").visualMediaType_ID;
                    break;
                case "photo":
                    visualMediaTypeID = existingVisualMediaTypeData.find(type => type.type_Name.toLowerCase() === "photo").visualMediaType_ID;
                    break;
                case "video":
                    visualMediaTypeID = existingVisualMediaTypeData.find(type => type.type_Name.toLowerCase() === "video").visualMediaType_ID;
                    break;
                default:
                    console.error('Invalid visual media type');
                    return;
            }
        } else {
            // Create a new visual media type if it doesn't exist
            const newVisualMediaTypeResponse = await fetch('http://localhost:8085/PostVisualMediaType', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type_Name: visualMediaType,
                }),
            });


            const newVisualMediaTypeData = await newVisualMediaTypeResponse.json();
            visualMediaTypeID = newVisualMediaTypeData.visualMediaType_ID;
        }


        console.log('Existing Visual Media Type Data:', existingVisualMediaTypeData);


        // Post CaptureDevice to the backend
        const captureDeviceResponse = await fetch('http://localhost:8085/captureDevice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                brand: brand,
                version: version,
                visualMediaType: {
                    visualMediaType_ID: visualMediaTypeID,
                },
            }),
        });*/


        // const captureDeviceData = await captureDeviceResponse.json();
        //
        // const captureDeviceId = captureDeviceData.captureDevice_ID; // Use the correct property name
        //
        // console.log('Capture Device ID:', captureDeviceId);



   /* } else {
        console.error('Error fetching existing visual media type');
    }*/








