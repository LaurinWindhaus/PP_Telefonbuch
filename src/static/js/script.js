const document_id = document.getElementById('document_id').textContent.trim();
const imagesCount = document.getElementById("image_count").innerHTML;
const images = document.getElementById("images").innerHTML;

const imageContainer = document.getElementById('image_container');
JSON.parse(images).forEach(image => {
    loadImageToDocument(image.url, image.width, image.height);
});

const dragArea = document.getElementById('dragArea');
const fileInput = document.getElementById('fileInput');

document.addEventListener('DOMContentLoaded', function () {
    const toggleEditModeCheckbox = document.getElementById('toogle_edit_mode');
    if (toggleEditModeCheckbox) {
        toggleEditModeCheckbox.addEventListener('change', function () {
            if (this.checked) {
                enableAllFormFields();
            } else {
                disableAllFormFields();
            }
        });
    }
});

dragArea.addEventListener('click', () => fileInput.click());

function handleFilesEvent(event) {
    let files;
    if (event.type === "drop") {
        event.preventDefault();
        files = event.dataTransfer.files;
    } else {
        files = this.files;
    }
    if (files.length > 0) {
        const file = files[0];
        if (file.type.match('image.*')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    const width = img.width;
                    const height = img.height;
                    const base64StringWithMimeType = e.target.result;
                    saveFileToStorage(base64StringWithMimeType, width, height);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please select an image file.");
        }
    }
}

fileInput.addEventListener('change', handleFilesEvent, false);
dragArea.addEventListener('drop', handleFilesEvent, false);

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dragArea.addEventListener(eventName, function(e) {
        e.preventDefault();
        e.stopPropagation();
    }, false);
});

function saveFileToStorage(base64StringWithMimeType, width, height) {
    fetch("/fileservice/file/upload", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            base64str: base64StringWithMimeType
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(`Error ${response.status}: ${errorData.message}`);
            });
        }
        return response.json();
    })
    .then(data => {
        saveUrlToDocument(data.url, width, height);
    })
    .catch((error) => {
        console.error('Error:', error);
        if (error.message.includes('Error')) {
            alert("Es ist ein Fehler beim speichern aufgetreten.");
        }
    });
}

function saveUrlToDocument(url, width, height) {
    fetch("/dsd/image/upload", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            document_id: document_id,
            url: url,
            width: width,
            height: height
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(`Error ${response.status}: ${errorData.message}`);
            });
        }
        return response.json();
    })
    .then(data => {
        loadImageToDocument(url, width, height);
    })
}

function loadImageToDocument(url, width, height) {
    subContainer = document.createElement("div");
    subContainer.id = url;
    subContainer.style.margin = "5px";
    deleteButton = document.createElement("button");
    deleteButton.classList = "btn btn-danger edit-mode";
    deleteButton.id = "delete_"+url;
    deleteButton.innerHTML = "Löschen";
    deleteButton.style.margin = "5px";
    deleteButton.onclick = function() {
        deleteImageFromDocument(url);
        document.getElementById(url)
        document.getElementById(url).remove();
        document.getElementById("delete_"+url).remove();
        document.getElementById("slider_"+url).remove();
    };
    slider = document.createElement("input");
    slider.type = "range";
    slider.min = "1";
    slider.max = "200";
    slider.value = "100";
    slider.classList = "edit-mode";
    slider.id = "slider_"+url;
    slider.style.margin = "5px";
    (function(url, width, height) {
        slider.oninput = function() {
            var imageWidth = width * this.value / 100;
            var imageHeight = height * this.value / 100;
            document.getElementById("image_" + url).style.width = imageWidth + "px";
            document.getElementById("image_" + url).style.height = imageHeight + "px"; // Maintain aspect ratio if desired
        };
    })(url, width, height);
    imageContainer.append(slider);
    imageContainer.append(deleteButton);
    image = document.createElement("div");
    image.id = "image_"+url;
    image.style.backgroundImage = "url('"+url+"')";
    image.style.backgroundSize = "contain";
    image.style.backgroundRepeat = "no-repeat";
    image.style.backgroundPosition = "center";
    image.style.width = width+"px"; // Set the width
    image.style.height = height+"px"; // Set the height
    subContainer.append(image);
    imageContainer.append(subContainer);
}

