const showCropImage = (imageFile) => {
    let croppieDiv = document.getElementById('croppieDiv');
    let acceptDiv = document.getElementById('acceptDiv');
    let croppieImage = document.getElementById('croppieImage');
    let resultImage = document.getElementById('resultImage');
    let acceptCroppieButton = document.getElementById('acceptCroppieButton');

    getBase64(imageFile).then(response => {
        croppieImage.setAttribute('src', response);
        let croppie = new Croppie(croppieImage, 
            {
                viewport: { width: 300, height: 300, type: 'circle' },
                boundary: { width: 300, height: 300 },
                showZoomer: true
            }
        );
        croppieDiv.setAttribute('style','display: flex;');
        acceptDiv.setAttribute('style', 'display: flex;');

        acceptCroppieButton.onclick = () => {
            croppie.result('base64').then(response => {
                resultImage.setAttribute('src', response);
                croppieDiv.setAttribute('style','display: none;');
                acceptDiv.setAttribute('style', 'display: none;');
                croppie.destroy();
            });
        };

    });

};

const configureButtons = () => {
    let imageFile = document.getElementById('imageFile');
    imageFile.onchange = () => {
        showCropImage(imageFile.files[0]);
    };

    let acceptButton = document.getElementById('acceptButton');
    acceptButton.onclick = () => {

    };
};

window.onload = () => {
    checkLog();
    configureButtons();
};

