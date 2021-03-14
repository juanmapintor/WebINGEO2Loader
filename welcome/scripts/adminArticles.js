const showCropImageArticle = (imageFile) => {
    
    let croppieDiv = document.getElementById('croppieDivArticle');
    let croppieImage = document.createElement('img');
    let acceptDiv = document.getElementById('acceptDivArticle');
    let resultDiv = document.getElementById('resultDivArticle');

    
    let resultImage = document.getElementById('resultImageArticle');
    let acceptCroppieButton = document.getElementById('acceptCroppieButtonArticle');
    
    croppieDiv.innerHTML = '';
    croppieDiv.appendChild(croppieImage);

    resultDiv.setAttribute('style', 'display: none;');

    let w = document.getElementById('croppieTD').offsetWidth;
    let h = (768.0*w)/1024.0;

    getBase64(imageFile).then(response => {
        croppieImage.setAttribute('src', response);
        let croppie = new Croppie(croppieImage, 
            {
                boundary: { width: w, height: h },
                viewport: { width: w, height: h },
                showZoomer: true
            }
        );
        croppieDiv.setAttribute('style','display: flex;');
        acceptDiv.setAttribute('style', 'display: flex;');

        acceptCroppieButton.onclick = () => {
            croppie.result({
                type: 'base64',
                size: {width: 1024, height: 768},
                format: 'png',
                quality: 1
            }).then(response => {
                resultImage.setAttribute('src', response);
                resultImage.setAttribute('style', 'width: 100%; max-width: '+w+'px;');
                resultDiv.setAttribute('style', 'display: flex; margin: 20px 0;');
                croppieDiv.setAttribute('style','display: none;');
                acceptDiv.setAttribute('style', 'display: none;');
                croppie.destroy();
            });
        };

    });

};

const onArticleChange = () => {
    let imageFile = document.getElementById('imageFileArticle');
    imageFile.onchange = () => {
        showCropImageArticle(imageFile.files[0]);
    };
}; 

const loadArticleSectorsSelect = () => {
    httpRequestPromise(general_url+'get_user_info.php', null, 'POST', 'json').then(response =>  {
        if(response){
            if(!response.error){
                hideMsg();
                let selectSectors = document.getElementById('sectorsSelect');
                selectSectors.innerHTML = '';
                response.sectors.forEach(sector => {
                    let newSelect = document.createElement('option');
                    newSelect.setAttribute('value', sector[0]);
                    newSelect.innerHTML = sector[1] + ' - ' + sector[2];
                    selectSectors.appendChild(newSelect);
                });
            } else {
                showMsg(true, response.error);
            }
        }
    });
};

const loadCKEditor = (id = 'editor') => {
        ClassicEditor
        .create(document.getElementById(id), {
            fontFamily: {
                options: [
                    'default',
                    'Open Sans, sans-serif',
                    'Open Sans Condensed, sans-serif',
                    'Arial, sans-serif',
                    'Courier New, sans-serif',
                    'Georgia',
                    'Lucida Sans Unicode, sans-serif',
                    'Tahoma, sans-serif',
                    'Times New Roman',
                    'Trebuchet MS, sans-serif',
                    'Verdana, sans-serif'
                ],
                supportAllValues: true
            },
            toolbar: {
                items: [
                    'heading',
                    '|',
                    'bold',
                    'italic',
                    'link',
                    'underline',
                    'alignment',
                    'bulletedList',
                    'numberedList',
                    '|',
                    'indent',
                    'outdent',
                    '|',
                    'fontColor',
                    'fontBackgroundColor',
                    'fontSize',
                    'fontFamily',
                    'highlight',
                    '|',
                    'horizontalLine',
                    '|',
                    'imageInsert',
                    'blockQuote',
                    'insertTable',
                    'htmlEmbed',
                    '|',
                    'undo',
                    'redo'
                ]
            },
            language: 'es',
            image: {
                styles: [
                    'alignLeft', 'alignCenter', 'alignRight'
                ],
                toolbar: [
                    'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
                    '|',
                    'imageResize',
                    '|',
                    'imageTextAlternative',
                    'imageStyle:full',
                    'imageStyle:side',
                    'linkImage'
                ]
            },
            table: {
                contentToolbar: [
                    'tableColumn',
                    'tableRow',
                    'mergeTableCells',
                    'tableCellProperties',
                    'tableProperties'
                ]
            },
            simpleUpload: {
                uploadUrl: general_url + 'simple_uploader.php'
            }
        } )
			.then( editor => {
				window[id] = editor;
			})
			.catch( error => {
				console.error( 'Oops, something went wrong!' );
				console.error( error );
			} );
};