async function deleteImageFromDocument(url) {
    try {
        const response1 = await fetch("/dsd/image/delete", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                document_id: document_id,
                image_url: url
            })
        });
        const data1 = await response1.json();
        if (!response1.ok) {
            throw new Error(`Error ${response1.status}: ${data1.message}`);
        }
        const response2 = await fetch("/fileservice/file/delete", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filename: url.split('/').pop()
            })
        });
        const data2 = await response2.json();
        if (!response2.ok) {
            throw new Error(`Error ${response2.status}: ${data2.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Es ist ein Fehler beim Löschen aufgetreten.");
    }
}

function updateDocumentInputValues(document_id) {
    data = {};
    artikelnummer = document.getElementById('artikelnummer').value.trim();
    verpackungsart = document.getElementById('verpackungsart').value.trim();

    data['datum'] = document.getElementById('datum').value.trim();
    data['aenderungsstand'] = document.getElementById('aenderungsstand').value.trim();
    data['freigabe'] = document.getElementById('freigabe').value.trim();
    data['gebindeart'] = document.getElementById('gebindeart').value.trim();
    data['sonstige_hilfsmittel'] = document.getElementById('sonstige_hilfsmittel').value.trim();
    data['palettentyp'] = document.getElementById('palettentyp').value.trim();
    data['proses_datum'] = document.getElementById('proses_datum').value.trim();
    data['teile_lage'] = document.getElementById('teile_lage').value.trim();
    data['lagen_gebinde'] = document.getElementById('lagen_gebinde').value.trim();
    data['teile_gebinde'] = document.getElementById('teile_gebinde').value.trim();
    data['gebinde_palette'] = document.getElementById('gebinde_palette').value.trim();
    data['anweisung'] = {};
    data['anweisung']['anweisung1'] = document.getElementById('anweisung1').value.trim();
    data['anweisung']['anweisung2'] = document.getElementById('anweisung2').value.trim();
    data['anweisung']['anweisung3'] = document.getElementById('anweisung3').value.trim();
    data['anweisung']['anweisung4'] = document.getElementById('anweisung4').value.trim();
    data['anweisung']['anweisung5'] = document.getElementById('anweisung5').value.trim();
    data['anweisung']['anweisung6'] = document.getElementById('anweisung6').value.trim();
    data['anweisung']['anweisung7'] = document.getElementById('anweisung7').value.trim();
    data['anweisung']['anweisung8'] = document.getElementById('anweisung8').value.trim();
    data['anweisung']['anweisung9'] = document.getElementById('anweisung9').value.trim();

    console.log({artikelnummer, verpackungsart, data});

    fetch("/dsd/document/update/"+document_id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            artikelnummer : artikelnummer,
            verpackungsart : verpackungsart,
            data : data
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(`Error ${response.status}: ${errorData.message}`);
            });
        }
        return response.json();
    })
    .catch((error) => {
        console.error('Error:', error);
        if (error.message.includes('Error')) {
            alert("Es ist ein Fehler beim speichern aufgetreten.");
        }
    });
}

function updateDocumentImageValues(document_id) {
    var image_properties = [];
    var images = document.getElementById('image_container').children;
    for (var i = 0; i < images.length; i++) {
        if (images[i].tagName === "DIV") {
            image_properties.push({
                "image_url": images[i].id,
                "width": images[i].querySelector('div').style.width,
                "height": images[i].querySelector('div').style.height
            });
        }    
    }
    console.log(image_properties);
    fetch("/dsd/image/update/"+document_id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            images: image_properties 
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(`Error ${response.status}: ${errorData.message}`);
            });
        }
        redirectToMainPage();
        return response.json();
    })
    .catch((error) => {
        console.error('Error:', error);
        if (error.message.includes('Error')) {
            alert("Es ist ein Fehler beim speichern aufgetreten.");
        }
    });
}

function updateDocument(document_id) {
    updateDocumentInputValues(document_id);
    updateDocumentImageValues(document_id);
}

async function deleteDocument(document_id) {
    const imageDeletionPromises = JSON.parse(images).map(image => {
        return deleteImageFromDocument(image.url);
    });
    try {
        await Promise.all(imageDeletionPromises);
        const response = await fetch("/dsd/document/delete/" + document_id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.message}`);
        }
        const data = await response.json();
        console.log(data);
        redirectToMainPage();
    } catch (error) {
        console.error('Error:', error);
        alert("Es ist ein Fehler beim Löschen aufgetreten.");
    }
}

function redirectToMainPage() {
  window.location.href = 'https://ppmesktech.poeppelmann.com/KTECH/100_Verpackungsvorschrift/';
}

function disableAllFormFields() {
    var formFields = document.querySelectorAll('.value');

    formFields.forEach(function(field) {
        field.disabled = true;
        field.style.backgroundColor = 'white';
        field.style.border = 'none';
        field.style.outline = 'none';
    });

    var editModeItems = document.querySelectorAll('.edit-mode');
    editModeItems.forEach(function(item) {
        item.style.display = 'none';
    });
}

function enableAllFormFields() {
    var formFields = document.querySelectorAll('.value');

    formFields.forEach(function(field) {
        field.disabled = false;
        field.style.backgroundColor = '';
        field.style.border = '';
        field.style.outline = ''; 
    });

    var editModeItems = document.querySelectorAll('.edit-mode');
    editModeItems.forEach(function(item) {
        item.style.display = '';
    });
}

function pdfErstellen() {
    console.log("PDF erstellen");
}