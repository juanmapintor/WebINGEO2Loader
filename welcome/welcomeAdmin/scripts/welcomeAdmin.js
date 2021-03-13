const configureParticularButtons = () => {
    configureSectorButtons();
    configureUsersButtons();
};

const onParticularChange = () => {
    onSectorChange();
};

window.onload = () => {
    checkLog(true);
    configureTabs();
    configureButtons();
    configureParticularButtons();
    loadSector('delete', delSector);
    loadUsers();
    loadProfile();
    loadArticles();
    loadArticleSectorsSelect();
    loadCKEditor();
    onChange();
    onParticularChange();
};

const reset = () => {
    let inputs = [
        document.getElementById('email'),
        document.getElementById('sector_category'),
        document.getElementById('sector_name'),
        document.getElementById('articleTitle'),
        document.getElementById('imageFileArticle'),
        document.getElementById('keywordsArticle'),
        document.getElementById('imageFile'),
        document.getElementById('first_name_mod'),
        document.getElementById('last_name_mod'),
        document.getElementById('user_name_mod'),
        document.getElementById('email_mod'),
        document.getElementById('degree_mod'),
        document.getElementById('phone_mod'),
        document.getElementById('weblink_mod'),
        document.getElementById('oldPasswordMod'),
        document.getElementById('oldPasswordRepeatMod'),
        document.getElementById('newPasswordMod'),
        document.getElementById('newPasswordRepeatMod'),
    ];
    inputs.forEach(input => {
        if(input) input.value = null;
    });
    let checkBoxes = [
        document.getElementById('is_admin'),
        document.getElementById('carouselArticle'),
        document.getElementById('newsArticle'),
        document.getElementById('highlightedArticle')
    ];
    checkBoxes.forEach(checkbox => {
        if(checkbox) checkbox.checked = false;
    });
    let textareas = [
        document.getElementById('shortDescTitle'),
        document.getElementById('short_description_mod')
    ];
    textareas.forEach(textarea =>{
        if(textarea) textarea.value = null;
    });
    let imageResults = [
        document.getElementById('resultImageArticle'),
        document.getElementById('resultImage'),
        document.getElementById('croppieImageArticle'),
        document.getElementById('croppieImage'),
    ];
    imageResults.forEach(image =>{
        if(image) image.setAttribute('src', '');
    });
    let innerEmpty = [
        document.getElementById('articleResult')
    ];
    innerEmpty.forEach(innerElement => {
        if(innerElement) innerElement.innerHTML = null;
    });
}