const configureArticleButtons = () => {
    let introArticleDiv = document.getElementById('introArticleDiv');
    let articleEditorDiv = document.getElementById('articleEditorDiv');

    let showEditorButton = document.getElementById('showEditorButton');
    showEditorButton.onclick = () => {
        let articleParams = {};
        if(checkReadiness(articleParams)){
            showMsg(false, 'Subiendo, por favor espere...', 0);
            httpRequestPromise(general_url + 'article_semi_upload.php', articleParams, 'POST', 'json').then(response => {
                if(response.success){
                    hideMsg();
                    introArticleDiv.classList.remove('division');
                    introArticleDiv.classList.add('hidden');
                    articleEditorDiv.classList.remove('hidden');
                    articleEditorDiv.classList.add('division');
                } else {
                    showMsg(true, response.error);
                }
            });
        }
        
    };

    let acceptEditorButton = document.getElementById('acceptEditorButton');
    let cancelEditorButton = document.getElementById('cancelEditorButton');
    let editArticleButton = document.getElementById('editArticleButton');
    
    acceptEditorButton.onclick = () => {
        setEditorResults();
    };

    editArticleButton.onclick = () => {
        document.getElementById('articleResult').classList.add('hidden');
        document.getElementById('editArticleButton').classList.add('hidden');
        document.getElementById('editor').classList.remove('hidden');
        document.getElementById('acceptEditorButton').classList.remove('hidden');
        document.getElementById('uploadArticleButton').classList.add('hidden');
        loadCKEditor();
    };

    cancelEditorButton.onclick = () => {
        httpRequestPromise(general_url + 'cancel_article.php').then(response => {
            if(response) {
                if(response.success) {
                    showMsg(false, "Articulo Eliminado");
                    introArticleDiv.classList.add('division');
                    introArticleDiv.classList.remove('hidden');
                    articleEditorDiv.classList.add('hidden');
                    articleEditorDiv.classList.remove('division');
                    reset();
                } else {
                    showMsg(true, response.error);
                }
            } else {
                showMsg(true, "No hay respuesta");
            }
        });
    };

    document.getElementById('uploadArticleButton').onclick = () => {
        let params = {
            html_content: document.getElementById('articleResult').innerHTML
        };
        showMsg(false, 'Subiendo, por favor espere...', 0);
        httpRequestPromise(general_url + 'article_finish_upload.php', params, 'POST', 'json').then(response => {
            if(response){
                if(response.success){
                    showMsg(false, 'Articulo subido!');
                    introArticleDiv.classList.add('division');
                    introArticleDiv.classList.remove('hidden');
                    articleEditorDiv.classList.add('hidden');
                    articleEditorDiv.classList.remove('division');
                    reset();
                    loadArticles();
                } else {
                    showMsg(true, response.error);
                }
            }
        });
    };
};

const setEditorResults = (editorId = 'editor', resultDivId = 'articleResult') => {
    let data = window[editorId].getData();
    if(data) {
        let articleResult = document.getElementById(resultDivId);
        articleResult.innerHTML = data;
        window.editor.destroy();
        document.getElementById('editor').classList.add('hidden');
        document.getElementById('articleResult').classList.remove('hidden');
        document.getElementById('acceptEditorButton').classList.add('hidden');
        document.getElementById('uploadArticleButton').classList.remove('hidden');
        document.getElementById('editArticleButton').classList.remove('hidden');
    } else {
        showMsg(true, "Agregue contenido a su artículo primero.");
    }
    
};

