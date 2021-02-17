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
                let selectSectors = document.getElementById('sectorsSelect');
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

const loadCKEditor = () => {
    ClassicEditor
			.create(document.getElementById('editor'), {
				toolbar: {
					items: [
						'heading',
						'|',
						'bold',
						'italic',
						'underline',
						'link',
						'bulletedList',
						'numberedList',
						'|',
						'indent',
						'outdent',
						'|',
						'imageUpload',
						'blockQuote',
						'insertTable',
						'mediaEmbed',
						'undo',
						'redo',
						'alignment',
						'fontColor',
						'fontSize',
						'fontFamily',
						'htmlEmbed'
					]
				},
                fontFamily: {
                    options: [
                        'default',
                        'Open Sans, sans-serif',
                        'Open Sans Condensed, sans-serif'
                    ]
                },
				language: 'es',
				image: {
					toolbar: [
						'imageTextAlternative',
						'imageStyle:full',
						'imageStyle:side'
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
				licenseKey: '',
				
			} )
			.then( editor => {
				window.editor = editor;
			})
			.catch( error => {
				console.error( 'Oops, something went wrong!' );
				console.error( 'Please, report the following error on https://github.com/ckeditor/ckeditor5/issues with the build id and the error stack trace:' );
				console.warn( 'Build id: u3b6b2ya8l9-k78ivl77mrkc' );
				console.error( error );
			} );
};


const configureArticleButtons = () => {
    let introArticleDiv = document.getElementById('introArticleDiv');
    let articleEditorDiv = document.getElementById('articleEditorDiv');

    let showEditorButton = document.getElementById('showEditorButton');
    showEditorButton.onclick = () => {
        introArticleDiv.classList.remove('division');
        introArticleDiv.classList.add('hidden');
        articleEditorDiv.classList.remove('hidden');
        articleEditorDiv.classList.add('division');
    };

    let acceptEditorButton = document.getElementById('acceptEditorButton');
    let uploadArticleButton = document.getElementById('uploadArticleButton');
    acceptEditorButton.onclick = () => {
        setEditorResults();
        introArticleDiv.classList.add('division');
        introArticleDiv.classList.remove('hidden');
        articleEditorDiv.classList.add('hidden');
        articleEditorDiv.classList.remove('division');
        uploadArticleButton.classList.remove('hidden');
    }
    uploadArticleButton.onclick = checkReadinessAndUpload;


};

const setEditorResults = () => {
    let articleResult = document.getElementById('articleResult');
    articleResult.innerHTML = window.editor.getData();
};

const checkReadinessAndUpload = () => {
    let articleTitle = document.getElementById('articleTitle');
    let shortDescTitle = document.getElementById('shortDescTitle');
    let imageFileArticle = document.getElementById('imageFileArticle');
    let resultImageArticle = document.getElementById('resultImageArticle');
    let carouselArticle = document.getElementById('carouselArticle');
    let newsArticle = document.getElementById('newsArticle');
    let highlightedArticle = document.getElementById('highlightedArticle');
    let sectorsSelect = document.getElementById('sectorsSelect');
    let keywordsArticle = document.getElementById('keywordsArticle');
    
    let articleResult = document.getElementById('articleResult');
    let showEditorButton = document.getElementById('showEditorButton');
    
    let ready = true;
    let articleParams = {};

    if(!articleTitle.value && ready){
        ready = false;
        articleTitle.setAttribute('style', 'border: 3px red solid;');
    } else {
        articleTitle.removeAttribute('style');
        articleParams.title = articleTitle.value;
    }
    if(!shortDescTitle.value && ready){
        ready = false;
        shortDescTitle.setAttribute('style', 'border: 3px red solid;');
    } else {
        shortDescTitle.removeAttribute('style');
        articleParams.short_description = shortDescTitle.value;
    }
    if(!resultImageArticle.getAttribute('src') && ready){
        ready = false;
        imageFileArticle.setAttribute('style', 'border: 3px red solid;');
    } else {
        imageFileArticle.removeAttribute('style');
        articleParams.image_content = resultImageArticle.getAttribute('src');
    }
    if(!keywordsArticle.value && ready) {
        ready = false;
        keywordsArticle.setAttribute('style', 'border: 3px red solid;');
    } else {
        keywordsArticle.removeAttribute('style');
        articleParams.keywords = keywordsArticle.value;
    }
    if(!articleResult.innerHTML && ready){
        ready = false;
        showEditorButton.setAttribute('style', showEditorButton.getAttribute('style') + ' border: 3px red solid;');
    } else {
        showEditorButton.setAttribute('style', 'margin: 20px 0;');
        articleParams.html_content = articleResult.innerHTML;
    }



    if(ready) {
        articleParams.in_carousel = carouselArticle.checked ? 1 : 0;
        articleParams.in_news = newsArticle.checked ? 1 : 0;
        articleParams.in_highlight = highlightedArticle.checked ? 1 : 0;
        articleParams.sectorId = sectorsSelect.value;
    }

};