const checkReadiness = (articleParams) => {
    let articleTitle = document.getElementById('articleTitle');
    let shortDescTitle = document.getElementById('shortDescTitle');
    let imageFileArticle = document.getElementById('imageFileArticle');
    let resultImageArticle = document.getElementById('resultImageArticle');
    let carouselArticle = document.getElementById('carouselArticle');
    let newsArticle = document.getElementById('newsArticle');
    let highlightedArticle = document.getElementById('highlightedArticle');
    let sectorsSelect = document.getElementById('sectorsSelect');
    let keywordsArticle = document.getElementById('keywordsArticle');


    if(!articleTitle.value){
        articleTitle.setAttribute('style', 'border: 3px red solid;');
        return false;
    } else {
        articleTitle.removeAttribute('style');
        articleParams.title = articleTitle.value;
    }
    if(!shortDescTitle.value){
        shortDescTitle.setAttribute('style', 'border: 3px red solid;');
        return false;
    } else {
        shortDescTitle.removeAttribute('style');
        articleParams.short_description = shortDescTitle.value;
    }
    if(!resultImageArticle.getAttribute('src')){
        imageFileArticle.setAttribute('style', 'border: 3px red solid;');
        let acceptEditorButton = document.getElementById('acceptCroppieButtonArticle');
        let buttonStyle = acceptEditorButton.getAttribute('style') ? acceptEditorButton.getAttribute('style') + 'background-color: red;' : 'background-color: red;';
        acceptEditorButton.setAttribute('style', buttonStyle);
        return false;
    } else {
        imageFileArticle.removeAttribute('style');
        articleParams.image_content = resultImageArticle.getAttribute('src');
    }
    if(!keywordsArticle.value) {
        keywordsArticle.setAttribute('style', 'border: 3px red solid;');
        return false;
    } else {
        keywordsArticle.removeAttribute('style');
        articleParams.keywords = keywordsArticle.value;
    }
    
    articleParams.in_carousel = carouselArticle.checked ? 1 : 0;
    articleParams.in_news = newsArticle.checked ? 1 : 0;
    articleParams.in_highlight = highlightedArticle.checked ? 1 : 0;
    articleParams.sectorId = sectorsSelect.value;

    return true;

};

const loadArticles = () => {
    httpRequestPromise(general_url + 'articles_load.php').then(response => {
        if(response){
            if(!response.error) {
                let articlesTable = document.getElementById('articlesTable');
                articlesTable.innerHTML = '';
                let newRow = articlesTable.insertRow(0);
                newRow.insertCell().innerHTML = 'Titulo';
                newRow.insertCell().innerHTML = 'Descripción';
                newRow.insertCell().innerHTML = 'Fecha';
                newRow.insertCell().innerHTML = 'Sector';
                newRow.insertCell().innerHTML = 'Eliminar';
                if(response.length > 0){
                    response.forEach(article => {
                        let newInfoRow = articlesTable.insertRow();
                        newInfoRow.insertCell().innerHTML = article[0];
                        newInfoRow.insertCell().innerHTML = article[1];
                        newInfoRow.insertCell().innerHTML = article[2];
                        newInfoRow.insertCell().innerHTML = article[3] + ' - ' + article[4];
                        let newActionCell = newInfoRow.insertCell();
                        let newAction = document.createElement('button');
                        newActionCell.classList.add('delTd');
                        newAction.innerHTML = 'X';
                        newAction.addEventListener('click', () => deleteArticle(article[5]));
                        newActionCell.appendChild(newAction);
                    });
                } else {
                    articlesTable.insertRow().innerHTML = "No hay articulos propios en este momento. Crea uno!";
                }
                
            } else {
                showMsg(true, response.error);
            }
        }
    });
};

const deleteArticle = (current_article) =>{
    let params = {
        article: current_article
    };

    showMsg(false, "Eliminando articulo...", 0);
    httpRequestPromise(general_url + 'delete_article.php', params, 'POST', 'json').then(response =>{
        if(response) {
            if(response.success){
                hideMsg();
                loadArticles();
            } else {
                showMsg(true, response.error);
            }
        }
    });
};
